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


	//TODO: Filter to just the written tweets
	var writtenOnly = tweet_array
	.forEach(tweet => tweet.written == true);

	var tweetHtmls 

	var logTarget = document.querySelector("tbody[id='tweetTable']");
	logTarget.innerHTML = 

// forEach(node => node.innerHTML = activityTypes.size);
    // const searchInput = document.querySelector("span[id='searchCount']");
	// searchInput.onsearch = () => {
	// 	console.log(`The term searched for was ${searchInput.value}`);
	// };

	// console.log(rows);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	var answers = "";


	const searchArea = document.querySelector("span[id='searchText']");
	searchArea.addEventListener("search", (event) => {

		oninput = (event) => {
			event.
		}  
		console.log("hello");
		console.log(`The term searched for was ${searchArea.value}`);

		// writtenOnly
		// .filter(tweet => tweet.includes(searchInput.value))
		// .forEach(target => answers += target.getHTMLTableRow);
	});

	return answers;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});