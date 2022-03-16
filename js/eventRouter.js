class EventRouter {
    constructor() {
        this.onClickPlayerCallbacks = [];
        this.onClickResumeLastTurnCallbacks = [];
        this.onClickStatsCallbacks = [];
        this.onClickResetCallbacks = [];
        this.onClickHomeCallbacks = [];
    }

    _registerCallback(callbackList, callbackFunc) {
        if(!callbackList.includes(callbackFunc)) callbackList.push(callbackFunc);
    }

    _deregisterCallback(callbackList, callbackFunc) {
        const index = callbackList.indexOf(callbackFunc);
        if (index != -1) callbackList.splice(index, 1);
    }

    // On Click Player
    onClickPlayer(player) {
        this.onClickPlayerCallbacks.forEach(callback => callback(player));
    }

    registerOnClickPlayer(callbackFunc) {
        this._registerCallback(this.onClickPlayerCallbacks, callbackFunc);
    }

    deregisterOnClickPlayer(callbackFunc) {
        _this._deregisterCallback(this.onClickPlayerCallbacks, callbackFunc);
    }

    // On Click Back to Player
    onClickResumeLastTurn(player) {
        this.onClickResumeLastTurnCallbacks.forEach(callback => callback(player));
    }

    registerOnClickResumeLastTurn(callbackFunc) {
        this._registerCallback(this.onClickResumeLastTurnCallbacks, callbackFunc);
    }

    deregisterOnClickResumeLastTurn(callbackFunc) {
        _this._deregisterCallback(this.onClickResumeLastTurnCallbacks, callbackFunc);
    }

    // On Click Stats
    onClickStats() {
        this.onClickStatsCallbacks.forEach(callback => callback());
    }

    registerOnClickStats(callbackFunc) {
        this._registerCallback(this.onClickStatsCallbacks, callbackFunc);
    }

    deregisterOnClickStats(callbackFunc) {
        _this._deregisterCallback(this.onClickStatsCallbacks, callbackFunc);
    }

    // On Click Reset
    onClickReset() {
        this.onClickResetCallbacks.forEach(callback => callback());
    }

    registerOnClickReset(callbackFunc) {
        this._registerCallback(this.onClickResetCallbacks, callbackFunc);
    }

    deregisterOnClickReset(callbackFunc) {
        _this._deregisterCallback(this.onClickResetCallbacks, callbackFunc);
    }

    // On Click Home
    onClickHome() {
        this.onClickHomeCallbacks.forEach(callback => callback());
    }

    registerOnClickHome(callbackFunc) {
        this._registerCallback(this.onClickHomeCallbacks, callbackFunc);
    }

    deregisterOnClickHome(callbackFunc) {
        _this._deregisterCallback(this.onClickHomeCallbacks, callbackFunc);
    }
}

const EVENTS = new EventRouter();