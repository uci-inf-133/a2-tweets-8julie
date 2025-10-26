function convertToMiles(inKm){
	return inKm * 0.621371;
}

function getDayOfWeek(number){
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	return dayNames[number];
}

// function simplifyActivity(activity){

// 	var enduranceSport = ["run", "bike", "walk", "row"]
// 	if (enduranceSport.includes(activity)){
// 		return "enduranceSport";
// 	} 
// 	else{
// 		return "other";
// 	}
// }


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
	// manipulate tweet_array to create a graph of the number 
	// of tweets containing each type of activity.
	tweet_array = tweet_array.filter((tweets) => tweets.source == "completed_event");

	var rows = [];
	var activityTypes = new Set();


	for (let i = 0; i < tweet_array.length; i++){
		var currentType = tweet_array[i].activityType;  // you can also use simplifyActivity
		var currentMeasurement = tweet_array[i].measurement;
		var currentDistance = tweet_array[i].distance;
		if (currentMeasurement == "km") currentDistance;

		var currentDay = tweet_array[i].time;
		activityTypes.add(currentType);

		rows.push({ 
			"activityType" : currentType,
			"distance" : currentDistance,
			"date" : currentDay
		})
	}

	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A scatterplot the day of the week and distance of activity.",
		// "autosize": {
		// 	"type": "fit",
		// 	"contains": "padding"
		// },
		"height" : 400,
		"width" : 500,
		"data": {
			"values": rows,
		},
		"mark": {
			"type":"point",
			"clip":true
		},
		"encoding": {
			"x": {
				"field": "date",
				"title": "Day of the week",
				"bandPosition": 0,
				"type": "temporal",
				"timeUnit": "day",
				// "scale":{
				// 	"type":"time"
				// }
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"title": "Distance (miles)",
				"scale": {
					// "type": "linear" 
					// couldn't do the above code because random guy decided to swim for like a thousand miles
					"domain": [0, 80],
					"clamp": true
				},
				// "aggregate": "average" /// THIS IS FOR LATER
			},

		"color": {
			"field": "activityType", 
			"type": "nominal"
		}
  }
};

	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	var numberActivities = 	document.querySelectorAll("span[id='numberActivities']");
	numberActivities.forEach(node => node.innerHTML = activityTypes.size);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});