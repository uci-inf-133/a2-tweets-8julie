class Tweet {
	private text:string;
	time:Date;
    words:Array<string>;
    measurement:string;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
        this.words = this.getParsed();
        this.measurement = "mi";
	}

    get dayOfWeek(){
        return this.time.getDay();
    }

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.

        var isLive = this.words.includes("live");
        var isCompleted = this.text.includes("completed a ");
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
        return this.words.includes("-");
    }

    get writtenText():string {
        //TODO: parse the written text from the tweet
        if(!this.written) {
            return "";
        }
        else{
            var iStart = this.text.indexOf("-") + 1;
            // words.findIndex(value => value == "-") + 1; 

            // it's very important that we only get the FIRST dash
            // because tweets can contain these dashes too

            var iEnd = this.text.indexOf("http");
            // words.findIndex(value => value.includes("http"));

            var iEndHashTagFirst = this.text.lastIndexOf("#");
            // .words.findLastIndex(value => value.includes("#"));

            if (iEnd > iEndHashTagFirst){
                iEnd = iEndHashTagFirst;
            }

            return this.text.slice(iStart,iEnd);
            // .words.slice(iStart, iEnd).join(" ");
        }
    }

    // my own code
    isNumber(word:string): boolean{
        return isNaN(Number(word));
    }

    getIndex(searchStr:string[]): number{

        var possibilities: number[] = [];

        searchStr.forEach((item) => {
            if (this.text.indexOf(item) != -1){
                possibilities.push(this.text.indexOf(item));
            }
        });

        function compareIndexes(a:number, b:number) { return a - b;}
        possibilities.sort(compareIndexes);

        return possibilities[0];
    }

    get activityType():string {
        //TODO: parse the activity type from the text of the tweet

        var unknownActivity = "unknown";

        if (this.source != "completed_event") return unknownActivity;

        var iStart = this.getIndex(["mi", "km"]) + 3;

        var iEnd = this.getIndex(["with", "-"])

        if (iStart != -1){
            return this.text.slice(iStart, iEnd);
        }
        else{
            return unknownActivity;
        }
    }

    get distance():number {
        //TODO: prase the distance from the text of the tweet        

        var iStart = this.words.findIndex(word => word == 'a') + 1;
        var iEnd = this.words.findIndex(word => word == 'km' || word == 'mi');

        if (iStart == -1 || iEnd == -1){
            return 0;
        }

        return Number(this.words.slice(iStart, iEnd).join(""));

        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity

        var myStr = `
        <tr>
            <td scope="row">${rowNumber}</td>
            <td scope="row">${this.activityType}</td>
            <td scope="row">${this.writtenText}</td>
        </tr>
        `;

        
        return myStr;
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
        this.words = this.text
        .split(/([^a-zA-Zhttps://t.co])/)
        .filter(myString => /\S/.test(myString));

        if (this.words.includes("mi")){
            this.measurement = "mi";
        }
        else{
            this.measurement = "km";
        }

        return this.words
    }
}