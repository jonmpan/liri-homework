//Look into automated testing
//Twitter API call
var Twitter = require('twitter');
var client = new Twitter(require('./key.js').twitterKeys);
var say = require('say');
//Sets Query for everything except for Do What It Says
var setQuery = ()=>{
	if (command == 'search-tweets' || command == 'stream-tweets' || command == 'read-tweet'){
		if(process.argv[3]){
			query = process.argv[3];
		}
		else{
			query = 'poop';
		}
	}
	else if (command == 'my-tweets'){
		if(process.argv[3]){
			query = process.argv[3];
		}
		else{
			query = 'tathecat563'
		}
	}
	else if(command == 'spotify-this-song'){
		if(process.argv[3]){
			query = process.argv[3];
		}
		else{
			query = 'The Sign';
		}
	}
	else if(command == 'movie-this'){
		if(process.argv[3]){
			query = process.argv[3];
		}
		else{
			query = 'mr.nobody';
		}
	}
}
//Ends Set Query
//Waiting for results
var displayLines = '---------------------------------------------';
var waiting = ()=>{
	console.log(displayLines);
	console.log('Waiting for server response/results');
	console.log(displayLines);
}
//End Waiting for results
//Help command
var help = ()=>{
	console.log(displayLines);	
	console.log('liri.js my-tweets "insert username in quotes here" 20');
	console.log('');
	console.log('My tweets based on specific username');	
	console.log('20 specifies the number of results');
	console.log('If no username, defaults to the creator of this app, tathecat563');
	console.log(displayLines);
	console.log('liri.js search-tweets "insert search term in quotes here" 20');
	console.log('');
	console.log('Searches Twitter for tweets with specific keywords');
	console.log('20 specifies the number of results');
	console.log('If no search term, defaults to poop');
	console.log(displayLines);
	console.log('liri.js read-tweet "insert search term in quotes here"');
	console.log('');
	console.log('Searches Twitter for 1 tweet and then Liri reads it to you');
	console.log('20 specifies the number of results');
	console.log('If no search term, defaults to poop');
	console.log(displayLines);	
	console.log('liri.js stream-tweets "insert search term in quotes here"');
	console.log('');
	console.log('Stream tweets based on specific keywords');
	console.log('If no search term, defaults to poop');
	console.log('Press ctrl+c to stop the stream');
	console.log(displayLines);
	console.log('liri.js spotify-this-song "insert search term in quotes here" 10');
	console.log('');
	console.log('Searches Spotify based on song name');
	console.log('10 specifies the number of results');
	console.log(displayLines);
	console.log('liri.js movie-this "insert movie name in quotes here"');
	console.log('');
	console.log('Searches OMDB based on movie name');
	console.log('Movie name must be an exact match to return the correct result');
	console.log(displayLines);
	console.log('liri.js do-what-it-says');
	console.log('');
	console.log('Make liri do something somewhat random');
	console.log(displayLines);
}
//When the user inputs something that is not a command, execute this
var command = require('./liri.js');
var notACommand = ()=>{
	console.log(displayLines);
	console.log('"'+command+'" is not a command.');
	console.log('For a list of commands, use liri.js -help');
	console.log(displayLines);
	say.speak('wub a lubb a dub dub, shoe wop do wop plippity plop poopity peep shoopity shmippity bippity boop everrrrrrrrrrrrrrrrrrrrrrrrr nerdidodedadudidydedadudodudodudodudodudidididididideded, get shwifty');
}
//Using promises for search tweets and my tweets
var searchTweets = ()=>{
	var payload = {q: query, count: count};
	client.get('search/tweets', payload)
		  .then(function(tweets){
				waiting();
				var i = 1;
				var twitterObject = tweets.statuses;
				twitterObject.forEach(function(tweet){
					console.log('#'+i+' By: '+tweet.user.name);
					console.log('On: '+tweet.user.created_at);
					console.log('');
					console.log(tweet.text);
					console.log(displayLines);
					i++;
					if(command == 'read-tweet'){
						say.speak(tweet.text);
					}
		  		})
		  })
	.catch(function(error){
		console.log(error);
	});
}

var myTweets = ()=>{
	var payload = {screen_name: query, count: count};
	client.get('statuses/user_timeline', payload)
		  .then(function(tweets){
				waiting();
				var i = 1;
				tweets.forEach(function(tweet){
					console.log('#'+i+' By: '+tweet.user.name);
					console.log('On: '+tweet.user.created_at);
					console.log('');
					console.log(tweet.text);
					console.log(displayLines);			
					i++;
		  })
	})
	.catch(function(error){
		console.log(error);
	});
}
//Stream tweets does not use a promise
var streamTweets = ()=>{
	var payload = {track: query};
	client.stream('statuses/filter', payload,  function(stream) {
		waiting();
		var i = 1;
		stream.on('data', function(tweet) {
			console.log('#'+i+' By: '+tweet.user.name);
			console.log('On: '+tweet.user.created_at);
			console.log('');
			console.log(tweet.text);
			console.log(displayLines);
			i++;
		});
		stream.on('error', function(error) {
			console.log(error);
		});
	});		
}
//End Twitter API call
//Spotify API
var Spotify = require('node-spotify-api');
var spotifyThisSong = ()=>{
	waiting();
	var spotify = new Spotify(require('./key.js').spotifyKeys);
	var i = 1;
	payload = {type: 'track', query: query, limit: count};
	spotify.search(payload, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		data.tracks.items.forEach(function(stuff){
			console.log('#'+i+' Artist: '+stuff.album.artists[0].name);
			console.log('Album Name: '+stuff.album.name);
			console.log('Song Name: '+stuff.name);
			console.log('Spotify URL: '+stuff.external_urls.spotify);
			console.log(displayLines);
			i++;
		});
	});
}
//End Spotify API
//Begin OMDB API Request
var request = require("request");
var movieThis = ()=>{
	waiting();
	var omdbKey = require('./key.js').omdbKey;
	var payload = "http://www.omdbapi.com/?t="+query+"&y=&plot=short&apikey="+omdbKey+""
	request(payload, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var movieData = JSON.parse(body);
			if(movieData.Title != undefined){
				console.log("Title: "+movieData.Title);
				console.log("Year: "+movieData.Year);
				console.log("IMDB Rating: " +movieData.imdbRating);
				//Many Movies do not have a Rotten Tomato rating, this hopefully addresses that
				movieData.Ratings.forEach(function(data){
					var z = 0;
					if(data.Source){
						console.log(data.Source+" Rating: "+data.Value);
					}
					else{
						z++;
						if(z == movieData.Ratings.length){
							console.log("No Ratings");
						}
					}
				})
				//Logs the movie's data
				console.log("Produced in: "+movieData.Country);
				console.log("Plot: "+movieData.Plot);
				console.log("Actors: "+movieData.Actors);
				console.log(displayLines);
			}
			else{
				console.log('No Movie Results');
				console.log(displayLines);
			}
		}
	});
}
//End OMDB API request
//Do What It Says randomly chooses an action from random.txt
var fs = require('fs');
var doWhatItSays = ()=>{
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err) throw err;
		//Sets the command and query for Liri to execute
		var randomThings = data.split(';');
		var random = Math.floor(Math.random()*randomThings.length);
		var randomThing = JSON.parse(randomThings[random]);
		var newCommand = randomThing.command;
		query = randomThing.query;
		//Displays what Liri is executing
		console.log(displayLines);
		console.log('Executing '+newCommand);
		console.log('With query '+query);
		//Chooses the proper function based on the command
		if(newCommand == 'my-tweets'){
			count = 20;
			myTweets();
		}
		else if(newCommand == 'search-tweets'){
			count = 20;
			searchTweets();
		}
		else if(newCommand == 'read-tweet'){
			count = 1;
			command = 'read-tweet';
			searchTweets();
		}
		else if(newCommand == 'stream-tweets'){
			streamTweets();
		}
		else if(newCommand == 'spotify-this-song'){
			count = 10;
			spotifyThisSong();
		}
		else if(newCommand == 'movie-this'){
			movieThis();
		}
	})
}
//End Do What It Says
//Export functions to liri.js
module.exports = {
	setQuery: setQuery,
	help: help,
	notACommand: notACommand,
	searchTweets: searchTweets,
	myTweets: myTweets,
	streamTweets: streamTweets,
	spotifyThisSong: spotifyThisSong,
	movieThis: movieThis,
	doWhatItSays: doWhatItSays
}