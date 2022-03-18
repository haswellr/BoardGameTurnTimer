class Player {
  static deserialize(playerObj) {
    if (playerObj == null) return null;
    const player = new Player(playerObj.name);
    if (playerObj.turns) {
      player.turns = playerObj.turns.map(turnObj => Turn.deserialize(turnObj));
    }
    else player.turns = [];
    return player;
  }

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

  reset() {
    this.turns = [];
  }
}

class Turn {
  static State = {
    TICKING: 0,
    PAUSED: 1
  };

  static deserialize(turnObj) {
    const turn = new Turn();
    turn.timeStored = turnObj.timeStored;
    turn.startedTime = turnObj.startedTime;
    return turn;
  }

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
  static STATE_STORAGE_KEY = "state";
  static Page = {
    TIMERS: 0,
    STATS: 1,
    SETUP: 2
  };

  constructor() {
      this.updateCallbacks = [];
      // load state
      const storedStateStr = window.localStorage.getItem(StateController.STATE_STORAGE_KEY);
      if (storedStateStr) {
        const storedState = JSON.parse(storedStateStr);
        this.state = {
          page: storedState.page,
          activePlayer: Player.deserialize(storedState.activePlayer),
          waitingPlayers: storedState.waitingPlayers
            ? storedState.waitingPlayers.map(waitingPlayerObj => Player.deserialize(waitingPlayerObj))
            : []
        };
      } else {
        this.state = {
          page: null,
          activePlayer: null,
          waitingPlayers: []
        };
      }
  }

  _saveStateLocally() {
    window.localStorage.setItem(StateController.STATE_STORAGE_KEY, JSON.stringify(this.state));
  }

  // Registers a function run any time the state changes
  registerUpdateCallback(callbackFunc) {
    this.updateCallbacks.push(callbackFunc);
  }

  update(updateFunc) {
    updateFunc(this.state);
    this._saveStateLocally();
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
    EVENTS.registerOnClickStart(this.onClickStart.bind(this));
    EVENTS.registerOnClickAddPlayer(this.onClickAddPlayer.bind(this));
    EVENTS.registerOnClickRemovePlayer(this.onClickRemovePlayer.bind(this));
    // Set initial state
    this.stateController.update(function(state) {
      if (state.page == null) {
        this._initializeState(state);
      } else {
        if (state.activePlayer?.isActing) state.page = StateController.Page.TIMERS;
        else state.page = StateController.Page.SETUP;
      }
    }.bind(this));
  }

  _initializeState(state) {
      state.page = StateController.Page.SETUP;
      state.activePlayer = new Player("Angelo");
      state.activePlayer.nextTurn();
      state.activePlayer.currentTurn.pause();
      state.waitingPlayers = [];
      state.waitingPlayers.push(new Player("Johnny Utah"));
      state.waitingPlayers.push(new Player("Bodhi"));
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
    this.stateController.update(function(state) {
      state.activePlayer?.reset();
      state.activePlayer?.nextTurn();
      state.activePlayer?.currentTurn.pause();
      state.waitingPlayers.forEach(player => player.reset(false));
      state.page = StateController.Page.SETUP;
    }.bind(this));
  }

  onClickHome() {
    this.stateController.update(function(state) {
      state.page = StateController.Page.TIMERS;
    });
  }

  onClickStart() {
    this.stateController.update(function(state) {
      state.page = StateController.Page.TIMERS;
      state.activePlayer.currentTurn.start();
    });
  }

  onClickAddPlayer(playerName) {
    const newPlayer = new Player(playerName);
    this.stateController.update(function(state) {
      if (state.activePlayer == null) {
        state.activePlayer = newPlayer;
        state.activePlayer.nextTurn();
        state.activePlayer.currentTurn.pause();
      } else {
        state.waitingPlayers.push(newPlayer);
      }
    });
  }

  onClickRemovePlayer(player) {
    this.stateController.update(function(state) {
      if (state.activePlayer.equals(player)) {
        state.activePlayer = state.waitingPlayers.length > 0
          ? state.waitingPlayers.splice(0, 1)[0]
          : null;
      } else {
        const index = state.waitingPlayers.indexOf(player);
        state.waitingPlayers.splice(index, 1);
      }
    });
  }
}

const APP = new App();