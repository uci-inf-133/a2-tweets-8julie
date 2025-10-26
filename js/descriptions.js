var searchStr = "default search term";
var defaultStr = `
    <tr>

    </tr>
`;

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
	writtenOnly = tweet_array.filter(tweet => tweet.written == true);
}

function myListener(event){
	searchStr = event.target.value;
	var count = 0;

	function getResult(){
		var resultTweets = [];

		resultStr = "";

		writtenOnly.forEach((item) => {
			var writtenText = item.writtenText;
			if (writtenText.includes(searchStr)){
				// console.log(index);
				resultTweets.push(item); // you don't need the index
			}
		});

		resultTweets.forEach((tweet, index) => {
			resultStr += tweet.getHTMLTableRow(index + 1);
			count += 1;
		});
	}

	if (searchStr == ""){
		resultStr = defaultStr;
	}
	else{
		getResult();
	}

	var logTarget = document.querySelector("tbody[id='tweetTable']");
	logTarget.innerHTML = resultStr;
	document.querySelector("span[id='searchCount']").innerHTML = count;
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchArea = document.querySelector("input[id='textFilter']");

	searchArea.addEventListener("keyup", function (e) {
		searchStr = e.target.value;

		const logElement = document.getElementById('searchText');
		logElement.innerHTML = searchStr;	// displays the search term as it gets edited

		console.log(e.target.value); // current value

		myListener(e);
	});

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});