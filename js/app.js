class Player {
  constructor(name) {
      this.name = name;
      this.turns = [];
  }

  equals(player) {
    if (this.name != player.name) return false;
    if (this.turns.length != player.turns.length) return false;
    this.turns.forEach((turn, index) => {
      if (!turn.equals(player.turns[index])) return false;
    });
    return true;
  }

  get totalTimeElapsedInMilliseconds() {
    return this.turns.reduce((sum, turn) => sum + turn.timeElapsedInMilliseconds, 0);
  }

  get averageTurnTime() {
    return this.turns.map(turn => turn.timeElapsedInMilliseconds).reduce((sum, turnTime) => sum + turnTime, 0) / this.turns.length;
  }

  get currentTurn() {
    return this.turns.length > 0 ? this.turns[this.turns.length - 1] : null;
  }

  get isActing() {
    return this.currentTurn != undefined && this.currentTurn != null && this.currentTurn.state === Turn.State.TICKING;
  }

  nextTurn() {
      if (this.currentTurn != null) this.currentTurn.pause();
      const turn = new Turn();
      turn.start();
      this.turns.push(turn);
      return turn;
  }
}

class Turn {
  static State = {
    TICKING: 0,
    PAUSED: 1
  };

  constructor() {
      this.timeStored = 0;
      this.startedTime = -1;
  }

  equals(turn) {
    return this.timeStored === turn.timeStored && this.startedTime === turn.startedTime;
  }

  get _openTime() {
      return this.startedTime != -1 ? Date.now() - this.startedTime : 0;
  }

  start() {
      this.timeStored += this._openTime;
      this.startedTime = Date.now();
  }

  pause() {
      this.timeStored += this._openTime;
      this.startedTime = -1;
  }

  get timeElapsedInMilliseconds() {
      return this.timeStored + this._openTime;
  }

  get state() {
      return this.startedTime != -1 ? Turn.State.TICKING : Turn.State.PAUSED;
  }
}

class StateController {
  static Page = {
    TIMERS: 0,
    STATS: 1
  };

  constructor() {
      this.updateCallbacks = [];
      this.state = {
        page: null,
        activePlayer: null,
        waitingPlayers: []
      };
  }

  // Registers a function run any time the state changes
  registerUpdateCallback(callbackFunc) {
    this.updateCallbacks.push(callbackFunc);
  }

  update(updateFunc) {
    updateFunc(this.state);
    this.updateCallbacks.forEach((callbackFunc) => {
      callbackFunc(this.state);
    });
  }
}

class App {
  constructor() {
    // Set up state change callbacks
    this.stateController = new StateController();
    this.stateController.registerUpdateCallback(function(state) {
      VIEW.draw(state);
    });
    // Set up event callbacks
    EVENTS.registerOnClickPlayer(this.onClickPlayer.bind(this));
    EVENTS.registerOnClickResumeLastTurn(this.onClickResumeLastTurn.bind(this));
    EVENTS.registerOnClickStats(this.onClickStats.bind(this));
    EVENTS.registerOnClickReset(this.onClickReset.bind(this));
    EVENTS.registerOnClickHome(this.onClickHome.bind(this));
    // Set initial state
    this._initializeState();
  }

  _initializeState() {
    this.stateController.update(function(state) {
      state.page = StateController.Page.TIMERS;
      state.activePlayer = new Player("Ryan");
      state.activePlayer.nextTurn();
      state.activePlayer.currentTurn.pause();
      state.waitingPlayers = [];
      state.waitingPlayers.push(new Player("Jen"));
      state.waitingPlayers.push(new Player("Bruno"));
      state.waitingPlayers.push(new Player("Stephanie"));
      state.waitingPlayers.push(new Player("Tyler"));
    });
  }

  static setActivePlayer(state, player) {
    if (state.activePlayer.isActing) state.activePlayer.currentTurn.pause();
    state.waitingPlayers.push(state.activePlayer);
    state.activePlayer = player;
    state.waitingPlayers.splice(state.waitingPlayers.indexOf(player), 1);
  }

  onClickPlayer(player) {
    this.stateController.update(function(state) {
      if (player == state.activePlayer) {
        if (player.isActing) player.currentTurn.pause();
        else player.currentTurn.start();
      }
      else {
        App.setActivePlayer(state, player);
        player.nextTurn();
      }
    });
  }

  onClickResumeLastTurn(player) {
    this.stateController.update(function(state) {
      if (player == state.activePlayer) {
        player.currentTurn.start();
      }
      else {
        App.setActivePlayer(state, player);
        if (player.turns.length == 0) player.nextTurn();
        else player.currentTurn.start();
      }
    });
  }

  onClickStats() {
    this.stateController.update(function(state) {
      state.page = StateController.Page.STATS;
    });
  }

  onClickReset() {
    this._initializeState();
  }

  onClickHome() {
    this.stateController.update(function(state) {
      state.page = StateController.Page.TIMERS;
    });
  }
}

const APP = new App();