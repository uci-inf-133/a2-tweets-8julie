function convertToMiles(inKm){
	return inKm * 0.621371;
}

function getDayOfWeek(number){
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	return dayNames[number];
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

	var labels = ["activityType", "distance", "dayOfWeek"];
	var rows = [];
	for (let i = 0; i < tweet_array.length; i++){
		// console.log(tweet_array[i].activityType);
		var currentType = tweet_array[i].activityType;

		var currentMeasurement = tweet_array[i].measurement;
		var currentDistance = tweet_array[i].distance;
		if (currentMeasurement == "km") currentDistance = convertToMiles(currentDistance)

		var currentDay = getDayOfWeek(tweet_array[i].dayOfWeek);

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
  "data": {
    "values": rows,
  },
  "mark": "point",
  "encoding": {
    "x": {
      "field": "dayOfWeek",
      "type": "nominal"
    },
    "y": {
      "field": "distance",
      "type": "quantitative",
	  "aggregate": "average"
    },
    "color": {"field": "activityType", "type": "nominal"}
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