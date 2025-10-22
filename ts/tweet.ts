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
            return this.text;
        }
        //TODO: parse the activity type from the text of the tweet
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
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

    // parses the text into words
    getParsed(){
        this.words = this.text.split(" ");
        return this.words
    }
}