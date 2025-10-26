var searchStr = "default search string"; 
var myEvent = new Event("keyup");
var resultStr = "default result string";

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
	var writtenOnly = tweet_array.filter(tweet => tweet.written == true);
	writtenOnly.forEach((item, index) => {
		if (item.text.includes(searchStr)){
			resultStr += item.getHTMLTableRow(index) + "\n";
		}
	});

	// console.log("search string: ", searchStr, " input element: ", ${});

	var logTarget = document.querySelector("tbody[id='tweetTable']");
	
	// logTarget.innerHTML = 

	function handleEvent(event){
		searchTerm = event.target.value;
		

	}
// forEach(node => node.innerHTML = activityTypes.size);
    // const searchInput = document.querySelector("span[id='searchCount']");
	// searchInput.onsearch = () => {
	// 	console.log(`The term searched for was ${searchInput.value}`);
	// };

	// console.log(rows);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchArea = document.querySelector("input[id='textFilter']");

	searchArea.addEventListener("keyup", function (e) {
		searchStr = e.target.value;

		const logElement = document.getElementById('searchText');
		logElement.innerHTML = searchStr;	// yyayyy
		console.log(e.target.value); // current value

		myEvent = e;
		// write to: <span id="searchText"

		// console.log(this.className); // logs the className of my_element
		// console.log(e.currentTarget === this); // logs `true`
	});

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});