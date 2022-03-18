class ViewController {
    constructor() {
        this.lastPage = null;
        this.timerPageViewController = new TimerPageViewController();
        this.statsPageViewController = new StatsPageViewController();
        this.setupPageViewController = new SetupPageViewController();
        
        this.registerStaticEvents();
    }

    registerStaticEvents() {
        const headerTitle = document.getElementById("headerTitle");
        headerTitle.addEventListener("click", function(event) {
            EVENTS.onClickHome();
        });
    }

    draw(state) {
        var drawEntirePage = false;
        if (state.page != this.lastPage) {
            this.lastPage = state.page;
            drawEntirePage = true;
        }
        const fullPlayerList = [...state.waitingPlayers];
        if (state.activePlayer != null) fullPlayerList.splice(0, 0, state.activePlayer);
        switch(state.page) {
            case StateController.Page.TIMERS:
                this.timerPageViewController.draw(drawEntirePage, state.activePlayer, state.waitingPlayers);
                break;
            case StateController.Page.STATS:
                this.statsPageViewController.draw(drawEntirePage, fullPlayerList);
                break;
            case StateController.Page.SETUP:
                this.setupPageViewController.draw(drawEntirePage, fullPlayerList);
                break;
            default:
                throw "Unexpected page";
        }
    }
}

const VIEW = new ViewController();