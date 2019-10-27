import React from "react";
import randomID from "./randomID";
// import {
//   moveRobot,
//   mineFoo,
//   mineBar,
//   assembleFooBar,
//   sellFooBar,
//   buyRobot
// } from "./functions";

class App extends React.Component {
  state = {
    money: 0,
    foo: [],
    bar: [],
    fooBar: [],
    robots: [{ id: 1, position: "foo" }, { id: 2, position: "foo" }],
    robotPositionTracker: {
      foo: 2,
      bar: 0,
      assembler: 0
    },
    mineFoo: null,
    mineBar: null,
    mineFooBar: null,
    from: null,
    to: null
  };

  componentDidMount() {
    this.setState({
      mineFoo: this.mineFoo(this.state.robotPositionTracker.foo),
      mineBar: this.mineBar(this.state.robotPositionTracker.bar),
      mineFooBar: this.mineFooBar(this.state.robotPositionTracker.assembler)
    });
  }

  addFoo = () =>
    this.setState({ foo: [...this.state.foo, { id: randomID() }] });
  addBar = () =>
    this.setState({ bar: [...this.state.bar, { id: randomID() }] });
  addFooBar = (foo, bar) =>
    foo &&
    bar &&
    this.setState(
      {
        fooBar: [...this.state.fooBar, { fooBarId: foo.id + bar.id }]
      },
      () => {
        this.removeFoo(foo.id);
        this.removeBar(bar.id);
      }
    );

  addRobot = () =>
    this.state.money >= 3 &&
    this.setState({
      robots: [
        ...this.state.robots,
        { id: this.state.robots.length + 1, position: "foo" }
      ],
      money: this.state.money - 3
    });

  removeFoo = id =>
    this.setState({ foo: this.state.foo.filter(f => f.id !== id) });
  removeBar = id =>
    this.setState({ bar: this.state.foo.filter(b => b.id !== id) });
  removeFooBar = id =>
    this.setState({
      fooBar: this.state.foo.filter(f => f.id !== id),
      money: this.state.money + 1
    });

  mineFoo = robotNumber =>
    robotNumber > 0 && setInterval(this.addFoo, 5000 / robotNumber);
  mineBar = robotNumber =>
    robotNumber > 0 && setInterval(this.addBar, 5000 / robotNumber);
  mineFooBar = robotNumber => {
    console.log(robotNumber, this.state.foo[0], this.state.bar[0]);
    robotNumber > 0 &&
      setInterval(
        () =>
          this.state.foo > 0 &&
          this.state.bar > 0 &&
          this.addFooBar(this.state.foo[0], this.state.bar[0]),
        5000 / robotNumber
      );
  };

  moveRobot = (initialPosition, finalPosition) => {
    const {
      robotPositionTracker,
      robots,
      mineFoo,
      mineBar,
      mineFooBar
    } = this.state;
    if (robotPositionTracker[initialPosition] > 0) {
      for (let i = 0; i < robots.length; i++) {
        if (robots[i].position === initialPosition) {
          const saveRobots = [...robots];
          saveRobots[i] = { ...saveRobots[i], position: finalPosition };

          clearInterval(mineFoo);
          clearInterval(mineBar);
          clearInterval(mineFooBar);

          const numFoo =
            initialPosition === "foo"
              ? robotPositionTracker.foo - 1
              : finalPosition === "foo"
              ? robotPositionTracker.foo + 1
              : robotPositionTracker.foo;
          const numBar =
            initialPosition === "bar"
              ? robotPositionTracker.bar - 1
              : finalPosition === "bar"
              ? robotPositionTracker.bar + 1
              : robotPositionTracker.bar;
          const numAssembler =
            initialPosition === "assembler"
              ? robotPositionTracker.assembler - 1
              : finalPosition === "assembler"
              ? robotPositionTracker.assembler + 1
              : robotPositionTracker.assembler;
          this.setState(
            {
              robots: saveRobots,
              robotPositionTracker: {
                foo: numFoo,
                bar: numBar,
                assembler: numAssembler
              },
              mineFoo: this.mineFoo(numFoo),
              mineBar: this.mineBar(numBar),
              mineFooBar: this.mineFooBar(numAssembler)
            },
            () => {
              console.info(
                `robot with id ${robots[i].id} was moved from ${initialPosition} to ${finalPosition}`
              );
            }
          );
          break;
        }
      }
    } else if (robots.length === 0) {
      console.warn("You don't have any robot left !");
    } else if (robotPositionTracker[initialPosition] === 0) {
      console.warn(`No robots anymore at position ${initialPosition} !`);
    } else {
      console.error("An error occured!");
    }
  };

  handleClick = value => {
    !this.state.from
      ? this.setState({ from: value })
      : this.setState({ to: value }, () => {
          const { from, to } = this.state;
          this.moveRobot(from, to);
          this.setState({ from: null, to: null });
        });
  };

  render() {
    const { robotPositionTracker, robots, foo, bar, fooBar } = this.state;
    return (
      <div className="App">
        <h1>FooBar Game</h1>
        <div>
          number of foos: <span id="fooNb">{foo.length}</span>
        </div>
        <div>
          number of bars: <span id="barNb">{bar.length}</span>
        </div>
        <div>
          number of foobars: <span id="foobarNb">{fooBar.length}</span>
        </div>
        <br />
        <div>
          number of robots: <span id="robotNb">{robots.length}</span>
        </div>
        <br />
        <div>
          <ul>
            <li>
              number of robots in foo:{" "}
              <span id="robotNb">{robotPositionTracker.foo}</span>
            </li>
            <li>
              number of robots in bar:{" "}
              <span id="robotNb">{robotPositionTracker.bar}</span>
            </li>
            <li>
              number of robots in foobar:{" "}
              <span id="robotNb">{robotPositionTracker.assembler}</span>
            </li>
          </ul>
        </div>
        <br />
        <div>
          move robot from: {this.state.from ? this.state.from : "..."} to{" "}
          {this.state.to ? this.state.to : "..."}
          <ul>
            <li>
              <button
                onClick={() => {
                  this.handleClick("foo");
                }}
                id="btnFoo"
              >
                Atelier Foo
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  this.handleClick("bar");
                }}
                id="btnBar"
              >
                Atelier Bar
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  this.handleClick("assembler");
                }}
                id="btnFooBar"
              >
                Atelier Assemblage FooBar
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;

///////////////////

/* 
//mineFoo
export const mineFoo = () => {
  if (totalPositionTracker.foo > 0) {
    let id = randomID();
    fooList.push({ id });
    console.log(
      `1 new foo produced ! We now have ${fooList.length} foo in total.`
    );
  } else if (totalPositionTracker.foo === 0) {
    console.log(
      `No robot is currently at foo position, please move a robot and try again!`
    );
  }
};
//mineBar
export const mineBar = () => {
  if (totalPositionTracker.bar > 0) {
    let id = randomID();
    barList.push({ id });
    console.log(
      `1 new boo produced ! We now have ${barList.length} boo in total.`
    );
  } else if (totalPositionTracker.bar === 0) {
    console.log(
      `No robot is currently at bar position, please move a robot and try again!`
    );
  }
};
//assembleFooBar
export const assembleFooBar = () => {
  const chance = Math.random();
  console.log(chance);
  if (
    chance < 0.6 &&
    totalStock.foo > 0 &&
    totalStock.bar > 0 &&
    totalPositionTracker.assemble > 0
  ) {
    let idFoo, idBar;
    idFoo = fooList[fooList.length - 1].id;
    idBar = barList[barList.length - 1].id;
    fooBarList.push({ idFoo, idBar });
    fooList.pop();
    barList.pop();
    console.log("opération réussie, vous avez assemblé 1 foobar");
  } else if (chance >= 0.6) {
    fooList.pop();
    console.log("opération ratée, vous avez perdu 1 foo");
  }
};

//sellFooBar
export const sellFooBar = () => {
  if (fooBarList) {
    let nbSold =
      fooBarList.length < 5
        ? Math.ceil(Math.random() * fooBarList.length)
        : Math.ceil(Math.random() * 5);

    console.log(nbSold);
    fooBarList.splice(fooBarList.length - nbSold, nbSold);
    money = money + nbSold;
    console.log(fooBarList);
    console.log(money);
  }
};
//buyRobot
export const buyRobot = () => {
  if (money >= 3 && fooList.length >= 6) {
    totalPositionTracker.foo++;
    totalNbRobot =
      totalPositionTracker.foo +
      totalPositionTracker.bar +
      totalPositionTracker.assemble;
    money = money - 3;
    fooList.splice(fooList.length - 6, 6);
  }
};

*/
