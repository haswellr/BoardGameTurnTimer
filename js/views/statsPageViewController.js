class StatsPageViewController {
    constructor() {
        this.playerTimeElements = [];

        // Update time elements every 1 second. This will go on forever - so don't make multiple of these classes wildly. Yes this is a bit janky, but no need to overcomplicate things yet.
        setInterval(function() {
            this.playerTimeElements.forEach((timeElement) => timeElement.draw());
        }.bind(this), 1000);
    }

    draw(drawEntirePage, playerList) {
        // This page has no dynamic sub-elements other than the timers, so either draw full thing or nothing
        if(!drawEntirePage) return;
        this.drawStatsPage(playerList);
    }

    /*
      <div class="stats-area">
        <div class="central">
            <ul class="player-stats-list">
            <li>
                <h1>{playerName}</h1>
                <ul class="turn-stats-list">
                    <li>
                        <b>Turn {turnNum}:</b>
                        <span>{turnTime}</span>
                    </li>
                    <li>
                        <b>TOTAL: </b>
                        <span>{playerTotalTime}</span>
                    </li>
                </ul>
            </li>
            </ul>
        </div>
      </div>
    */
    drawStatsPage(playerList) {
        // Clean up
        const pageAreaElement = document.getElementById("pageArea");
        while (pageAreaElement.firstChild) {
            pageAreaElement.removeChild(pageAreaElement.firstChild);
        }
        // Rebuild
        // <div class="stats-area">
        const statsArea = document.createElement("div");
        statsArea.classList.add("stats-area");
            // <div class="central">
            const centralStatsArea = document.createElement("div");
            centralStatsArea.classList.add("central");
                // <ul class="player-stats-list">
                const playerStatsList = document.createElement("ul");
                playerStatsList.classList.add("player-stats-list");
                // For each player...
                playerList.forEach(player => {
                    // <li>
                    const listItem = document.createElement("li");
                        // <h2>{playerName}</h2>
                        const name = document.createElement("h1");
                        name.appendChild(document.createTextNode(player.name));
                        listItem.appendChild(name);
                        // <ul class="turn-stats-list">
                        const turnStatsList = document.createElement("ul");
                        turnStatsList.classList.add("turn-stats-list");
                            // For each turn...
                            if (player.turns.length > 0) {
                                player.turns.forEach((turn, index) => {
                                    // <li>
                                    const turnListItem = document.createElement("li");
                                        // <b>Turn {turnNum}:</b>
                                        const turnTitle = document.createElement("b");
                                        const turnTitleStr = "Turn " + (index + 1) + ": ";
                                        turnTitle.appendChild(document.createTextNode(turnTitleStr));
                                        turnListItem.appendChild(turnTitle);
                                        // <span>{turnTime}</span>
                                        const turnTime = document.createElement("span");
                                        turnTime.classList.add('time');
                                        const turnTimeElement = new TurnTimeElement(turn, turnTime);
                                        turnTimeElement.draw();
                                        this.playerTimeElements.push(turnTimeElement);
                                        turnListItem.appendChild(turnTime);
                                    turnStatsList.appendChild(turnListItem);
                                });
                            }
                            // <li>
                            const totalTimeListItem = document.createElement("li");
                                // <b>TOTAL: </b>
                                const totalTitle = document.createElement("b");
                                totalTitle.appendChild(document.createTextNode("TOTAL: "));
                                totalTimeListItem.appendChild(totalTitle);
                                // <span>{playerTotalTime}</span>
                                const totalTime = document.createElement("span");
                                totalTime.classList.add('time');
                                const totalTimeElement = new TotalPlayerTimeElement(player, totalTime);
                                totalTimeElement.draw();
                                this.playerTimeElements.push(totalTimeElement);
                                totalTimeListItem.appendChild(totalTime);
                            turnStatsList.appendChild(totalTimeListItem);
                        listItem.appendChild(turnStatsList);
                    playerStatsList.appendChild(listItem);
                });
                centralStatsArea.appendChild(playerStatsList);
            statsArea.appendChild(centralStatsArea);
        pageAreaElement.appendChild(statsArea);
    }
}