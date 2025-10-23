class Tweet {
	private text:string;
	time:Date;
    words:Array<string>;
    // activity:string;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
        this.words = this.getParsed();
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.

        // var liveEvent = 'Watch my run right now Live'.toLowerCase().split(" ");
        // var achievement = 'Achieved a new #FitnessAlerts'.toLowerCase().split(" ");
        // var completedEvent = 'completed'.toLocaleLowerCase().split(" ");

        // var containsLiveEvent = liveEvent.some(word => this.text.includes(word))
        // var containsAchievement = achievement.some(word => this.text.includes(word))
        // var containsCompletedEvent = completedEvent.some(word => this.text.includes(word))

        var isLive = this.words.includes("live");
        var isCompleted = this.words.includes("completed")
        var isAchieved = this.words.includes("achieved") || this.words.includes("achievement")

        if (isLive) return 'live_event';
        if (isAchieved) return 'achievement';
        if (isCompleted) return 'completed_event';
        if (!isLive && !isAchieved && !isCompleted) return 'miscellaneous';
        return "unknown";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written

        // note: if the index is -1 then the tweet was written
        return this.words.indexOf("-") == -1;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        else{
            var writtenIndex = this.words.indexOf("-");
            var myTweetArray = this.getRawParsed(writtenIndex, -2);
            return myTweetArray.join(" ");
        }
        //TODO: parse the written text from the tweet
    }

    // my own code
    isNumber(word:string): boolean{
        return isNaN(Number(word));
    }

    get activityType():string {
        var unknownActivity = "unknown";

        if (this.source != 'completed_event') return unknownActivity;

        var iStart = this.words.findIndex(word => word == 'km' || word == 'mi') + 1;
        var iEnd = this.words.findIndex(word => word == 'with' || word == '-' || word == 'in' || word == '@');

        if (!isNaN(Number(this.words[iStart])) && 
        (this.words[iStart+1] == "km" || this.words[iStart+1] == "mi")){
            iStart += 2;
        }
        
        // console.log("all: ", this.words);        
        // console.log("test:", myActivity);

        // console.log("iStart:", iStart, this.words[iStart])
        // console.log("iEnd:", iEnd, this.words[iEnd])

        var myActivity = this.words.slice(iStart, iEnd).join(" ");

        return myActivity;

        return unknownActivity;
        
        if (this.source != 'completed_event') {
            return "unknown";
        }

        else{
            return this.words[6];
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

                try{
                    var next = this.words[i+1]

                } catch(error: unknown){
                    // Number was wrong
                    return 0; 
                }

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

    getRawParsed(begin=0, end=0){
        var words = this.text.split(" ");

        if (end == 0){
            end = words.length;
        }

        return words.slice(begin, end);
    }

    // parses the text into words (only to lower case)
    getParsed(){

        this.words = this.text.toLowerCase()
        .split(/([^a-zA-Z0-9https://t.co])/)
        .filter(myString => /\S/.test(myString));

        // console.log(this.text, " into " ,this.words);

        return this.words
    }
}