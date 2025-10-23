function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or 
	// manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	const activityFreq = new Map();
	// for each tweet
	// get the activityType
	// and increase by 1

	for (let i = 0; i < tweet_array.length; i++){
		// console.log(tweet_array[i].activityType);
		var currentType = tweet_array[i].activityType;

		var currentCount = activityFreq.get(currentType);

		if (currentCount == undefined){
			activityFreq.set(currentType, 1);
		}
		else{
			currentCount += 1
			activityFreq.set(currentType, currentCount);
		}
		// console.log("activity type: ", tweet.activityType);	
	}
	console.log(activityFreq);

	// forEach(node => node.innerHTML = completedEventCount);

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
		// comment out the lines below if you want the original one
		// i just put this here so that the console wouldn't be so busy
		
		.array.forEach(element => {
			return tweet.myTweet;
		})
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});