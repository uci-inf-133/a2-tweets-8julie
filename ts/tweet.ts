class Tweet {
	private text:string;
	time:Date;
    words:Array<string>;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
        this.words = this.getParsed();
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.

        var liveEvent = 'Watch my run right now Live'.toLowerCase().split(" ");
        var achievement = 'Achieved a new #FitnessAlerts'.toLowerCase().split(" ");
        var completedEvent = 'Just completed a with'.toLocaleLowerCase().split(" ");

        var containsLiveEvent = liveEvent.some(word => this.text.includes(word))
        var containsAchievement = achievement.some(word => this.text.includes(word))
        var containsCompletedEvent = completedEvent.some(word => this.text.includes(word))

        if (containsLiveEvent){
            return 'live_event';
        }

        if (containsAchievement){
            return 'achievement';
        }

        if (containsCompletedEvent){
            return 'completed_event';
        }

        if (!containsLiveEvent && !containsAchievement && !containsCompletedEvent){
            return 'miscellaneous';
        }
        
        return "unknown";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return this.text != ""
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        else{
            // this.text.replace(" ", "|");
            return this.text;
        }
        //TODO: parse the written text from the tweet
        // return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        else{
            return this.source;
        }
        //TODO: parse the activity type from the text of the tweet
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        else{
            for (var i = 0; i < this.words.length; i++){
                var current = (this.words[i]);
                var next = this.words[i+1]
                if (!isNaN(Number(current)) && (next == "km" || next == "mi")){
                    return Number(current);
                }
            }
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    myTweet():string{
        return this.text;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }

    // parses the text into words (only to lower case)
    getParsed(){
        this.words = this.text.toLowerCase().split(" ");
        return this.words
    }
}