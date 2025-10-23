function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerHTML = tweet_array.length;	

	// my code:
	document.addEventListener('DOMContentLoaded', function (event) {
	alert("Page loaded!");
	});

	const tweetsWrittenCount = tweet_array.reduce(function(counter, currentTweet){
		if (currentTweet.written == true){
			counter += 1;
		}
		return counter;
	}, 0);

	const liveEventsCount = tweet_array.reduce(function(counter, currentTweet){
		if (currentTweet.source == 'live_event'){
			counter += 1;
		}
		return counter;
	}, 0);

	const achievementsCount = tweet_array.reduce(function(counter, currentTweet){
		if (currentTweet.source == 'achievement'){
			counter += 1;
		}
		return counter;
	}, 0);

	const completedEventCount = tweet_array.reduce(function(counter, currentTweet){
		if (currentTweet.source == 'completed_event'){
			counter += 1;
		}
		return counter;
	}, 0);

	const miscellaneousCount = tweet_array.reduce(function(counter, currentTweet){
		if (currentTweet.source == 'miscellaneous'){
			counter += 1;
		}
		return counter;
	}, 0);


	console.log("completedEventCount: ", completedEventCount)

	var completedEventsElems = document.querySelectorAll("span[class='completedEvents']");
	completedEventsElems.forEach(node => node.innerHTML = completedEventCount);

	var liveEventsElems = document.querySelectorAll("span[class='liveEvents']");
	liveEventsElems.forEach(node => node.innerHTML = liveEventsCount);

	var achievementsElems = document.querySelectorAll("span[class='achievements']");
	achievementsElems.forEach(node => node.innerHTML = achievementsCount);

	var miscellaneousElems = document.querySelectorAll("span[class='miscellaneous']");
	miscellaneousElems.forEach(node => node.innerHTML = miscellaneousCount);

	// This works for one element
	// var completedEventsElems = document.querySelector("span[class='completedEvents']");
	// // completedEventsElems.namedItem
	// completedEventsElems.innerHTML = completedEventCount;
	// console.log("currently: ", completedEventsElems.innerHTML);

	

    // <p>Testing: <span id="myTester">???</span> yup yup</p>

	// var testerText = document.getElementById('myTester')[0].innerText;
	// console.log(testerText,'heyyyyyy');

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});