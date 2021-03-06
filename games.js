const emojis = ["🐵", "🐶", "🐺", "🦊", "🐱", "🦁", "🐯",
  "🐴", "🦄", "🐮", "🐷", "🐗", "🐭", "🐁",
  "🐀", "🐹", "🐰", "🦇", "🐻", "🐨", "🐼",
  "🐔", "🐸", "🐲", "🐳", "🐬", "🐠",
  "🐚", "🦋", "🐌", "🐜", "🐞", "🌸", "🥀",
  "🌳", "🌴", "🌵", "🍁", "🍇", "🍉", "🍊",
  "🍋", "🍌", "🍍", "🍎", "🍏", "🍐", "🍑",
  "🍒", "🍓", "🥝", "🍅", "🥥", "🥑", "🍆",
  "🥔", "🥕", "🌽", "🥒", "🍄", "🥜", "🌰",
  "🥐", "🥖", "🥞", "🧀", "🍗", "🥓", "🍔",
  "🍟", "🍕", "🌭", "🌮", "🥗", "🍤", "🍦",
  "🍩", "🍪", "🍰", "🍫", "🍬", "🍭",
  "👦🏻", "👦🏼", "👦🏽", "👦🏾", "👦🏿", "👧🏻", "👧🏼",
  "👧🏽", "👧🏾", "👧🏿", "👨🏻", "👨🏼", "👨🏽", "👨🏾",
  "👨🏿", "👩🏻", "👩🏼", "👩🏽", "👩🏾", "👩🏿", "👴🏻",
  "👴🏼", "👴🏽", "👴🏾", "👴🏿", "👵🏻", "👵🏼", "👵🏽",
  "👵🏾", "👵🏿", "👶🏻", "👶🏼", "👶🏽", "👶🏾", "👶🏿",
  "👠", "👽", "🧠", "🌎", "🎹", "🎻",
  "🎷", "🎺", "🎸", "🥁"
];
const remoji = (length) => {
  let arr = [];

  for (var i = 0; i < length; i++) {
    arr.push(emojis[~~(Math.random() * emojis.length)]);
  }
  return arr;
};

class game {
  constructor(container, difficulty = 20, target = 5, gameName, instruction) {
    this.instructions = document.createElement("div");
    this.instructions.classList.add("game-instruction");
    this.instructions.innerText = instruction;
    say(instruction)
    container.append(this.instructions);
    this.game = document.createElement("div");
    this.game.setAttribute("id", gameName);
    this.game.classList.add("game");
    container.append(this.game);
    this.score = document.createElement("div");
    this.score.setAttribute("id", "score");
    this.score.innerText = 0;
    this.game.append(this.score);
    this.target = target;
    this.current = 0;
    this.playing = false;
    this.difficulty = difficulty;
    this.timer = document.getElementById('timer-holder');
    this.timePath = document.getElementById('timer-path');
    this.timeLimit = config.timeLimit;
    this.clickEvent = ['add-me'];
    this.clickEvent.push(isMobile ? 'touchstart' : 'mousedown');
  }

  end(winner) {
    this.paused = true;
    this.playing = false;
    this.timer.classList.add('not-playing');
    if (winner) {
      nextSlide(true);
    } else {
      nextSlide(false);
    }
  }

  disable(bool = true) {
    if (bool) {
      this.game.classList.add("disabled");
    } else {
      this.game.classList.remove("disabled");
    }
  }

  beginTimer() {
    if (this.timing) return;
    let duration = 1000 * this.timeLimit;
    let last = +new Date();
    let elapsed = 0;
    let rate = 0;

    var step = (delta) => {
      if (!this.playing) return;

      let current = +new Date();
      if (this.paused) {
        last = current;
        this.timePath.setAttribute("stroke-dashoffset", (rate * 5307).toFixed(1));
        requestAnimationFrame(step);
        return;
      }

      elapsed += current - last;
      last = current;

      let remaining = duration - elapsed;

      if (remaining < 60) {
        this.timer.classList.add('not-playing');
        this.timePath.setAttribute("stroke-dashoffset", 0);
        if (!this.playing) return;
        this.end(false);
        return;

      } else {
        rate = 1 - remaining / duration;
        this.timePath.setAttribute("stroke-dashoffset", (rate * 5307).toFixed(1));
      }

      requestAnimationFrame(step);
    }
    step();
    this.timing = true;
  }

  start() {
    this.game.classList.add('lock-msg');
    this.timer.classList.remove('not-playing');
    this.timePath.setAttribute("stroke-dashoffset", 0);
    setTimeout(() => {
      this.playing = true;
      this.game.setAttribute('style', 'transform: none');
    }, 1000);
  }
}

class controls extends game {
  constructor(container, difficulty = 20, target = 5, id = "controls", info = `Use any controls to make this sequence:`) {
    target = Math.min(Math.ceil(target * 0.25), 4);
    difficulty = Math.max(difficulty, 1) * 1.3;
    super(container, difficulty, target, id, info);
    this.pads = [
      ["🇫🇷", "🇨🇦", "🇨🇩", "🇩🇿"],
      ["不", "思", "可", "议"],
      ["☀️", "⛄", "🍂", "🌷"],
      ["🥃", "🍺", "🍹", "🍷"],
      ["🚑", "🚒", "🚓", "🚕"],
      ["🎃", "🎅", "🦃", "☘️"],
      ["💀", "⚰️", "🧟", "👻"],
      ["👂", "👁️", "👄", "👃"],
      ["동", "서", "문", "답"],
      ["🐵", "🙈", "🙉", "🙊"],
    ];

    this.resets = [];
    this.disable();
    this.setup();
  }

  end(winner, icon = '') {
    this.paused = true;
    this.playing = false;
    if (winner) {
      this.disable();
      this.instructions.innerText = "Unlocked!";
      [].forEach.call(document.querySelectorAll("#controls .control"), (c) => {
        c.classList.add('winner')
      });
      setTimeout(() => {
        super.end(true);
      }, 1000);
    } else {
      this.disable();
      say(`Error: You clicked ${icon} not ${this.targetSeq[0]}`);
      this.instructions.innerHTML = `You clicked ${icon} not ${this.targetSeq[0]}`;

      [].forEach.call(document.querySelectorAll("#controls .control"), (c) => {
        c.style.transition = 'all 2s ease';
        c.style.transform = `translate3d(${~~(Math.random() * 300) - 150 }px, ${~~(Math.random() * 300) + 500 }px, 0)
          rotateZ(${~~(Math.random() * 400) - 200 }deg)`;
      });

      setTimeout(() => {
        super.end(false);
      }, 2000);
    }
  }

  addScore(plus = 1) {
    this.paused = true;
    this.current += plus;
    this.score.innerText = this.current;

    if (this.current >= this.target) {
      this.end(true);
    } else {
      this.instructions.innerHTML = '... Next Sequence ...';
      this.targetSeq = [];
      this.resetAll();
      this.start();
    }
  }

  clickHandler(icon) {
    if (this.loading) {
      this.targetSeq.push(icon);
    } else {
      if (icon === this.targetSeq[0]) {
        say(icon);
        this.targetSeq.shift();
        if (this.targetSeq.length == 0) {
          this.paused = true;
          this.addScore();
        } else {
          this.instructions.innerHTML = "<span class='attn'>➭</span>  " + this.targetSeq.join(", ");
        }
      } else {
        this.end(false, icon);
      }
    }
  }

  makeDial(settings) {
    let current = 0;
    const holder = document.createElement("div");
    holder.classList.add("control");

    const dialPos = document.createElement("div");
    dialPos.classList.add("dial-pos");

    const dialHolder = document.createElement("div");
    dialHolder.classList.add("dial-holder");
    dialHolder.setAttribute("data-setting", `set_${current}`);
    const dial = document.createElement("div");
    dial.innerHTML = '<div>⟳</div>';
    dial.classList.add("dial");

    const setting1 = document.createElement("div");
    setting1.classList.add("setting1");
    setting1.innerText = settings[0];
    const setting2 = document.createElement("div");
    setting2.classList.add("setting2");
    setting2.innerText = settings[1];
    const setting3 = document.createElement("div");
    setting3.classList.add("setting3");
    setting3.innerText = settings[2];

    this.clickEvent.forEach((eve) => {
      holder.addEventListener(eve, () => {
        current += 1;
        if (current > 2) current = 0;
        dial.parentElement.setAttribute("data-setting", `set_${current}`);
        this.clickHandler(settings[current]);
      }, false);
    });

    dialHolder.append(setting1);
    dialHolder.append(setting2);
    dialHolder.append(setting3);
    dialHolder.append(dial);
    dialPos.append(dialHolder);
    holder.append(dialPos);

    this.resets.push(() => {
      current = 0;
      dial.parentElement.setAttribute("data-setting", `set_${current}`);
    });

    return holder;
  }

  makeToggle(settings) {
    let flipped = false;
    const holder = document.createElement("div");
    holder.classList.add("control");

    const togHolder = document.createElement("div");
    togHolder.classList.add("tog-holder");
    const togBack = document.createElement("div");
    togBack.classList.add("tog-back");
    togBack.innerHTML = settings[0];
    const togFront = document.createElement("div");
    togFront.classList.add("tog-front");
    togFront.innerHTML = settings[1];

    togHolder.append(togFront);
    togHolder.append(togBack);
    holder.append(togHolder);

    this.clickEvent.forEach((eve) => {
      holder.addEventListener(eve, () => {
        flipped = !flipped;
        togHolder.classList.toggle("flipped");
        this.clickHandler(settings[flipped ? 1 : 0]);
      }, false);
    });

    this.resets.push(() => {
      flipped = false;
      togHolder.classList.remove("flipped");
    });

    return holder;
  }

  makeKeyPad() {
    const pad = ~~(Math.random() * this.pads.length);
    const emos = this.pads.splice(pad, 1)[0];
    const holder = document.createElement("div");
    holder.classList.add("control");

    const keyHolder = document.createElement("div");
    keyHolder.classList.add("key-holder");

    ['add-me'].forEach((eve) => {
      holder.addEventListener(eve, (e) => {
        e.stopPropagation();
        const seq = [...new Array(~~(Math.random() * 4) + 2)].map(
          (a) => emos[~~(Math.random() * emos.length)]
        );

        if (this.loading) {
          seq.forEach((a) => {
            this.targetSeq.push(a);
          });
        }

        keyHolder.classList.add('emph');
        setTimeout(() => {
          keyHolder.classList.remove('emph');
        }, 500);
      }, false);
    });

    const row1 = document.createElement("div");
    row1.classList.add("key-row");
    const row2 = document.createElement("div");
    row2.classList.add("key-row");

    emos.forEach((emo, i) => {
      let button;
      button = document.createElement("div");
      button.innerHTML = emo;
      button.classList.add("key-button");


      [isMobile ? 'touchstart' : 'mousedown'].forEach((eve) => {
        button.addEventListener(eve, (e) => {
          e.stopPropagation();
          say(emo);
          if (emo === this.targetSeq[0]) {
            this.targetSeq.shift();
            if (this.targetSeq.length == 0) {
              this.addScore();
            } else {
              this.instructions.innerHTML = "<span class='attn'>➭</span>  " + this.targetSeq.join(", ");
            }
          } else {
            this.end(false);
          }
        }, false);
      });

      if (i % 2 == 1) {
        row2.append(button);
      } else {
        row1.append(button);
      }
    });
    keyHolder.append(row1);
    keyHolder.append(row2);

    holder.append(keyHolder);
    return holder;
  }

  newControl() {
    const rand = Math.random();

    switch (true) {
      case rand < 0.2 && !this.keypad:
        this.keypad = true;
        return this.makeKeyPad();
        break;
      case rand < 0.51:
        return this.makeToggle(remoji(2));
        break;
      default:
        return this.makeDial(remoji(3));
        break;
    }
  }

  newSequence() {
    this.game.classList.add('lock-msg');
    this.paused = true;
    this.loading = true;
    this.targetSeq = [];
    const controls = document.querySelectorAll("#controls .control");
    const symb = ~~(Math.random() * this.difficulty) + ~~(Math.random() * this.difficulty * 0.75) + Math.max(config.currentLevel, 2);

    for (let i = 0; i < symb; i++) {
      setTimeout(() => {
        const event = new CustomEvent("add-me");
        controls[~~(Math.random() * controls.length)].dispatchEvent(event);
        this.instructions.innerHTML = "<span class='attn'>➭</span>  " + this.targetSeq.join(", ");
      }, i * 500);
    }

    setTimeout(() => {
      this.resetAll();
      setTimeout(() => {
        this.game.classList.remove('lock-msg');
        say('go');
        this.beginTimer();
        this.disable(false);
        this.paused = false;
      }, 500);
    }, (symb + 1) * 500);
  }

  setup() {
    let thisRow,
      numRows = 0;
    const table = document.createElement("table");
    this.game.append(table);
    let numCtrls =
      ~~(Math.random() * this.difficulty * 0.5) +
      ~~(Math.random() * this.difficulty * 0.25) +
      2;
    this.keypad = false;

    const addConts = [];

    while (numCtrls > 0 && numRows < 5) {
      thisRow = Math.min(~~(Math.random() * (numCtrls * 0.9)) + 1, 6);
      if (thisRow > numCtrls) {
        thisRow = numCtrls;
      }

      for (let i = 0; i < thisRow; i++) {
        const two = remoji(2);
        const three = remoji(3);
        addConts.push(this.newControl(two, three));
        numRows++;
      }
    }

    const rowsNum = nearSquare(addConts.length);
    const cells = [];

    for (let i = 0; i < rowsNum; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < rowsNum; j++) {
        const cell = document.createElement("td");
        row.append(cell);
        cells.push(cell);
      }
      table.append(row);
    }

    let tries = 0;

    while (addConts.length < cells.length && tries < 3) {
      if (Math.random() > 0.5) {
        let randCell = ~~(Math.random() * rowsNum);
        const randRow = ~~(Math.random() * rowsNum) - 1;
        randCell = randCell + randRow * randCell;
        cells[randCell].setAttribute("colspan", 2);
        cells[randCell + 1].remove();
        cells.splice(randCell + 1, 1);
      } else {
        const randCell = ~~(Math.random() * rowsNum);
        const randRow = ~~(Math.random() * rowsNum) - 1;
        cells[randCell + randCell * randRow].setAttribute("rowspan", 2);
        if (cells[randCell + randCell * randRow + rowsNum - 1]) {
          cells[randCell + randCell * randRow + rowsNum - 1].remove();
          cells.splice(randCell + randCell * randRow + rowsNum - 1, 1);
        }
      }
      tries++;
    }

    cells.forEach((c, i) => {
      if (addConts[i]) {
        c.append(addConts[i]);
      } else {
        c.remove();
      }
    });


    [].forEach.call(
      document.querySelectorAll("#controls .control"),
      (control) => {
        const rect = control.parentElementgetBoundingClientRect();
        const small = Math.min(control.offsetWidth, control.offsetHeight);
        control.style.fontSize = `${(small / 2)}px`;
      }
    );
  }

  resetAll() {
    this.loading = false;
    this.resets.forEach((r) => r());
  }

  start() {
    super.start();
    this.disable();
    setTimeout(() => {
      this.newSequence();
      this.score.innerText = this.current;
      this.game.prepend(this.score);
    }, 2000);
  }
}

class controls2 extends controls {
  constructor(container, difficulty = 20, target = 5) {
    target = Math.min(Math.ceil(target * 0.2), 3);
    difficulty = Math.max(difficulty, 1);
    super(container, difficulty, target, "controls", `Press the buttons to make this sequence:`);
  }
  newControl() {
    return this.makeKeyPad();
  }

  newRow(cNum = 2) {
    if (!this.rows) {
      this.rows = 0;
    }
    if (this.rows < 2) {
      super.newRow(2);
    }
    this.rows++;
  }
}

class flipper extends game {
  constructor(container, difficulty = 4, target = 2) {
    target = Math.max(Math.min(config.currentLevel, ~~(Math.random() * 3 * difficulty + Math.random() * 3 * target)), 2);
    difficulty = Math.max(target * config.currentLevel * 1.2, difficulty) + 2;
    super(container, difficulty, target, "flipper", `Find ${target} Pairs of Matching Symbols`);
    this.board = [];
    this.cards = remoji(Math.min(Math.ceil(target), Math.ceil(difficulty)));
    this.cards = this.cards.reduce((r, c) => {
      return r.concat([c, c]);
    }, []);
  }

  addPiece(piece) {
    if (!piece) {
      piece = this.cards[~~(Math.random() * this.cards.length)];
    }
    const div = document.createElement("div");
    div.innerHTML = `<svg
    width="100%" height="100%"
    viewBox="-50 -50 100 75"
    xmlns="http://www.w3.org/2000/svg"
  ><text x="0" y="0" text-anchor="middle" font-size="50">${piece}</text>
      </svg>`;
    div.classList.add("piece");
    const clickstart = () => {
      say(piece);
      this.clickHandler(div, piece);
    };
    div.onmousedown = clickstart.bind(this);
    div.ontouchstart = clickstart.bind(this);
    return div;
  }

  clickHandler(card, piece) {
    this.disable();
    const clicked = document.getElementsByClassName("clicked")[0];
    card.classList.add("clicked");

    if (this.currentPiece) {
      const winner = this.currentPiece == piece;
      this.currentPiece = null;

      setTimeout(() => {
        this.paused = true;
        if (winner) {
          this.addScore();
          clicked.classList.add('finished');
          card.classList.add('finished');
        }
        clicked.classList.remove("clicked");
        card.classList.remove("clicked");
        setTimeout(() => {
          this.paused = false;
          this.disable(false);
        }, 500);
      }, 500);
    } else {
      this.currentPiece = piece;
      setTimeout(() => {
        this.disable(false);
      }, 10);
    }
  }

  addScore(plus = 1) {
    this.current += plus;
    this.score.innerText = this.current;

    if (this.current >= this.target) {
      this.playing = false;
      this.disable();
      this.paused = true;
      [].forEach.call(document.getElementsByClassName("piece"), (c) => {
        c.classList.add('clicked');
      });
      setTimeout(() => {
        this.end(true);
      }, 1000);
    }
  }

  start() {
    super.start();
    const rows = Math.min(this.target / 2, 5) + 1;
    const cols = Math.min(this.target / 2, 5) + 1;
    this.board = [];
    let pieces = this.cards.slice(0)
      .sort(() => Math.random() > 0.5 ? -1 : 1)
      .sort(() => Math.random() > 0.5 ? -1 : 1)
      .sort(() => Math.random() > 0.5 ? -1 : 1);

    let row;

    for (let i = 0; i < (cols); i++) {
      row = document.createElement("div");
      row.classList.add("row");
      for (let j = 0; j < (rows); j++) {
        row.append(this.addPiece(pieces.pop()));
      }
      Math.random() > 0.5 ? this.game.append(row) : this.game.prepend(row);
    }
    this.game.removeChild(this.score);
    this.game.prepend(this.score);
    this.disable(false);
    this.playing = true;
    setTimeout(() => {
      this.beginTimer();
    }, 1000);
  }
}

class taptap extends game {
  constructor(container, difficulty, target) {
    difficulty = Math.max(difficulty, 1) * 5;
    target = Math.min(~~(Math.random() * target * 2) + 2, (~~(Math.random() * 20) + 2));
    super(container, difficulty, target, 'taptap', `Click on any ${target} hearts - Avoid the 💣`);
  }

  addPiece() {
    if (!this.playing) {
      return;
    }

    const piece = document.createElement("a");
    const left = Math.random() > 0.5;
    const bad = Math.random() > 0.5;
    piece.classList.add("piece");
    piece.classList.add(left ? "left" : "right");
    piece.classList.add(bad ? "bad" : "good");
    piece.innerHTML = bad ? '<div>💣</div>' : ['🧡', '💛', '💚', '💙', '💜', '🖤', '❤️'][~~(Math.random() * 7)];
    this.game.appendChild(piece);
    piece.style = `transform: translateY(${(Math.random() * 600) - 300}px) translateX(${
      left ? -20 : 20
    }px);`;

    piece.ontransitionend = () => {
      piece.classList.add("remove-me");
    };

    piece.ontouchstart = this.clickHandler.bind(this, piece, bad);
    piece.onmousedown = this.clickHandler.bind(this, piece, bad);

    setTimeout(() => {
      piece.style = `transform: translateY(${(Math.random() * 600) - 300}px) translateX(${
        left ? 800 : -800
      }px); transition-duration: ${Math.random() * 4 + 2}s;`;
    }, 300);

    setTimeout(this.addPiece.bind(this), Math.random() * 10000);
  }

  clickHandler(piece, bad) {
    piece.style = "display:none;";
    if (bad) {
      this.end(false);
    } else {
      this.current += 1;
      this.score.innerText = this.current;
      say(this.current);
      if (this.current >= this.target) {
        this.end(true);
      }
    }
  }

  start() {
    super.start();
    this.playing = true;
    this.beginTimer();
    for (let i = 0; i < this.difficulty; i++) {
      setTimeout(this.addPiece.bind(this), Math.random() * 1000);
    }
  }
}

class findTheJack extends game {
  constructor(container, difficulty = 20, target = 5) {
    target = Math.min(Math.ceil(target * 0.25), 4);
    difficulty = Math.max(difficulty, 1) * 1.3;
    const tries = Math.max(1, ~~(4 - config.currentLevel * 0.3));
    super(container, difficulty, target, "findTheJack", `${tries} tries to find a key`);
    this.tries = tries;
    this.disable();
  }

  addPiece(winning = false) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style = 'transform: translateY(-200px) translateX(0)';
    const card = document.createElement("div");
    card.classList.add('card');
    let emo = winning ?
      this.winning :
      this.emos[~~(Math.random() * this.emos.length)];
    card.innerHTML = `<div>${emo}</div>`;
    if (winning) {
      card.classList.add("winner");
    }

    piece.append(card);

    const clickstart = () => {
      say(emo);
      this.clickHandler(piece, winning);
    };
    card.onmousedown = clickstart.bind(this);
    card.ontouchstart = clickstart.bind(this);
    this.game.append(piece);
    this.cards.push(piece);
  }

  removeCards() {
    this.cards.forEach((c) => {
      c.style = 'transform: translateY(-200px) translateX(0)';
      setTimeout(() => {
        c.parentNode.removeChild(c);
      }, 1500);
    });
  }

  clickHandler(piece, winner) {
    this.disable();
    this.paused = true;
    piece.children[0].classList.add("clicked");

    if (winner) {
      say('the key');
      this.addScore();

    } else {
      this.tries--;

      this.cards.forEach((c) => {
        c.children[0].classList.add('clicked');
        c.children[0].classList.add('fadeOut');
      })

      if (this.tries > 0) {
        setTimeout(() => {
          this.removeCards();
          setTimeout(() => {
            this.start();
          }, 2000);
        }, 2000);
      } else {
        setTimeout(() => {
          this.end(false);
        }, 2000);
      }
    }
  }

  addScore(plus = 1) {
    this.score.innerText = 1;

    setTimeout(() => {
      this.end(true);
    }, 1000);
  }

  squareCards() {
    let i, j;
    for (i = 0; i < this.square; i++) {
      for (j = 0; j < this.square; j++) {
        this.cards[j + this.square * i].style = `transform: translateY(${
           (j + 0.5) * (450 / this.square)
        }px) translateX(${ (i + 0.5) * (605 / this.square)}px);`;
      }
    }
  }

  shuffle(shuffNum = 0) {
    const shuffleTime = 1800 / this.cards.length;
    this.cards.forEach((c, i) => {
      setTimeout(() => {
        c.style = `transform: translateY(${randBetween(100, 350)}px) translateX(${randBetween(
          200,
          400
        )}px) rotateZ(${~~(Math.random()* 360)-180}deg) scale(${0.5 + Math.random()});`;
        c.classList.toggle(Math.random() > 0.8 ? 'variant' : 'white');
      }, Math.random() * i * shuffleTime);
    });

    if (shuffNum > 0) {
      shuffNum--;
      setTimeout(() => {
        this.shuffle(shuffNum);
      }, Math.random() * this.cards.length * shuffleTime);
    } else {
      setTimeout(() => {
        this.cards = this.cards.sort(() => (Math.random() > 0.5 ? 1 : -1));
        this.cards.forEach(c => c.classList.remove('white'));
        this.cards.forEach(c => c.classList.remove('variant'));
        this.squareCards();
        say('select');
        this.disable(false);
        this.paused = false;
      }, this.cards.length * shuffleTime);
    }
  }

  setup() {
    this.square = Math.min(1 + config.currentLevel, 6);
    this.cards = [];
    this.winning = '🔑';
    this.emos = ['🔒'];
    this.instructions.innerHTML = `Find any ${this.winning}: ` + (this.tries > 1 ? `${this.tries} rounds remaining.` : 'Last Round');
    const winNum = Math.min(~~(this.square * this.square * 0.5), ~~randBetween(1, (Math.pow(this.square, 2) - 2) / (Math.random() * this.difficulty)));
    const loseNum = Math.pow(this.square, 2) - winNum;
    let i, j;
    for (i = 0; i < winNum; i++) {
      this.addPiece(true);
    }
    for (i = 0; i < loseNum; i++) {
      this.addPiece(false);
    }

    this.cards = this.cards.sort(() => (Math.random() > 0.5 ? 1 : -1));

    setTimeout(() => {
      this.squareCards();
    }, 100);
  }

  start() {
    super.start();
    this.playing = true;
    this.paused = true;
    this.beginTimer();
    this.disable();
    this.setup();
    const winners = document.getElementsByClassName("winner");
    [].forEach.call(winners, (piece, i) => {
      setTimeout(() => {
        piece.classList.add("clicked");
        setTimeout(() => {
          piece.classList.remove("clicked");
        }, 2000);
      }, 500 + i * (1000 / winners.length));
    });

    setTimeout(() => {
      this.shuffle(3);
    }, winners.length * 100 + 3500);
  }
}
