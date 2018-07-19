import React from "react";
import { Game } from "./game";
import "./game.scss";

export class GameComponent extends React.Component {

  constructor() {
    super();
    this.p = null;
    this.state = {
      minesLeft: 0,
    }
  }

  componentDidMount() {
    const comp = this;

    function sketch(p) {
      comp.p = p;

      p.setup = comp.setup;

      p.draw = () => {
        comp.game.draw();
      };


      p.mouseClicked = comp.mouseClicked;
    }

    new p5(sketch, document.getElementById('canvas-container'));
  }

  render() {
    return (
      <div class="game">
        <h1>Minesweeper</h1>
        <p>Mines left: {this.state.minesLeft}</p>
        <div id="canvas-container"></div>
        <p><code>Ctrl+Click</code> <code>(Cmd+Click)</code> to flag a square.</p>
      </div>
    )
  }


  setup = () => {
    const p = this.p;
    this.game = new Game(10, 15, 30);

    this.game.onUpdateMinesLeft((count) => {
      this.setState({
        minesLeft: count
      });
    });

    this.game.boot(p);
  };

  mouseClicked = (e) => {
    //noinspection JSUnresolvedVariable
    const flag = e.ctrlKey || e.metaKey;
    this.game.handleClick(this.p.mouseX, this.p.mouseY, flag);

    return false;
  }

}
