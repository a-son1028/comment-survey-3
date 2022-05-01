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
const dataTypes = {
  Connection: [
    'Bluetooth',           'Companion devices',
    'Connectivity status', 'DNS',
    'Inet',                'IP',
    'Link',                'Socket',
    'MAC',                 'Mailto',
    'Network type',        'Proxy',
    'Route',               'SSL',
    'URI',                 'VPN',
    'HTTP',                'NSD',
    'RTP',                 'SIP',
    'Wifi',                '',
    'NFC',                 'URL',
    'Cookie',              'Authenticator',
    'IDN',                 'Cache'
  ],
  Hardware: [
    'Camera',               'Flash',
    'Buffer',               '',
    'Accelerometer sensor', 'Temperature sensor',
    'Other sensors',        'Gyroscope sensor',
    'Heart beat sensor',    'Heart rate sensor',
    'Light sensor',         'Acceleration sensor',
    'Location sensor',      'Biometric',
    'Device model',         'Lens',
    'Screen',               'Display',
    'Fingerprint',          'Hardware type',
    'Keyboard',             'USB',
    'IMEI'
  ],
  'Health&Fitness': [
    'Bluetooth device', 'Google Fit',
    'Fitness activity', 'Time',
    'Glucose',          'Blood pressure',
    'Body position',    'Body tempurature',
    'Cervical',         'Meal',
    'Menstrual flow',   'Ovulation',
    'Oxygen',           'Sleep',
    ''
  ],
  Location: [
    'Latitude',            'Longitude',
    'Address',             'Country',
    '',                    'Local name',
    'Locale',              'Postal code',
    'Criteria',            'Geographic',
    'Local time',          'Measurement',
    'Navigation',          'GPS',
    'Longitude, Latitude', 'Destination',
    'Location type',       'Distance',
    'Accuracy',            'Speed',
    'Altitude',            'Bearing',
    'NMEA',                'Locale name',
    'Position',            'Location activity',
    'Vehicle',             'Duration',
    'Maps',                'Places',
    'Location name',       'Phone number'
  ],
  Media: [
    'Audio',         'Image',             'Player',
    'Video',         'Recorder',          'Scanner',
    'Microphone',    'Remote',            'Movie',
    'Music',         'Channels',          'Volume',
    'Device info',   'Audio manager',     'HDMI',
    'Sound',         'Playback',          'Headphone',
    'Presentation',  '',                  'Media type',
    'Timestamp',     'Audio track',       'Video quality',
    'Camera',        'Interface',         'Length',
    'Face detector', 'Media Cas',         'Session',
    'Codec',         'Callback',          'Color',
    'Feature',       'Profile',           'Encoder',
    'Controller',    'Media description', 'Media ID',
    'Media name',    'DRM',               'Key',
    'Media format',  'Metadata',          'Muxer',
    'Players',       'Voice',             'Router',
    'Display',       'Media connection',  'Sync',
    'Rating',        'Ringtone',          'TONE',
    'Processing',    'Environtmental',    'Equalizer',
    'Virtualizer',   'Browser',           'Effect',
    'Midi',          'Projection',        'TV',
    'Preview',       'Program',           'Flash',
    'GPS',           'Speed',             'Lens',
    'Light',         'Adapter',           'HTTP',
    'Sensor',        'Widget'
  ],
  Telephony: [
    'MMS',               'SMS',
    'ThreadsColumns',    'Carrier',
    'Service',           'Network type',
    'MNC',               'Roaming',
    'Cell',              'ICC',
    'Session',           'Phone number',
    'Phone status',      'Subscription',
    'Telephony manager', '',
    'Callback',          'UICC',
    'Voicemail',         'APN',
    'EUICC',             'Download',
    'File info',         'Group call',
    'MBMS'
  ],
  UserInfo: [
    'Account',       'Name',
    'Contact',       'User profile',
    'Address',       'Age',
    'Bigraphy',      'Birthdays',
    'Email',         'Gender',
    'Organizations', 'Bigraphic',
    'Nickname',      'Occupation',
    'Phone number',  'SIP',
    'URL'
  ]
}
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

function getStructureBySimiWords(securityKeyWords, structure) {
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

function getStructureByTypes(types, structure) {
	// get most similar words
	let securitySimiWords = {}
	
	for(let typeName of types) {
		const subItems = types[typeName]
	}

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
	const [securitySimiWords, securityStructure] = getStructureBySimiWords(securityKeyWords, structure)
	
	const privacyKeyWords = ['privacy', 'good', 'bad']
	const [privacySimiWords, privacyStructure] = getStructureBySimiWords(privacyKeyWords, structure)

	const collectionKeyWords = ['collection']
	const [collectionSimiWords, collectionStructure] = getStructureBySimiWords(collectionKeyWords, structure)

	const sharingKeyWords = ['sharing']
	const [sharingSimiWords, sharingStructure] = getStructureBySimiWords(sharingKeyWords, structure)
	return [
		securityKeyWords, securitySimiWords, securityStructure,
		privacyKeyWords, privacySimiWords, privacyStructure,
		collectionKeyWords, collectionSimiWords, collectionStructure,
		sharingKeyWords, sharingSimiWords, sharingStructure
	]
}

async function step1() {
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

async function step2() {
	console.log("Load model")
	// https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit?resourcekey=0-wjGZdNAUop6WykTtMip30g
	w2vModel  = await new Promise((resolve, reject) => {
		w2v.loadModel( process.env.W2V_MODEL, function( error, model ) {
			if(error) reject(error)
			
			resolve(model)
		});
	})

	const comments = await Models.Comment.find({
		isGetStructure: true
	})

	for(let i = 0; i < comments.length; i++) {
		console.log(`Running ${i+ 1}/${comments.length}`) 
		const comment = comments[i];

		let structure = await Models.CommentMeta.findOne({
			commentId: comment.id,
			key: 'structure'
		})
		structure = JSON.parse(structure.value)
		
		const [ securityKeyWords, securitySimiWords, securityStructure,
		privacyKeyWords, privacySimiWords, privacyStructure,
		collectionKeyWords, collectionSimiWords, collectionStructure,
		sharingKeyWords, sharingSimiWords, sharingStructure
		] = await getStructureBySimis(structure)
		
		await Models.Comment.updateOne({
			_id: comment.id
		}, {
			securityKeyWords, securitySimiWords, securityStructure,
			privacyKeyWords, privacySimiWords, privacyStructure,
			collectionKeyWords, collectionSimiWords, collectionStructure,
			sharingKeyWords, sharingSimiWords, sharingStructure
			// isAnalyzed: true
		})


		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'securityKeyWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'securitySimiWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'securityStructure'});

		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'privacyKeyWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'privacySimiWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'privacyStructure'});

		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'collectionKeyWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'collectionSimiWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'collectionStructure'});

		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'sharingKeyWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'sharingSimiWords'});
		await Models.CommentMeta.deleteMany({commentId: comment.id, key: 'sharingStructure'});

		await Models.CommentMeta.insertMany([
			{
				commentId: comment.id,
				key: 'securityKeyWords',
				value: JSON.stringify(securityKeyWords)
			},
			{
				commentId: comment.id,
				key: 'securitySimiWords',
				value: JSON.stringify(securitySimiWords)
			},
			{
				commentId: comment.id,
				key: 'securityStructure',
				value: JSON.stringify(securityStructure)
			},

			{
				commentId: comment.id,
				key: 'privacyKeyWords',
				value: JSON.stringify(privacyKeyWords)
			},
			{
				commentId: comment.id,
				key: 'privacySimiWords',
				value: JSON.stringify(privacySimiWords)
			},
			{
				commentId: comment.id,
				key: 'privacyStructure',
				value: JSON.stringify(privacyStructure)
			},

			{
				commentId: comment.id,
				key: 'collectionKeyWords',
				value: JSON.stringify(collectionKeyWords)
			},
			{
				commentId: comment.id,
				key: 'collectionSimiWords',
				value: JSON.stringify(collectionSimiWords)
			},
			{
				commentId: comment.id,
				key: 'collectionStructure',
				value: JSON.stringify(collectionStructure)
			},

			{
				commentId: comment.id,
				key: 'sharingKeyWords',
				value: JSON.stringify(sharingKeyWords)
			},
			{
				commentId: comment.id,
				key: 'sharingSimiWords',
				value: JSON.stringify(sharingSimiWords)
			},
			{
				commentId: comment.id,
				key: 'sharingStructure',
				value: JSON.stringify(sharingStructure)
			},
		])
	}
}
main()
async function main() {
	// await step1()
	await step2()
}

// file2()
async function file2(){
	let result = {}
	const data = await csv({
			noheader: true,
			output: "csv",
	}).fromFile("/Users/a1234/Downloads/file2.csv");

	data.forEach(item => {
		if(!result[item[1]]) result[item[1]] = []

		if(!result[item[1]].includes(item[7])) result[item[1]].push(item[7])
	})

	console.log(result)
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