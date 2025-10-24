function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// did somebody delete this?
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});


	var rows = []

	//TODO: Filter to just the written tweets
	for (let i = 0; i < tweet_array.length; i++){
		var currentTweet = tweet_array[i];

		if (currentTweet.written == true){
			rows.push(currentTweet.writtenText)
		}
	}

	console.log(rows);
}
function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});