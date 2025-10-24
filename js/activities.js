function convertToMiles(inKm){
	return inKm * 0.621371;
}

function getDayOfWeek(number){
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	return dayNames[number];
}

function simplifyActivity(activity){

	var enduranceSport = ["run", "bike", "walk", "row"]
	if (enduranceSport.includes(activity)){
		return "enduranceSport";
	} 
	else{
		return "other";
	}
}

class Distance {
    values = [];
    constructor() {
        // this.activityType = activityType;
        this.values = [];
    }

    average() {
        var size = this.values.length;
        var total = this.values.reduce((sum, current) => sum + current, 0);
        return (total / size).toFixed(2);
    }

    size() {
        return this.values.length;
    }

    insertValue(value, measurement) {

		// convert all to miles
		if (measurement == "km"){
			// apparently kkilometersToMiles also works?
			value = value * 0.621371;
		}

		this.values.push(value);
    }
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

	var rows = [];
	var highest = {};
	var loweest = {};


	for (let i = 0; i < tweet_array.length; i++){

		var currentType = simplifyActivity(tweet_array[i].activityType);

		var currentMeasurement = tweet_array[i].measurement;
		var currentDistance = tweet_array[i].distance;
		if (currentMeasurement == "km") currentDistance = convertToMiles(currentDistance)

		var currentDay = tweet_array[i].time;

		// if (rows.si == 0){
		// 	lowestDistance = currentDistance;
		// 	highestDistance = currentDistance;
		// }
		// else{
		// 	if (currentDistance > highestDistance) highestDistance = currentDistance;
		// 	if (currentDistance < lowestDistance) lowestDistance = currentDistance;
		// }

		rows.push({ 
			"activityType" : currentType,
			"distance" : currentDistance,
			"dayOfWeek" : currentDay
		})

	}

	console.log(rows);

	activity_vis_spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "description": "A scatterplot the day of the week and distance of activity.",
    "autosize": {
    "type": "fit",
    "contains": "padding"
  },
  "height" : 400,
  "width" : 600,
  "data": {
    "values": rows,
},
  "mark": "point",
  "encoding": {
    "x": {
      "field": "dayOfWeek",
	  "title": "Day of the week",
	//   "bandPosition": 0,
	  "type": "temporal",
	  "timeUnit": "day"
    },
    "y": {
      "field": "distance",
      "type": "quantitative",
	  "title": "Distance",
	//   "aggregate": "average" /// THIS IS FOR LATER

    },
    "color": {
		"field": "activityType", 
		"type": "nominal"
	}
    // "shape": {"field": "Species", "type": "nominal"}
  }
};

	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});