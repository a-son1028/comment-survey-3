import path from 'path';
require("dotenv").config({ path: path.join(__dirname, "../.env") });
import "../src/configs/mongoose.config";
import Models from "../src/models";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csvtojson");
import CoreNLP, { Properties, Pipeline } from 'corenlp';
import _ from 'lodash';
var w2v = require('word2vec');
var w2vModel;
const comment = 'Do not use this app, it is full of scammers. All they want you to do is take their word for how great the room is send you some generic pictures and ask for your security deposit without getting to see the room.'

async function getSentenceStructure(comment) {
	const selectedKeys = ["dobj","compound","case","obl","amod","nsubj","nmod"]
	const result = []
	const props = new Properties({
		annotators: 'tokenize,ssplit,pos,lemma,ner,parse',
		'outputFormat': 'json', 'timeout': 30000
	});
	const pipeline = new Pipeline(props, 'English'); // uses ConnectorServer by default
	const sent = new CoreNLP.simple.Expression(comment);

	const nlpResult = await pipeline.annotate(sent)

	nlpResult.toJSON().sentences.forEach(sentence => {
		const basicDependencies = sentence.toJSON()[3].toJSON()

		Object.entries(basicDependencies).forEach(([, dependent]) => {
			// {
			// 	dep: 'dobj',
			// 	governor: 31,
			// 	governorGloss: 'see',
			// 	dependent: 33,
			// 	dependentGloss: 'room'
			// }
			if(dependent.dep && selectedKeys.includes(dependent.dep)) {
				result.push(dependent)
			}
		})
	})

	return result
}

function getStructureBySimiWords(securityKeyWords, structure, w2vModel) {
	// get most similar words
	let securitySimiWords = {}
	
	for(let i = 0; i < securityKeyWords.length; i++) {
		const keyword = securityKeyWords[i];

		const mostSimilarWords = w2vModel.mostSimilar( keyword, 20 )
		securitySimiWords[keyword] = mostSimilarWords
	}
	console.log(3, securitySimiWords)
	
	const words = Object.entries(securitySimiWords).reduce((acc, [, wordsByKey]) => {
		acc = [...acc, ..._.map(wordsByKey, 'word').map(item => item.toLowerCase())]
		return acc
	}, []) 
	
	const result = structure.filter(item => {
		return words.includes(item.governorGloss) || words.includes(item.dependentGloss)
	})

	return [securitySimiWords, result]
}

// getStructureComment(comment)
async function getStructureComment(comment){ 
	console.log("getSentenceStructure")
	const structure = await getSentenceStructure(comment)

	return structure
}

async function getStructureBySimis(structure) {
	const securityKeyWords = ['security', 'good', 'bad']
	const [securitySimiWords, securityStructure] = getStructureBySimiWords(securityKeyWords, structure, w2vModel)
	
	const privacyKeyWords = ['privacy', 'good', 'bad']
	const [privacySimiWords, privacyStructure] = getStructureBySimiWords(privacyKeyWords, structure, w2vModel)

	return [
		securityKeyWords, securitySimiWords, securityStructure,
		privacyKeyWords, privacySimiWords, privacyStructure
	]
}
main()
async function main() {
	console.log("Load model")
	// https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit?resourcekey=0-wjGZdNAUop6WykTtMip30g
	w2vModel  = await new Promise((resolve, reject) => {
		w2v.loadModel( process.env.W2V_MODEL, function( error, model ) {
			if(error) reject(error)
			
			resolve(model)
		});
	})

	const comments = await Models.Comment.find({
		isGetStructure: {$ne: true}
	})
	
	for(let i = 0; i < comments.length; i++) {
		console.log(`Running ${i+ 1}/${comments.length}`)
		const comment = comments[i];


		// const [securityKeyWords, securitySimiWords, securityStructure, structure] = await getStructureComment(comment.comment)
		const structure = await retry(getStructureComment(comment.comment), 10)

		await Models.Comment.updateOne({
			_id: comment.id
		}, {
			isGetStructure: true
		})

		await Models.CommentMeta.insertMany([
			// {
			// 	commentId: comment.id,
			// 	key: 'securityKeyWords',
			// 	value: JSON.stringify(securityKeyWords)
			// },
			// {
			// 	commentId: comment.id,
			// 	key: 'securitySimiWords',
			// 	value: JSON.stringify(securitySimiWords)
			// },
			// {
			// 	commentId: comment.id,
			// 	key: 'securityStructure',
			// 	value: JSON.stringify(securityStructure)
			// },
			{
				commentId: comment.id,
				key: 'structure',
				value: JSON.stringify(structure)
			}
		])
	}
}

async function retry (promise, time) {
  let counter = 1
  let status = false
  let result

  do {
    try {
      result = await promise
      status = true
    } catch (error) {
      result = error
      counter++

			await sleep(10 * 1000)
    }
  } while (!status && counter <= time)

  if (!status) throw result

  return result
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}