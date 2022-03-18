class EventRouter {
    constructor() {
        this.onClickPlayerCallbacks = [];
        this.onClickResumeLastTurnCallbacks = [];
        this.onClickStatsCallbacks = [];
        this.onClickResetCallbacks = [];
        this.onClickHomeCallbacks = [];
        this.onClickAddPlayerCallbacks = [];
        this.onClickRemovePlayerCallbacks = [];
        this.onClickStartCallbacks = [];
        this.onChangeURLCallbacks = [];
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

    // On Click Start
    onClickStart() {
        this.onClickStartCallbacks.forEach(callback => callback());
    }

    registerOnClickStart(callbackFunc) {
        this._registerCallback(this.onClickStartCallbacks, callbackFunc);
    }

    deregisterOnClickStart(callbackFunc) {
        _this._deregisterCallback(this.onClickStartCallbacks, callbackFunc);
    }

    // On Click Add Player
    onClickAddPlayer(playerName) {
        this.onClickAddPlayerCallbacks.forEach(callback => callback(playerName));
    }

    registerOnClickAddPlayer(callbackFunc) {
        this._registerCallback(this.onClickAddPlayerCallbacks, callbackFunc);
    }

    deregisterOnClickAddPlayer(callbackFunc) {
        _this._deregisterCallback(this.onClickAddPlayerCallbacks, callbackFunc);
    }

    // On Click Remove Player
    onClickRemovePlayer(player) {
        this.onClickRemovePlayerCallbacks.forEach(callback => callback(player));
    }

    registerOnClickRemovePlayer(callbackFunc) {
        this._registerCallback(this.onClickRemovePlayerCallbacks, callbackFunc);
    }

    deregisterOnClickRemovePlayer(callbackFunc) {
        _this._deregisterCallback(this.onClickRemovePlayerCallbacks, callbackFunc);
    }

    // On Change URL
    onChangeURL() {
        this.onChangeURLCallbacks.forEach(callback => callback());
    }

    registerOnChangeURL(callbackFunc) {
        this._registerCallback(this.onChangeURLCallbacks, callbackFunc);
    }

    deregisterOnChangeURL(callbackFunc) {
        _this._deregisterCallback(this.onChangeURLCallbacks, callbackFunc);
    }
}

const EVENTS = new EventRouter();