function convertToMiles(inKm){
	return inKm * 0.621371;
}

function getDayOfWeek(number){
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	return dayNames[number];
}

function isValidActivity(activity, validActivities){
	for (var valid in validActivities){
		if (valid.includes(activity)){
			return true;
		}
	}

	return false;
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
			"date" : getDayOfWeek(currentDay.getDay())
		})
	}

	// Get 3 highest frequencies
	var freq_values = [];

	unique_activities.forEach((activity) => {
		freq_values.push([activity, freq[activity]]);
	});

	freq_values.sort((a, b) => b[1]- a[1]);
	// console.log(freq_values);

	putHTML("span[id='firstMost']", freq_values[0][0]);
	putHTML("span[id='secondMost']", freq_values[1][0]);
	putHTML("span[id='thirdMost']", freq_values[2][0]);

	var valid_activities = [freq_values[0][0],  freq_values[1][0],  freq_values[2][0]];

	function checkValid(activity){
		for (var i = 0; i < valid_activities.length; i++){
			var valid = valid_activities[i];
			if (activity == valid){
				// console.log(tweet);
				return true;
			}
		}
		return false;
	}

	rows = rows.filter((tweet) => checkValid(tweet.activityType));

	var dist_date_list = [];
	for (var i = 0; i < 7; i++){
		dist_date_list.push(getDayOfWeek(i)); // pushes the day of the week itself
		dist_date_list.push(parseFloat((dist_date[i][0]/dist_date[i][1]).toFixed(2))); // pushes the average 
	}
	dist_values = dist_date_list.filter((value) => !isNaN(parseFloat(value)) && isFinite(value));
	var longest_day = 
	dist_date_list[
	dist_date_list.indexOf(
	dist_values
	.reduce((prev, curr) => prev > curr ? prev : curr)
	)  - 1];

	// Get average distance per activity

	unique_activities.forEach((activity) => {
		avg_dist_per_activity.push([activity, parseFloat((dist[activity]/freq[activity]).toFixed(2))]);
	});

	var avg_dist_per_activity_values = avg_dist_per_activity
	.sort((a, b) => a[1] - b[1]);

	var shortest = avg_dist_per_activity_values[0][0];
	var longest =  avg_dist_per_activity_values[avg_dist_per_activity.length - 1][0];

	putHTML("span[id='longestActivityType']", longest);
	putHTML("span[id='shortestActivityType']", shortest);
	putHTML("span[id='weekdayOrWeekendLonger']", longest_day);

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
				"type": "nominal",
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
				// "bandPosition": 0,
				"type": "nominal",
				// "timeUnit": "day",
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