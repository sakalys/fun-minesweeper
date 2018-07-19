import React from "react";
import { Game } from "./game";
import "./game.scss";

export class GameComponent extends React.Component {

  constructor() {
    super();
    this.p = null;
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      minesLeft: 0,
      newGame: true,
      gameRunning: false,
      gameWon: false,
      gameLost: false,
    };
  }

  componentDidMount() {
    this.restartGame();
  }

  restartGame = () => {
    this.setState({newGame: true, gameRunning: false});

    this.game = new Game(10, 15, 4);
  };

  componentDidUpdate() {
    if (this.state.newGame) {
      this.setState({
        newGame: false,
        gameWon: false,
        gameLost: false,
        gameRunning: true,
        justStarted: true,
      })
    } else if (this.state.justStarted) {
      const canvasContainer = document.getElementById('canvas-container');
      if (!canvasContainer) {
        throw new Error("Canvas container not found");
      }
      const comp = this;

      function sketch(p) {
        comp.p = p;

        p.setup = comp.setup;

        p.draw = () => {
          comp.game.draw();
        };


        p.mouseClicked = comp.mouseClicked;
      }

      new p5(sketch, canvasContainer);
      this.setState({justStarted: false})
    }
  }

  render() {
    return (
      <div className="game">
        <h1>Minesweeper</h1>

        {!this.state.gameRunning && (
          this.state.gameWon && (
            <div>
              <h2>You won, schmuk!</h2>
              <button onClick={this.restartGame}>Restart</button>
            </div>
          )
        )}

        {this.state.gameRunning && (
          <div>
            <p>Mines left: {this.state.minesLeft}</p>
            <div id="canvas-container"></div>
            <p><code>Ctrl+Click</code> <code>(Cmd+Click)</code> to flag a square.</p>
          </div>
        )}

      </div>
    )
  }


  setup = () => {
    const p = this.p;

    this.game.onUpdateMinesLeft((count) => {
      this.setState({
        minesLeft: count
      });
    });

    this.game.onWon(() => {
      console.log("Game won");
      this.setState({
        gameWon: true,
        gameRunning: false,
      })
    });

    this.game.onLose(() => {

    });

    this.game.boot(p);
  };

  mouseClicked = (e) => {
    console.log(this.state);

    //noinspection JSUnresolvedVariable
    const flag = e.ctrlKey || e.metaKey;
    this.game.handleClick(this.p.mouseX, this.p.mouseY, flag);

    return false;
  }

}
