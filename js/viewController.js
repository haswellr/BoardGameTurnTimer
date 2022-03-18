class ViewController {
    constructor() {
        this.lastPage = null;
        this.timerPageViewController = new TimerPageViewController();
        this.statsPageViewController = new StatsPageViewController();
        this.setupPageViewController = new SetupPageViewController();
        
        this.registerStaticEvents();
    }

    get pageToLabel() {
        return {
            [StateController.Page.TIMERS]: "timer",
            [StateController.Page.STATS]: "stats",
            [StateController.Page.SETUP]: "setup"
        }
    };

    getPageFromLabel(label) {
        return Object.entries(this.pageToLabel).reduce((page, [key, value]) => page == null || value == label ? key : page, null);
    }

    getCurrentPageLabel() {
        return window.location.hash.substring(2);
    }

    generateURLHashFromPage(page) {
        return `#/${this.pageToLabel[page]}`;
    }

    registerStaticEvents() {
        // Home via header
        const headerTitle = document.getElementById("headerTitle");
        headerTitle.addEventListener("click", function(event) {
            EVENTS.onClickHome();
        });
        // Forward/Back via Browser
        window.addEventListener('popstate', function (event) {
            EVENTS.onChangeURL();
        });
    }

    draw(state) {
        var drawEntirePage = false;
        if (state.page != this.lastPage) {
            this.lastPage = state.page;
            drawEntirePage = true;
            if (this.generateURLHashFromPage(state.page) != window.location.hash)
                history.pushState({ page: state.page }, '', this.generateURLHashFromPage(state.page));
        }
        const fullPlayerList = [...state.waitingPlayers];
        if (state.activePlayer != null) fullPlayerList.splice(0, 0, state.activePlayer);
        // Can't use switch as we need non-strict comparison
        if (state.page == StateController.Page.TIMERS) this.timerPageViewController.draw(drawEntirePage, state.activePlayer, state.waitingPlayers);
        else if (state.page == StateController.Page.STATS) this.statsPageViewController.draw(drawEntirePage, fullPlayerList);
        else if (state.page == StateController.Page.SETUP) this.setupPageViewController.draw(drawEntirePage, fullPlayerList);
        else throw "Unexpected page";
    }
}

const VIEW = new ViewController();