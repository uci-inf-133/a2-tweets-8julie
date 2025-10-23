function getSourceCount(tweet_array, source_target){
	const count = tweet_array.reduce(function(counter, currentTweet){
	if (currentTweet.source == source_target){
		counter += 1;
	}
	return counter;
}, 0);

	return count;
}

function getPct(count, total){
	return (count/total * 100).toFixed(2).toString() + "%";
}

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
	// document.addEventListener('DOMContentLoaded', function (event) {
	// alert("Page loaded!");
	// });

	const totalTweets = tweet_array.length;

	const tweetsWrittenCount = tweet_array.reduce(function(counter, currentTweet){
		if (currentTweet.written == true){
			counter += 1;
		}
		return counter;
	}, 0);

	const liveEventsCount = getSourceCount(tweet_array, 'live_event');
	const achievementsCount = getSourceCount(tweet_array, 'achievement');
	const completedEventCount = getSourceCount(tweet_array, 'completed_event');
	const miscellaneousCount = getSourceCount(tweet_array, 'miscellaneous');


	var completedEventsElems = document.querySelectorAll("span[class='completedEvents']");
	completedEventsElems.forEach(node => node.innerHTML = completedEventCount);

	var liveEventsElems = document.querySelectorAll("span[class='liveEvents']");
	liveEventsElems.forEach(node => node.innerHTML = liveEventsCount);

	var achievementsElems = document.querySelectorAll("span[class='achievements']");
	achievementsElems.forEach(node => node.innerHTML = achievementsCount);

	var miscellaneousElems = document.querySelectorAll("span[class='miscellaneous']");
	miscellaneousElems.forEach(node => node.innerHTML = miscellaneousCount);

	var writtenElems = document.querySelectorAll("span[class='written']");
	writtenElems.forEach(node => node.innerHTML = tweetsWrittenCount);

	// var completedEventsPct = document.querySelectorAll("span[class='completedEventsPct']");
	// completedEventsPct.forEach(node => node.innerHTML = getPct(completedEventCount, totalTweets));	

	document.querySelectorAll("span[class='completedEventsPct']").forEach(node => node.innerHTML = getPct(completedEventCount, totalTweets));	
	document.querySelectorAll("span[class='liveEventsPct']").forEach(node => node.innerHTML = getPct(liveEventsCount, totalTweets));	
	document.querySelectorAll("span[class='achievementsPct']").forEach(node => node.innerHTML = getPct(achievementsCount, totalTweets));	
	document.querySelectorAll("span[class='miscellaneousPct']").forEach(node => node.innerHTML = getPct(miscellaneousCount, totalTweets));	
	document.querySelectorAll("span[class='writtenPct']").forEach(node => node.innerHTML = getPct(tweetsWrittenCount, totalTweets));	
	
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