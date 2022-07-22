const gplay = require("google-play-scraper");
const path = require("path");
const _ = require("lodash");
const fs = require("fs");
const { Promise } = require("bluebird");
import natural from "natural";
const stemmer = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();
const csv = require("csvtojson");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

require("dotenv").config({ path: path.join(__dirname, "../../.env") });
require("../configs/mongoose.config");

const Models = require("../models");

main();
async function main() {
  await Promise.all([
    // getAppId(),
    getCommentFromCHplay()
    // step2()
  ]);

  // await getTranningSet();
  // await getTestingSet();
  console.log("DONE");
}
async function getAppId() {
  const apps = await Models.default.App.find({
    $or: [
      {
        appIdCHPlay: { $exists: false }
      },
      { appIdCHPlay: null },
      { appIdCHPlay: "" }
    ]
  }).select("appName appIdCHPlay");

  await Promise.map(
    apps,
    async app => {
      try {
        const [appCHPLAY] = await gplay.search({
          term: app.appName,
          num: 1
        });

        await Models.default.App.updateOne(
          {
            _id: app.id
          },
          {
            appIdCHPlay: appCHPLAY.appId
          }
        );
      } catch (err) {
        console.log(err.message);
      }

      return;
    },
    { concurrency: 1 }
  );
}

async function getCommentFromCHplay() {
  let apps = [];
  do {
    apps = await Models.default.App.aggregate([
      {
        $match: {
          appIdCHPlay: { $exists: true },
          isGotCommentV2: { $exists: false }
        }
      },
      { $sample: { size: 4 } },
      { $project: { appIdCHPlay: 1 } }
    ]);

    await Promise.all(apps.map(updateApp));
  } while (apps.length);

  console.log("DONE getCommentFromCHplay");
}

async function updateApp(app) {
  try {
    await Models.default.Comment.deleteMany({
      appId: app._id
    });
    let comments = [];

    let commentChunk = {};
    const limit = 3000;
    do {
      commentChunk = await gplay.reviews({
        appId: app.appIdCHPlay,
        sort: gplay.sort.RATING,
        num: limit,
        paginate: true,
        nextPaginationToken: commentChunk.nextPaginationToken || null
      });

      comments = [
        ...comments,
        ...(commentChunk.data || []).map(item => ({
          ...item,
          appId: app._id,
          comment: item.text,
          rating: item.scoreText
        }))
      ];
    } while (commentChunk.nextPaginationToken);

    await Models.default.Comment.insertMany(comments);

    await Models.default.App.updateOne(
      {
        _id: app._id
      },
      {
        isGotCommentV2: true
      }
    );
  } catch (error) {
    console.log(error);
  }
  return;
}

// get related
async function step2() {
  await Models.default.Comment.deleteMany({ comment: null });

  let comments = [];
  do {
    comments = await Models.default.Comment.aggregate([
      {
        $match: {
          isRelatedRail3: { $exists: false }
        }
      },
      { $sample: { size: 100 } },
      { $project: { comment: 1 } }
    ]);

    await Promise.all(
      comments.map(comment => {
        if (!comment.comment) return;
        const result = getRelatedForStep2(comment.comment);

        return Models.default.Comment.updateOne(
          {
            _id: comment._id
          },
          {
            ...result
          }
        );
      })
    );
  } while (comments.length);

  console.log("DONE step2");
}

function getKeywordsStem() {
  const keywords = [
    "Privacy",
    "Secure",
    "Personal",
    "Malicious",
    "Phishing",
    "Steal",
    "Security",
    "Permission",
    "Virus",
    "Access",
    "Fishing",
    "Thief",
    "Safe",
    "Identity",
    "Malware",
    "Fishy",
    "Stealth",
    "Creepy",
    "collect data",
    "share data",
    "location",
    "privacy policy",
    "third party",
    "other part",
    "3rd part"
  ];

  let stems;
  function _getKeywordsStem() {
    if (stems) return stems;

    return (stems = keywords.map(item =>
      item
        .split(" ")
        .map(stemmer.stem)
        .join(" ")
    ));
  }

  return _getKeywordsStem();
}

function getRelatedForStep2(comment) {
  const commentStem = tokenizer
    .tokenize(comment)
    .filter(item => !!item)
    .map(stemmer.stem)
    .join(" ");

  const keywordStem = getKeywordsStem();
  console.log(keywordStem);
  const isRelatedRail3 = keywordStem.some(item => commentStem.includes(item));

  return {
    isRelatedRail3
  };
}

async function getTranningSet() {
  let dataCSV = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/tuanle/Downloads/SP_Comment_TrainingDataset(Y-N).csv");

  const header = [
    // {
    //   id: "stt",
    //   title: "#"
    // },
    {
      id: "label",
      title: "label"
    },
    // {
    //   id: "char",
    //   title: "char"
    // },
    {
      id: "comment",
      title: "comment"
    }
  ];

  const training = [];
  for (let i = 0; i < dataCSV.length; i++) {
    const [stt, comment, label] = dataCSV[i];

    training.push({
      stt,
      label: label === "Y" ? 1 : 2,
      char: "q",
      comment: comment
    });
  }

  const csvWriter = createCsvWriter({
    path: "./training.csv",
    header
  });
  csvWriter.writeRecords(training);
  console.log("done");
}

async function getTestingSet() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "comment",
      title: "comment"
    }
  ];
  const comments = await Models.default.Comment.find({
    isRelatedRail3: true
  });

  const rows = [];
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];

    rows.push({
      stt: i,
      comment: comment.comment
    });
  }

  const csvWriter = createCsvWriter({
    path: "./testing.csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("done");
}
