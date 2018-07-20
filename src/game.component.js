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

    this.game = new Game(10, 15, 30);
  };

  componentDidUpdate() {
    if (this.state.newGame) {

      if (this.p5Instance) {
        this.p5Instance.remove();
        this.p5Instance = null;
      }

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
        p.draw = comp.game.draw;
        p.mouseClicked = comp.mouseClicked;
      }

      this.p5Instance = new p5(sketch, canvasContainer);
      this.setState({justStarted: false})
    }
  }

  render() {
    return (
      <div className="game">
        <h1>Minesweeper</h1>

        <div>
          <p>Mines left: {this.state.minesLeft}</p>
          <div className="canvas-wrapper" style={{position: "relative", width: Game.CANVAS_WIDTH, margin: "auto"}}>
            <div id="canvas-container"></div>

            {!this.state.gameRunning && (

              <div className="overlay" style={{position: "absolute", left: 0, right: 0, bottom: 0, top: 0}}>
                <div className="game-finished-dash">

                  {this.state.gameLost && (
                    <div>
                      <h2>Haha, you lost...</h2>
                      <p>
                        <button onClick={this.restartGame}>Restart</button>
                      </p>
                    </div>
                  )}

                  {this.state.gameWon && (
                    <div>
                      <h2>You won, schmuk!</h2>
                      <p>
                        <button onClick={this.restartGame}>Restart</button>
                      </p>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
          <p><code>Ctrl+Click</code> <code>(Cmd+Click)</code> to flag a square.</p>
        </div>

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

    this.game.onLost(() => {
      this.setState({
        gameLost: true,
        gameRunning: false,
      })
    });

    this.game.boot(p);
  };

  mouseClicked = (e) => {
    if (e.target.id !== "defaultCanvas0") {
      return true;
    }

    const modifiedClick = e.ctrlKey || e.metaKey;

    this.game.handleClick(this.p.mouseX, this.p.mouseY, modifiedClick);

    return false;
  }

}
