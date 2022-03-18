class TimerPageViewController {
    static ACTIVE_TIMER_ID = "activeTimer";
    static WAITING_TIMER_LIST_ID = "waitingTimerList";

    constructor() {
        this.lastActivePlayer = null;
        this.lastActivePlayerActing = null;
        this.lastWaitingPlayerList = [];
        this.activePlayerTimeElement = null;
        this.waitingPlayerTimeElements = [];

        // Update time elements every 1 second. This will go on forever - so don't make multiple of these classes wildly. Yes this is a bit janky, but no need to overcomplicate things yet.
        const timerPageViewController = this;
        setInterval(function() {
            if (timerPageViewController.activePlayerTimeElement) timerPageViewController.activePlayerTimeElement.draw();
            timerPageViewController.waitingPlayerTimeElements.forEach((timeElement) => timeElement.draw());
        }, 1000);
    }

    _isLastWaitingPlayerListEqual(waitingPlayerList) {
        if (waitingPlayerList.length != this.lastWaitingPlayerList.length) return false;
        var isEqual = true;
        waitingPlayerList.forEach((waitingPlayer, index) => {
            if (!waitingPlayer.equals(this.lastWaitingPlayerList[index])) isEqual = false;
        });
        return isEqual;
    }

    draw(drawEntirePage, activePlayer, waitingPlayerList) {
        // Draw core structure - must happen first
        if(drawEntirePage) this.drawTimerPageSkeleton();
        // Draw active timer, if anything has changed
        if(drawEntirePage || !activePlayer.equals(this.lastActivePlayer) || this.lastActivePlayerActing != activePlayer.isActing) this.drawActiveTimer(activePlayer);
        // Draw waiting timer list, if anything has changed
        if(drawEntirePage || !this._isLastWaitingPlayerListEqual(waitingPlayerList)) this.drawWaitingPlayers(waitingPlayerList);
    }

    /*
        <div class="timer-area">
            <div class="central card-central">
                <div id="activeTimer" class="active-timer"></div>
                <ul id="waitingTimerList" class="waiting-timer-list"></ul>
            </div>
        </div>
        <div class="actions-area">
            <div class="central card-central">
                <div class="center-horizontal">
                    <button>New Game</button>
                    <button>Stats</button>
                </div>
            </div>
        </div>
    */
    drawTimerPageSkeleton() {
        // Clean up
        const pageAreaElement = document.getElementById("pageArea");
        while (pageAreaElement.firstChild) {
            pageAreaElement.removeChild(pageAreaElement.firstChild);
        }
        // Rebuild
        // <div class="timer-area">
        const timerAreaElement = document.createElement("div");
        timerAreaElement.classList.add("timer-area");
            // <div class="central">
            const timerCentralElement = document.createElement("div");
            timerCentralElement.classList.add("central");
            timerCentralElement.classList.add("card-central");
            timerCentralElement.classList.add("timers");
                // <div id="activeTimer" class="active-timer"></div>
                const activeTimerElement = document.createElement("div");
                activeTimerElement.classList.add("active-timer");
                activeTimerElement.setAttribute("id", TimerPageViewController.ACTIVE_TIMER_ID);
                timerCentralElement.appendChild(activeTimerElement);
                // <ul id="waitingTimerList" class="waiting-timer-list"></ul>
                const waitingTimerListElement = document.createElement("ul");
                waitingTimerListElement.classList.add("waiting-timer-list");
                waitingTimerListElement.setAttribute("id", TimerPageViewController.WAITING_TIMER_LIST_ID);
                timerCentralElement.appendChild(waitingTimerListElement);
            timerAreaElement.appendChild(timerCentralElement);
        pageAreaElement.appendChild(timerAreaElement);
        // <div class="actions-area">
        const actionsAreaElement = document.createElement("div");
        actionsAreaElement.classList.add("actions-area");
            // <div class="central">
            const actionsCentralElement = document.createElement("div");
            actionsCentralElement.classList.add("central");
                // <div class="center-horizontal">
                const actionsCenterHorizontalElement = document.createElement("div");
                actionsCenterHorizontalElement.classList.add("center-horizontal");
                    // <button>Reset</button>
                    const resetButton = document.createElement("button");
                    resetButton.appendChild(document.createTextNode("New Game"));
                    resetButton.addEventListener("click", function(event) {
                        EVENTS.onClickReset();
                    });
                    actionsCenterHorizontalElement.appendChild(resetButton);
                    // <button>Stats</button>
                    const statsButton = document.createElement("button");
                    statsButton.appendChild(document.createTextNode("Stats"));
                    statsButton.addEventListener("click", function(event) {
                        EVENTS.onClickStats();
                    });
                    actionsCenterHorizontalElement.appendChild(statsButton);
                actionsCentralElement.appendChild(actionsCenterHorizontalElement);
            actionsAreaElement.appendChild(actionsCentralElement);
        pageAreaElement.appendChild(actionsAreaElement);
    }

    /*
        <div class="timer-card card">
            <h1>{playerName}</h1>
            <div class="right-side">
                <div class="center-vertical">
                    <div class="time">{currentTurnTime}</div>
                    <div class="time-turns-divider"></div>
                    <div class="turns">{currentTurnNum}</div>
                </div>
            </div>
        </div>
    */
    drawActiveTimer(activePlayer) {
        this.lastActivePlayer = JSON.parse(JSON.stringify(activePlayer));
        this.lastActivePlayerActing = activePlayer.isActing;
        // Clean up
        const currentTimerElement = document.getElementById(TimerPageViewController.ACTIVE_TIMER_ID);
        while (currentTimerElement.firstChild) {
            currentTimerElement.removeChild(currentTimerElement.firstChild);
        }
        // Rebuild
        // <div class="timer-card">
        const playerTimerElement = document.createElement("div");
        playerTimerElement.classList.add("timer-card");
        playerTimerElement.classList.add("card");
        if (activePlayer.isActing) playerTimerElement.classList.add("acting");
        playerTimerElement.addEventListener("click", function(event) {
            EVENTS.onClickPlayer(activePlayer);
        });
            // <h1>{playerName}</h1>
            const header = document.createElement("h1");
            header.appendChild(document.createTextNode(activePlayer.name));
            playerTimerElement.appendChild(header);
            // <div class="right-side">
            const rightSideDiv = document.createElement("div");
            rightSideDiv.classList.add("right-side");
                // <div class="center-vertical">
                const centerVerticalDiv = document.createElement("div");
                centerVerticalDiv.classList.add("center-vertical");
                    // <div class="time">{currentTurnTime}</div>
                    const time = document.createElement("div");
                    time.classList.add('time');
                    this.activePlayerTimeElement = new TurnTimeElement(activePlayer.currentTurn, time);
                    this.activePlayerTimeElement.draw();
                    centerVerticalDiv.appendChild(time);
                    // <div class="time-turns-divider"></div>
                    const timeTurnsDivider = document.createElement("div");
                    timeTurnsDivider.classList.add("time-turns-divider");
                    centerVerticalDiv.appendChild(timeTurnsDivider);
                    // <div class="turns">{currentTurnNum}</div>
                    const turn = document.createElement("div");
                    turn.classList.add("turns");
                    turn.appendChild(document.createTextNode("Turn " + activePlayer.turns.length));
                    centerVerticalDiv.appendChild(turn);
                rightSideDiv.appendChild(centerVerticalDiv);
            playerTimerElement.appendChild(rightSideDiv);
        currentTimerElement.appendChild(playerTimerElement);
    }

    /*
        <!-- for each waiting player... -->
        <li>
            <div class="resume-button">
              <h1 class="material-icons">restore</h1>
            </div>
            <div class="waiting-player-button">
                <h1 class="name">{playerName}</h1>
                <div class="right-side">
                    <div class="center-vertical">
                        <div class="time">{totalTurnTime}</div>
                        <div class="time-turns-divider"></div>
                        <div class="turns">{totalNumTurns}</div>
                    </div>
                </div>
            </div>
        </li>
    */
    drawWaitingPlayers(waitingPlayerList) {
        this.lastWaitingPlayerList = JSON.parse(JSON.stringify(waitingPlayerList));
        // Clean up
        const waitingTimerListElement = document.getElementById(TimerPageViewController.WAITING_TIMER_LIST_ID);
        while (waitingTimerListElement.firstChild) {
            waitingTimerListElement.removeChild(waitingTimerListElement.firstChild);
        }
        this.waitingPlayerTimeElements = [];
        // Rebuild
        waitingPlayerList.forEach((player) => {
            // <li>
            const listItem = document.createElement("li");
            listItem.classList.add("card");
                // <div class="resume-button">
                const resumeButton = document.createElement("div");
                resumeButton.classList.add("resume-button");
                resumeButton.addEventListener("click", function(event) {
                    EVENTS.onClickResumeLastTurn(player);
                });
                    // <h1 class="material-icons">restore</h1>
                    const resumeIcon = document.createElement("h1");
                    resumeIcon.classList.add("material-icons");
                    resumeIcon.appendChild(document.createTextNode("restore"));
                    resumeButton.appendChild(resumeIcon);
                listItem.appendChild(resumeButton);
                // <div class="waiting-player-button">
                const waitingPlayerButton = document.createElement("div");
                waitingPlayerButton.classList.add("waiting-player-button");
                waitingPlayerButton.addEventListener("click", function(event) {
                    EVENTS.onClickPlayer(player);
                });
                    // <h1 class="name">{playerName}</h1>
                    const header = document.createElement("h1");
                    header.classList.add("name");
                    header.appendChild(document.createTextNode(player.name));
                    waitingPlayerButton.appendChild(header);
                    // <div class="right-side">
                    const rightSideDiv = document.createElement("div");
                    rightSideDiv.classList.add("right-side");
                        // <div class="center-vertical">
                        const centerVerticalDiv = document.createElement("div");
                        centerVerticalDiv.classList.add("center-vertical");
                            // <div class="time">{totalTurnTime}</div>
                            const time = document.createElement("div");
                            time.classList.add('time');
                            const turnTimeElement = new TotalPlayerTimeElement(player, time);
                            turnTimeElement.draw();
                            this.waitingPlayerTimeElements.push(turnTimeElement);
                            centerVerticalDiv.appendChild(time);
                            // <div class="time-turns-divider"></div>
                            const timeTurnsDivider = document.createElement("div");
                            timeTurnsDivider.classList.add("time-turns-divider");
                            centerVerticalDiv.appendChild(timeTurnsDivider);
                            // <div class="turns">{totalNumTurns}</div>
                            const turns = document.createElement("div");
                            turns.classList.add('turns');
                            turns.appendChild(document.createTextNode(player.turns.length + " turns"));
                            centerVerticalDiv.appendChild(turns);
                        rightSideDiv.appendChild(centerVerticalDiv);
                    waitingPlayerButton.appendChild(rightSideDiv);
                listItem.appendChild(waitingPlayerButton);
            waitingTimerListElement.appendChild(listItem);
        });
    }
}