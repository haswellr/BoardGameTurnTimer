class StatsPageViewController {
    static GO_HOME_ID = "back-to-timer";

    draw(drawEntirePage, playerList) {
        // This page has no dynamic sub-elements, so either draw full thing or nothing
        if(!drawEntirePage) return;
        this.drawStatsPage(playerList);
    }

    // See commented-out stats page HTML in index.html to see what we're building
    drawStatsPage(playerList) {
        // Clean up
        const pageAreaElement = document.getElementById("pageArea");
        while (pageAreaElement.firstChild) {
            pageAreaElement.removeChild(pageAreaElement.firstChild);
        }
        // Rebuild
        pageAreaElement.innerHTML = `
        <div class="stats-area">
            ${this._getSummaryTableHtml(playerList)}
            ${this._getAnalysisTableHtml(playerList)}
            ${this._getActionsHtml()}
        </div>
        `;
        // Rig listeners
        this._rigListeners();
    }

    _getShortestRoundMilliseconds(playerList) {
        return playerList
            // get the player turn list with the most turns
            .reduce((mostTurns, player) => mostTurns == null || player.turns.length > mostTurns.length ? player.turns : mostTurns, null)
            // convert that turn list into array of round indexes ie [0, 1, 2, 3]
            .map((turn, index) => index)
            // map round indexes to time sums for that round
            .map(roundIndex => playerList.reduce((sum, player) => roundIndex < player.turns.length ? sum + player.turns[roundIndex].timeElapsedInMilliseconds : sum, 0))
            // find shortest round time
            .reduce((shortestRoundTime, roundTime) => shortestRoundTime == -1 || roundTime < shortestRoundTime ? roundTime : shortestRoundTime, -1);
    }

    _getLongestRoundMilliseconds(playerList) {
        return playerList
            // get the player turn list with the most turns
            .reduce((mostTurns, player) => mostTurns == null || player.turns.length > mostTurns.length ? player.turns : mostTurns, null)
            // convert that turn list into array of round indexes ie [0, 1, 2, 3]
            .map((turn, index) => index)
            // map round indexes to time sums for that round
            .map(roundIndex => playerList.reduce((sum, player) => roundIndex < player.turns.length ? sum + player.turns[roundIndex].timeElapsedInMilliseconds : sum, 0))
            // find longest round time
            .reduce((longestRoundTime, roundTime) => roundTime > longestRoundTime ? roundTime : longestRoundTime, -1);
    }

    _getCellClasses(time, fastestTime, slowestTime) {
        return time != null && fastestTime != null && time <= fastestTime
            ? " highlight"
            : time != null && slowestTime != null && time >= slowestTime
                ? " lowlight"
                : "";
    }

    _buildTurnSummaryRowHtml(turnIndex, playerList, shortestRoundMilliseconds, longestRoundMilliseconds) {
        const firstColumn = `<td>${turnIndex + 1}</td>`;
        const playerTurnColumns = playerList
            .map(player => turnIndex < player.turns.length ? player.turns[turnIndex].timeElapsedInMilliseconds : -1)
            .map(turnTimeInMilliseconds => turnTimeInMilliseconds != -1 ? TimeFormatter.formatElapsedTime(turnTimeInMilliseconds) : "-:--")
            .map(turnTimeStr => `<td>${turnTimeStr}</td>`);
        const totalRoundTime = playerList.reduce((sum, player) => turnIndex < player.turns.length ? sum + player.turns[turnIndex].timeElapsedInMilliseconds : sum, 0);
        const totalColumn = `<td class="total${this._getCellClasses(totalRoundTime, shortestRoundMilliseconds, longestRoundMilliseconds)}">${TimeFormatter.formatElapsedTime(totalRoundTime)}</td>`;
        return [firstColumn, ...playerTurnColumns, totalColumn].join("\n");
    }

    _buildTotalRowHtml(playerList) {
        const firstColumn = '<td>Total</td>';
        const fastestPlayerTime = playerList
            .reduce((fastestPlayer, player) => fastestPlayer == null || player.totalTimeElapsedInMilliseconds < fastestPlayer.totalTimeElapsedInMilliseconds ? player : fastestPlayer, null)
            .totalTimeElapsedInMilliseconds;
        const slowestPlayerTime = playerList
            .reduce((slowestPlayer, player) => slowestPlayer == null || player.totalTimeElapsedInMilliseconds > slowestPlayer.totalTimeElapsedInMilliseconds ? player : slowestPlayer, null)
            .totalTimeElapsedInMilliseconds;
        const playerTotalColumns = playerList
            .map(player => player.totalTimeElapsedInMilliseconds)
            .map(playerTime => `<td class="${this._getCellClasses(playerTime, fastestPlayerTime, slowestPlayerTime)}">${TimeFormatter.formatElapsedTime(playerTime)}</td>`);
        const totalGameTime = playerList
            .map(player => player.totalTimeElapsedInMilliseconds)
            .reduce((sum, playerTime) => sum + playerTime, 0);
        const gameTotalColumn = `<td class="total">${TimeFormatter.formatElapsedTime(totalGameTime)}</td>`;
        return [firstColumn, ...playerTotalColumns, gameTotalColumn].join("\n");
    }

    _getSummaryTableHtml(playerList) {
        const headerRowHtml = ['<th>Turn</th>',
            ...playerList.map(player => player.name).map(playerName => `<th>${playerName}</th>`),
            '<th class="total">Total</th>']
            .join("\n");
        // turnIndexList will end up with a list of turn indexes from 0 to the highest turn by any player, ie [0, 1, 2, 3]
        const turnIndexList = playerList
            .reduce((mostTurns, player) => mostTurns == null || player.turns.length > mostTurns.length ? player.turns : mostTurns, null)
            .map((turn, index) => index);
        const bodyRowsHtml = turnIndexList
            .map(turnIndex => this._buildTurnSummaryRowHtml(turnIndex, playerList, this._getShortestRoundMilliseconds(playerList), this._getLongestRoundMilliseconds(playerList)))
            .map(turnRowHtml => `<tr>\n${turnRowHtml}\n</tr>`)
            .join("\n");
        const totalRowHtml = this._buildTotalRowHtml(playerList);
        return `
            <div class="full-width">
                <div class="central">
                    <h1>Turn Times</h1>
                </div>
            </div>
            <div class="full-width">
                <div class="central">
                    <table>
                        <thead>
                            <tr>
                                ${headerRowHtml}
                            </tr>
                        </thead>
                        <tbody>
                            ${bodyRowsHtml}
                            <tr class="total">
                                ${totalRowHtml}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    _getAnalysisTableHtml(playerList) {
        const headerRowHtml = ['<th>Statistic</th>',
            ...playerList.map(player => player.name).map(playerName => `<th>${playerName}</th>`)]
            .join("\n");
        const fastestAvg = playerList
            .map(player => player.averageTurnTime)
            .map(avgTurnTime => isNaN(avgTurnTime)
                ? 0
                : avgTurnTime)
            .reduce((fastest, avgTurnTime) => fastest == -1 || avgTurnTime < fastest ? avgTurnTime : fastest, -1);
        const slowestAvg = playerList
            .map(player => player.averageTurnTime)
            .map(avgTurnTime => isNaN(avgTurnTime)
                ? 0
                : avgTurnTime)
            .reduce((slowest, avgTurnTime) => avgTurnTime > slowest ? avgTurnTime : slowest, -1);
        const turnAverageRowHtml = ['<td>Turn Average</td>',
            ...playerList
                .map(player => player.averageTurnTime)
                .map(avgTurnTime => !isNaN(avgTurnTime)
                    ?   {
                            time: avgTurnTime,
                            timeStr: TimeFormatter.formatElapsedTime(avgTurnTime)
                        }
                    :   {
                            time: null,
                            timeStr: "-:--"
                        })
                .map(avgTurnTimeObj => `<td class="${this._getCellClasses(avgTurnTimeObj.time, fastestAvg, slowestAvg)}">${avgTurnTimeObj.timeStr}</td>`)
            ]
            .join("\n");
        const fastestTurnTime = playerList
            .flatMap(player => player.turns)
            .map(turn => turn.timeElapsedInMilliseconds)
            .reduce((fastest, turnTime) => fastest == -1 || turnTime < fastest ? turnTime : fastest, -1);
        const slowestTurnTime = playerList
            .flatMap(player => player.turns)
            .map(turn => turn.timeElapsedInMilliseconds)
            .reduce((slowest, turnTime) => turnTime > slowest ? turnTime : slowest, -1);
        const fastestTurnRowHtml = ['<td>Fastest Turn</td>',
            ...playerList
                .map(player => player.turns.length > 0
                    ? player.turns
                        .map(turn => turn.timeElapsedInMilliseconds)
                        .reduce((fastest, turnTime) => fastest == -1 || turnTime < fastest ? turnTime : fastest, -1)
                    : null)
                .map(fastestTurnTime => fastestTurnTime != null
                    ?   {
                        time: fastestTurnTime,
                        timeStr: TimeFormatter.formatElapsedTime(fastestTurnTime)
                        }
                    :   {
                            time: null,
                            timeStr: "-:--"
                        })
                .map(fastestTurnTimeObj => `<td class="${this._getCellClasses(fastestTurnTimeObj.time, fastestTurnTime, null)}">${fastestTurnTimeObj.timeStr}</td>`)
            ]
            .join("\n");
        const slowestTurnRowHtml = ['<td>Slowest Turn</td>',
            ...playerList
                .map(player => player.turns.length > 0
                    ? player.turns
                        .map(turn => turn.timeElapsedInMilliseconds)
                        .reduce((slowest, turnTime) => turnTime > slowest ? turnTime : slowest, -1)
                    : null)
                .map(slowestTurnTime => slowestTurnTime != null
                    ?   {
                        time: slowestTurnTime,
                        timeStr: TimeFormatter.formatElapsedTime(slowestTurnTime)
                        }
                    :   {
                            time: null,
                            timeStr: "-:--"
                        })
                .map(slowestTurnTimeObj => `<td class="${this._getCellClasses(slowestTurnTimeObj.time, null, slowestTurnTime)}">${slowestTurnTimeObj.timeStr}</td>`)
            ]
            .join("\n");
        return `
            <div class="full-width">
                <div class="central">
                    <h1>Analysis</h1>
                </div>
            </div>
            <div class="full-width">
                <div class="central">
                    <table>
                        <thead>
                            <tr>
                                ${headerRowHtml}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                ${turnAverageRowHtml}
                            </tr>
                            <tr>
                                ${fastestTurnRowHtml}
                            </tr>
                            <tr>
                                ${slowestTurnRowHtml}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    _getActionsHtml() {
        return `
            <div class="actions-area">
                <div class="central">
                    <div class="center-horizontal">
                        <button id="${StatsPageViewController.GO_HOME_ID}">Back to Timer</button>
                    </div>
                </div>
            </div>
        `;
    }

    _rigListeners() {
        const goHomeButton = document.getElementById(StatsPageViewController.GO_HOME_ID);
        goHomeButton.addEventListener("click", function(event) {
            EVENTS.onClickHome();
        });
    }
}