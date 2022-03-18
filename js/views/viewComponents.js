class TimeFormatter {
    static formatElapsedTime(elapsedTimeInMilliseconds) {
        const hours = Math.floor(elapsedTimeInMilliseconds / 3600000);
        const hoursStr = hours + "";
        const minutes = Math.floor(elapsedTimeInMilliseconds / 60000 % 60);
        const minutesStr = minutes + "";
        const seconds = Math.floor(elapsedTimeInMilliseconds / 1000 % 60);
        const secondsStr = seconds < 10
            ? "0" + seconds
            : "" + seconds;
        return hours > 0
            ? hoursStr + ":" + minutesStr + ":" + secondsStr
            : minutesStr + ":" + secondsStr;
    }
}

class TurnTimeElement {
    constructor(turn, element) {
        this.turn = turn;
        this.lastTurnState = null;
        this.domElement = element;
    }

    draw() {
        if(!this.domElement) return;
        if(this.lastTurnState === this.turn.state && this.turn.state != Turn.State.TICKING) return;
        this.lastTurnState = this.turn.state;
        while (this.domElement.firstChild) {
            this.domElement.removeChild(this.domElement.firstChild);
        }
        const timeText = this.turn
            ? TimeFormatter.formatElapsedTime(this.turn.timeElapsedInMilliseconds)
            : "-:--";
        this.domElement.appendChild(document.createTextNode(timeText));
    }
}

class TotalPlayerTimeElement {
    constructor(player, element) { 
        this.player = player;
        this.lastIsPlayerActing = null;
        this.domElement = element;
    }

    draw() {
        if(!this.domElement) return;
        if(this.lastIsPlayerActing === this.player.isActing && this.lastIsPlayerActing == false) return;
        this.lastIsPlayerActing = this.player.isActing;
        while (this.domElement.firstChild) {
            this.domElement.removeChild(this.domElement.firstChild);
        }
        const timeText = TimeFormatter.formatElapsedTime(this.player.totalTimeElapsedInMilliseconds);
        this.domElement.appendChild(document.createTextNode(timeText));
    }
}