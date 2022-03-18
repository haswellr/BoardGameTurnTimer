class SetupPageViewController {
    static REMOVE_PLAYER_ID_PREFIX = "removePlayer";
    static ADD_PLAYER_ID = "addPlayer";
    static PLAYER_NAME_INPUT_ID = "playerNameInputId";
    static START_BUTTON_ID = "startButton";
    static ADD_PLAYER_FORM_ID = "addPlayerForm";
    static BACK_ID = "backButton";

    constructor() {
        this.lastPlayerList = [];
    }

    draw(drawEntirePage, playerList) {
        if (drawEntirePage || this._didPlayerListChange(playerList)) this.drawSetupPage(playerList);
    }

    _didPlayerListChange(playerList) {
        if (playerList.length != this.lastPlayerList.length) return true;
        return playerList.reduce((changed, player, index) => !player.equals(this.lastPlayerList[index]) ? true : changed, false);
    }

    // See commented-out setup page HTML in index.html to see what we're building
    drawSetupPage(playerList) {
        this.lastPlayerList = JSON.parse(JSON.stringify(playerList));
        // Clean up
        const pageAreaElement = document.getElementById("pageArea");
        while (pageAreaElement.firstChild) {
            pageAreaElement.removeChild(pageAreaElement.firstChild);
        }
        // Rebuild
        pageAreaElement.innerHTML = `
        <div class="setup-area">
            <div class="full-width">
                <div class="central">
                <h1>Player Setup</h1>
                </div>
            </div>
            <div class="central card-central">
                <ul class="player-list">
                    ${this._getPlayerListItemsHtml(playerList)}
                    <li class="card input">
                        <form id="${SetupPageViewController.ADD_PLAYER_FORM_ID}">
                            <input id="${SetupPageViewController.PLAYER_NAME_INPUT_ID}" type="text" placeholder="Enter player name..." autofocus="autofocus" required />
                            <div id="${SetupPageViewController.ADD_PLAYER_ID}" type="submit" form="addPlayerForm" class="player-card-button">
                                <h1 class="material-icons">add</h1>
                            </div>
                        </form>
                    </li>
                </ul>
            </div>
            <div class="actions-area">
                <div class="central">
                    <div class="center-horizontal">
                        ${this._getActionButtonsHtml(playerList)}
                    </div>
                </div>
            </div>
        </div>
        `;
        // Rig listeners
        this._rigListeners(playerList);
        // Set Focus
        const playerNameInputButton = document.getElementById(SetupPageViewController.PLAYER_NAME_INPUT_ID);
        playerNameInputButton.focus();
    }

    _getActionButtonsHtml(playerList) {
        return playerList
                .map(player => player.totalTimeElapsedInMilliseconds)
                .reduce((sum, playerTime) => sum + playerTime, 0) > 0
            ? `<button id="${SetupPageViewController.BACK_ID}">Back to Timer</button>
                <button id="${SetupPageViewController.START_BUTTON_ID}">Start!</button>`
            : `<button class="big" id="${SetupPageViewController.START_BUTTON_ID}">Start!</button>`
    }

    _getPlayerListItemsHtml(playerList) {
        return playerList.map((player, index) => `
            <li class="card">
                <h1 class="name">${player.name}</h1>
                <div id="${SetupPageViewController.REMOVE_PLAYER_ID_PREFIX + index}" class="player-card-button">
                    <h1 class="material-icons">close</h1>
                </div>
            </li> 
        `).join("\n");
    }

    _rigListeners(playerList) {
        // Add Player
        const addPlayerButton = document.getElementById(SetupPageViewController.ADD_PLAYER_ID);
        addPlayerButton.addEventListener("click", function(event) {
            const playerNameInputButton = document.getElementById(SetupPageViewController.PLAYER_NAME_INPUT_ID);
            const playerName = playerNameInputButton.value;
            playerNameInputButton.value = "";
            EVENTS.onClickAddPlayer(playerName);
        });
        const addPlayerForm = document.getElementById(SetupPageViewController.ADD_PLAYER_FORM_ID);
        addPlayerForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const playerNameInputButton = document.getElementById(SetupPageViewController.PLAYER_NAME_INPUT_ID);
            const playerName = playerNameInputButton.value;
            playerNameInputButton.value = "";
            EVENTS.onClickAddPlayer(playerName);
        });
        // Remove Player for each player
        playerList.forEach((player, index) => {
            const removePlayerButton = document.getElementById(SetupPageViewController.REMOVE_PLAYER_ID_PREFIX + index);
            removePlayerButton.addEventListener("click", function(event) {
                EVENTS.onClickRemovePlayer(player);
            });
        });
        // Back
        const backButton = document.getElementById(SetupPageViewController.BACK_ID);
        backButton?.addEventListener("click", function(event) {
            EVENTS.onClickHome();
        });
        // Start
        const startButton = document.getElementById(SetupPageViewController.START_BUTTON_ID);
        startButton.addEventListener("click", function(event) {
            EVENTS.onClickStart();
        });
    }
}