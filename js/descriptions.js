var searchStr = "default search term";
var resultStr = `
    <tr>
            <th scope="row">None</th>
            <th scope="row">No Activity</th>
            <th scope="row">No Tweet</th>
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

	writtenOnly = tweet_array.filter(tweet => tweet.written == true);

	//TODO: Filter to just the written tweets
	// writtenOnly.forEach((item, index) => {
	// 	if (item.text.includes(searchStr)){
	// 		resultStr += item.getHTMLTableRow(index) + "\n";
	// 	}
	// });

	// var logTarget = document.querySelector("tbody[id='tweetTable']");
	// logTarget.innerHTML = resultStr;
}

function myListener(event){
	searchStr = event.target.value;

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

		var count = 0;

		resultTweets.forEach((tweet, index) => {
			resultStr += `<tr><th scope="row">${index}</th>` + tweet.getHTMLTableRow(0);
			count += 1;
		});
		
		document.querySelector("span[id='searchCount']").innerHTML = count;

	}

	getResult();

	var logTarget = document.querySelector("tbody[id='tweetTable']");
	logTarget.innerHTML = resultStr;
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