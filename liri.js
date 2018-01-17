//Setting up the 'request' node package for API calls
const request = require('request');

//User input command Liri and export command input
var command = process.argv[2];
module.exports = command;

//Commands Import
var commands = require('./commands.js');

//Sets query based on if the user inputted a search query. Use switch and helper method to refactor(?)
if (command == 'search-tweets' || command == 'stream-tweets' || command == 'my-tweets' || command == 'spotify-this-song' || command == 'movie-this' || command == 'read-tweet' || command == 'say-this'){
	commands.setQuery();
	if(command == 'read-tweet'){
		count = 1;
	}
}

//Sets count if the user inputs a number after their search query
if (process.argv[4] && command != 'read-tweet' && command != 'say-this'){
	count = process.argv[4];
}
else {
	if(command == 'my-tweets' || command == 'search-tweets'){
		count = 20;
	}
	if(command == 'spotify-this-song'){
		count = 10;
	}
}

//Executes Command. Use switch to refactor
if(command == 'search-tweets'){
	commands.searchTweets();
}
else if(command == 'read-tweet'){
	commands.readTweet();
}
else if(command == 'my-tweets'){
	commands.myTweets();
}
else if(command == 'stream-tweets'){
	commands.streamTweets();
}
else if(command == 'spotify-this-song'){
	commands.spotifyThisSong();
}
else if(command == 'movie-this'){
	commands.movieThis();
}
else if(command == 'do-what-it-says'){
	commands.doWhatItSays();
}
else if(command == '-help'){
	commands.help();
}
else if(command == 'say-this'){
	commands.sayThis();
}
else if(command == 'random-trump-quote'){
	commands.randomTrumpQuote();
}
else{
	commands.notACommand();
}

