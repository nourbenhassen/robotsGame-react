//moveRobot
export const moveRobot = (initialPosition, finalPosition) => {
  if (
    robotsList &&
    totalPositionTracker[initialPosition] > 0 &&
    totalPositionTracker[finalPosition] >= 0
  ) {
    for (let i = 0; i < robotsList.length - 1; i++) {
      if (robotsList[i].position === initialPosition) {
        robotsList[i].position = finalPosition;
        totalPositionTracker.initialPosition--;
        totalPositionTracker.finalPosition++;

        console.log(
          `robot with id ${robotsList[i].id} was moved from ${initialPosition} to ${finalPosition}`
        );
        break;
      }
    }
  } else if (!robotsList) {
    console.log("You don't have any robot left !");
  } else if (totalPositionTracker[initialPosition] === 0) {
    console.log(`No robots anymore at position ${initialPosition} !`);
  } else if (
    !totalPositionTracker[finalPosition] ||
    !totalPositionTracker[initialPosition]
  ) {
    console.log("One of the positions doesn't exist !");
  }
};
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
