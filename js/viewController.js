class ViewController {
    constructor() {
        this.lastPage = null;
        this.timerPageViewController = new TimerPageViewController();
        this.statsPageViewController = new StatsPageViewController();
        
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
        switch(state.page) {
            case StateController.Page.TIMERS:
                this.timerPageViewController.draw(drawEntirePage, state.activePlayer, state.waitingPlayers);
                break;
            case StateController.Page.STATS:
                this.statsPageViewController.draw(drawEntirePage, [...state.waitingPlayers, state.activePlayer]);
                break;
            default:
                throw "Unexpected page";
        }
    }
}

const VIEW = new ViewController();