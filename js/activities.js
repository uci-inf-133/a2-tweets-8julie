function convertToMiles(inKm){
	return inKm * 0.621371;
}

function getDayOfWeek(number){
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	return dayNames[number];
}

function putHTML(html_tag, my_string){
	var elem = document.querySelectorAll(html_tag);
	elem.forEach(node => node.innerHTML = my_string);
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

	//TODO: create a new array or 
	// manipulate tweet_array to create a graph of the number 
	// of tweets containing each type of activity.
	// tweet_array = tweet_array.filter((tweets) => tweets.source == "completed_event");

	var rows = [];
	var freq = new Object(); // Count of each
	var dist = new Object(); // Total distance of each
	var unique_activities = new Set();
	var avg_dist_per_activity = [];
	var dist_date = new Object();
	// var dist_per_date = new Distance("date");

	for (let i = 0; i < tweet_array.length; i++){
		var currentType = tweet_array[i].activityType;  // you can also use simplifyActivity
		var currentMeasurement = tweet_array[i].measurement;
		var currentDistance = tweet_array[i].distance;

		if (currentMeasurement == "km") currentDistance;

		var currentDay = tweet_array[i].time;
		// console.log(currentDay.getDay());

		if (freq[currentType] == undefined){
			freq[currentType] = 1;
		}
		else{
			freq[currentType] += 1; // false aggregation
		}

		if (!isNaN(currentDistance)){
			if (dist[currentType] == undefined){
				dist[currentType] = currentDistance;
			}
			else{
				dist[currentType] += currentDistance;
			}



			if (dist_date[currentDay.getDay()] == undefined){
				dist_date[currentDay.getDay()] = [currentDistance, 1];
			}
			else{
				dist_date[currentDay.getDay()][1] += 1;
				dist_date[currentDay.getDay()][0] += currentDistance;			
			}
		}

		unique_activities.add(currentType);

		rows.push({ 
			"activityType" : currentType,
			"distance" : currentDistance,
			"date" : currentDay.getDate()
		})
	}

	var longest_day;

	console.log(dist_date);

	unique_activities.forEach((activity) => {
		avg_dist_per_activity.push(activity);
		avg_dist_per_activity.push(parseFloat((dist[activity]/freq[activity]).toFixed(2)));
	});

	var shortest = avg_dist_per_activity
	.filter((value) => !isNaN(parseFloat(value)) && isFinite(value))
	.reduce((prev, curr) => prev < curr ? prev : curr);

	var longest = avg_dist_per_activity
	.filter((value) => !isNaN(parseFloat(value)) && isFinite(value))
	.reduce((prev, curr) => prev > curr ? prev : curr);

	putHTML("span[id='longestActivityType']", avg_dist_per_activity[avg_dist_per_activity.indexOf(longest) - 1] + " (" + longest + " mi)");
	putHTML("span[id='shortestActivityType']", avg_dist_per_activity[avg_dist_per_activity.indexOf(shortest) - 1] + " (" + shortest + " mi)");
	
	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A scatterplot of the count for the activity depending on the day of the week.",
		"height" : 400,
		"width" : 500,
		"data": { "values": rows },
		"mark": { "type":"point", "clip":true },
		"encoding": {
			"x": {
				"field": "date",
				"title": "Day of the week",
				// "bandPosition": 0,
				// "type": "temporal",
				// "timeUnit": "day",
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				// "title": "Distance (miles)",
				"scale": {
					"domain": [0, 35],
					"clamp": true
				},
			},

		"color": {
			"field": "activityType", 
			"type": "nominal"
		}
  }
};

	activity_vis_mean = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A scatterplot of the average distance depending on the day of the week and the activity.",
		"height" : 400,
		"width" : 500,
		"data": { "values": rows },
		"mark": { "type":"point", "clip":true },
		"encoding": {
			"x": {
				"field": "date",
				"title": "Day of the week",
				"bandPosition": 0,
				"type": "temporal",
				"timeUnit": "day",
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"scale": {
					"domain": [0, 35],
					"clamp": true
				},
				"aggregate": "average" /// THIS IS FOR LATER
			},

		"color": {
			"field": "activityType", 
			"type": "nominal"
		}
  }
};


	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', activity_vis_mean, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	var numberActivities = 	document.querySelectorAll("span[id='numberActivities']");
	numberActivities.forEach(node => node.innerHTML = Object.keys(freq).length);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});