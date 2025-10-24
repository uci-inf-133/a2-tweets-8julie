function createData(x_label, y_label, rawMap){
	var data = [];


	rawMap.forEach((value, key) => {
		// console.log(value, key);
		data.push({ [x_label] : key, [y_label] : value});
	});

	return data;
}

function createEncoding(){

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

	var activityFreq = new Map();
	var averages = new Map();
	var frequencies = new Map();

	var longest = -1;
	var shortest = -1;

	for (let i = 0; i < tweet_array.length; i++){
		// console.log(tweet_array[i].activityType);
		var currentType = tweet_array[i].activityType;
		var currentDistance = tweet_array[i].distance;
		var currentMeasurement = tweet_array[i].measurement;
		var currentDay = tweet_array[i].dayOfWeek;

		var item = activityFreq.get(currentType);

		if (item == undefined){

			var d = new Distance();
			d.insertValue(currentDistance, currentMeasurement);
			activityFreq.set(currentType, d);
		}
		else{
			// currentCount += 1
			activityFreq.get(currentType).insertValue(currentDistance, currentMeasurement);
			// activityFreq.set(currentType, currentCount);
		}
	}

	// activityFreq = [activityFreq];

	activityFreq.forEach((value, key) => {
		averages.set(key, value.average());
		frequencies.set(key, value.size());
	});


	var frequency_xLabel = "Activity Type";
	var frequency_yLabel = "Frequency";

	var average_xLabel = "Activity Type";
	var average_yLabel = "Average distance (miles)";

	var averageData = createData(average_xLabel, average_yLabel, averages);
	var frequencyData = createData(frequency_xLabel, frequency_yLabel, frequencies);

	// forEach(node => node.innerHTML = completedEventCount);



	// var exampleData = [
	// {"a": "A", "b": 28}, 
	// {"a": "B", "b": 55}, 
	// {"a": "C", "b": 43},
    // {"a": "D", "b": 91},
	// {"a": "E", "b": 81},
	// {"a": "F", "b": 53},
    // {"a": "G", "b": 19},
	// {"a": "H", "b": 87},
	// {"a": "I", "b": 52}];
	var exampleMark = "bar";
	// var exampleEncoding = {
	// "x": {"field": a, "type": "nominal", "axis": {"labelAngle": 0}},
    // "y": {"field": b, "type": "quantitative"}
	// };

	var frequencyMark = "point";
	var frequencyEncoding = {
	"x": {"field": frequency_xLabel, "type": "nominal", "axis": {"labelAngle": 0}},
    "y": {"field": frequency_yLabel, "type": "quantitative"}
	};


	// console.log(frequencyData);
	// console.log(exampleData);

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": frequencyData		
	  },
	  "mark": "point",
	  "encoding": frequencyEncoding

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