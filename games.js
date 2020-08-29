let emojis = ['🐵', '🐶', '🐺', '🦊', '🐱', '🦁', '🐯', '🐴', '🦄', '🐮','🐷', '🐗', '🐭', '🐁', '🐀', '🐹', '🐰','🦇', '🐻', '🐨', '🐼', '🐔', '🐸', '🐲', '🐳', '🐬', '🐠', '🐚', '🦋', '🐌', '🐜', '🐞', '🌸', '🥀', '🌳', '🌴', '🌵', '🍁', '🍇', '🍉', '🍊', '🍋', '🍌', '🍍', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥑', '🍆', '🥔', '🥕', '🌽', '🥒', '🍄', '🥜', '🌰', '🥐', '🥖', '🥞', '🧀', '🍗', '🥓', '🍔', '🍟', '🍕', '🌭', '🌮', '🥗', '🍤', '🍦','🍩', '🍪', '🍰', '🍫', '🍬', '🍭', '👦🏻', '👦🏼', '👦🏽', '👦🏾', '👦🏿', '👧🏻', '👧🏼', '👧🏽', '👧🏾', '👧🏿', '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿','👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿', '👴🏻', '👴🏼', '👴🏽', '👴🏾', '👴🏿', '👵🏻', '👵🏼', '👵🏽', '👵🏾', '👵🏿', '👶🏻', '👶🏼', '👶🏽', '👶🏾', '👶🏿'];

const remoji = (length) => {
  let arr = [];

  for( var i = 0; i < length; i++) {
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
  }

  end(winner) {
    this.timePath.style.animationPlayState = 'paused';
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
  start() {
    this.timer.classList.remove('not-playing');
    setTimeout(() => {
      this.playing = true;
      this.timePath.setAttribute('style', `animation: dash ${this.timeLimit}s linear 1s reverse;`);

      setTimeout(() => {
        this.timePath.onanimationend = () => {
          if(!this.playing) return;
          this.end(false);
        }
      }, 500);

      this.game.setAttribute('style', 'transform: none');
    }, 1000);
  }
}

class controls extends game {
  constructor(container, difficulty = 20, target = 5) {
    target = Math.min(Math.ceil(target * 0.25), 4);
    difficulty = Math.max(difficulty, 1);
    super(container, difficulty, target, "controls", `Use any controls to recreate the sequence`);
    this.resets = [];
    this.disable();
    this.setup();
  }

  end(winner) {
    this.timePath.style.animationPlayState = 'paused';
    this.lockmsg.classList.add('hidden');
    this.playing = false;
    if (winner) {
      this.disable();
      this.instructions.innerText = "Unlocked!";
            [].forEach.call(document.querySelectorAll("#controls .control"), (c) => { c.classList.add('winner') });
            setTimeout(() => {
              super.end(true);
            }, 1000);
    } else {
      this.disable();
      this.instructions.innerText = "Game Over";

      [].forEach.call(document.querySelectorAll("#controls .control"), (c) => {
        c.style.transition = 'all 1s ease';
        c.style.transform = `translate3d(${~~(Math.random() * 300) - 150 }px, ${~~(Math.random() * 300) + 400 }px, 0)
          rotateZ(${~~(Math.random() * 200) - 100 }deg)`;
      });

      setTimeout(() => {
        super.end(false);
      }, 1000);
    }
  }

  replay() {
    this.instructions.innerText = "...";
    removeAllChildren(this.game);
    this.setup();
    setTimeout(this.start.bind(this), 1000);
  }

  addScore(plus = 1) {
    this.timePath.style.animationPlayState = 'paused';
    this.lockmsg.classList.remove('hidden');
    this.current += plus;
    this.score.innerText = this.current;

    if (this.current >= this.target) {
      this.end(true);
    } else {
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
          this.timePath.style.animationPlayState = 'paused';
          this.addScore();
        } else {
          this.instructions.innerText = this.targetSeq.join(", ");
        }
      } else {
        this.end(false);
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

    holder.onclick = () => {
      current += 1;
      if (current > 2) current = 0;
      dial.parentElement.setAttribute("data-setting", `set_${current}`);
      this.clickHandler(settings[current]);
    };
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

    holder.onclick = () => {
      flipped = !flipped;
      togHolder.classList.toggle("flipped");
      this.clickHandler(settings[flipped ? 0 : 1]);
    };

    this.resets.push(() => {
      flipped = false;
      togHolder.classList.remove("flipped");
    });

    return holder;
  }

  makeKeyPad() {
    const emos = [["💛", "💚", "💜", "💙"],
                 ["🇫🇷","🇨🇦","🇨🇩", "🇩🇿"],
                   ["不","思","可","议"],
                 ["☀️","⛄","🍂", "🌻"]][~~(Math.random() * 3)];
    const holder = document.createElement("div");
    holder.classList.add("control");

    const keyHolder = document.createElement("div");
    keyHolder.classList.add("key-holder");

    holder.onclick = (e) => {
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
      setTimeout(() => { keyHolder.classList.remove('emph'); }, 500);
    };

    const row1 = document.createElement("div");
    row1.classList.add("key-row");
    const row2 = document.createElement("div");
    row2.classList.add("key-row");

    emos.forEach((emo, i) => {
      let button;
      button = document.createElement("div");
      button.innerHTML = emo;
      button.classList.add("key-button");

      button.addEventListener("click", (e) => {
        e.stopPropagation();
        say(emo);
        if (emo === this.targetSeq[0]) {
          this.targetSeq.shift();
          if (this.targetSeq.length == 0) {
            this.addScore();
          } else {
            this.instructions.innerText = this.targetSeq.join(", ");
          }
        } else {
          this.end(false);
        }
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

  newControl(two, three) {
    const rand = Math.random();

    switch (true) {
      case rand < 0.2 && !this.keypad:
        this.keypad = true;
        return this.makeKeyPad();
        break;
      case rand < 0.51:
        return this.makeToggle(two);
        break;
      default:
        return this.makeDial(three);
        break;
    }
  }

  newRow(cNum = 2) {
    let holder,
      cHolder,
      i;
    cHolder = document.createElement("div");
    cHolder.classList.add("c-holder");
    const two = remoji(2);
    const three = remoji(3);
    for (i = 0; i < cNum; i++) {
      holder = this.newControl(two, three);
      cHolder.append(holder);
    }
    if (Math.random() > 0.5) {
      this.game.prepend(cHolder);
    } else {
      this.game.append(cHolder);
    }
  }

  newSequence() {
    this.lockmsg.classList.remove('hidden');
    this.timePath.style.animationPlayState = 'paused';
    this.loading = true;
    this.targetSeq = [];
    const controls = document.querySelectorAll("#controls .control");
    const symb = ~~(Math.random() * this.difficulty) + ~~(Math.random() * this.difficulty * 0.75) + 2;

    for (let i = 0; i < symb; i++) {
      setTimeout(() => {
        controls[~~(Math.random() * controls.length)].click();
        this.instructions.innerText = this.targetSeq.join(", ");
      }, i * 500);
    }

    setTimeout(() => {
      this.resetAll();
      setTimeout(() => {
        this.lockmsg.classList.add('hidden');
        say('go');
        this.disable(false);
        this.timePath.style.animationPlayState = 'running';
      }, 500);
    }, (symb + 1) * 500);
  }

  setup() {
    this.lockmsg = document.createElement('div');
    this.lockmsg.classList.add('lock-msg');
    this.game.append(this.lockmsg);
    let thisRow, numRows = 0;
    let numCtrls = (this.difficulty) + ~~(Math.random() * (this.difficulty / this.target)) + (this.target * 0.35);
    this.keypad = false;

    while (numCtrls > 0 && numRows < 5) {
      thisRow = Math.min(~~(Math.random() * (numCtrls * 0.9)) + 1, 6);
      if (thisRow > numCtrls) thisRow = numCtrls;

      this.newRow(thisRow);
      numCtrls -= thisRow;
      numRows ++;
    }


    [].forEach.call(
      document.querySelectorAll("#controls .control"),
      (control) => {
        const rect = control.getBoundingClientRect();
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

class flipper extends game {
  constructor(container, difficulty = 4, target = 2) {
    target = ~~(Math.random() * target * 0.6) + 2;
    target = Math.min(target, 8);
    difficulty = Math.max(target * 2, difficulty) + 2;
    super(container, difficulty, target, "flipper", `Find ${target} Pairs of Matching Symbols`);
    this.board = [];
    this.cards = remoji(Math.min(Math.ceil(target), Math.ceil(difficulty)));
    this.cards = this.cards.reduce((r, c) => {
      return r.concat([c, c]);
    }, []);
  }

  addPiece(piece) {
    if(!piece) {
      piece = this.cards[~~(Math.random() * this.cards.length)];
    }
    const div = document.createElement("div");
    div.innerHTML = `<svg
    width="100%" height="100%"
    viewBox="-50 -50 100 75"
    xmlns="http://www.w3.org/2000/svg"
  ><text x="0" y="0" text-anchor="middle" font-size="50">${piece}</text>
      </svg>`;
    //div.innerHTML = `<div>${piece}</div>`;
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
    const clicked = document.getElementsByClassName("clicked")[0];
    card.classList.add("clicked");

    if (this.currentPiece) {
      const winner = this.currentPiece == piece;
      this.currentPiece = null;

      this.disable();
      setTimeout(() => {
        if (winner) {
          this.addScore();
          clicked.classList.add('finished');
          card.classList.add('finished');
        }
        clicked.classList.remove("clicked");
        card.classList.remove("clicked");
        setTimeout(() => {
          this.disable(false);
        }, 500);
      }, 500);
    } else {
      this.currentPiece = piece;
    }
  }

  addScore(plus = 1) {
    this.current += plus;
    this.score.innerText = this.current;

    if (this.current >= this.target) {
      this.disable();
      this.timePath.style.animationPlayState = 'paused';
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
      this.game.append(row);
    }
    this.disable(false);
  }
}

class taptap extends game {
  constructor(container, difficulty, target) {
    difficulty = Math.max(difficulty, 1) * 5;
    target = Math.min(~~(Math.random() * target * 2) + 2, 12);
    super(container, difficulty, target, 'taptap', `Click on ${target} ⭐ - Avoid the 💣`);
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
    piece.innerHTML = bad ? '<div>💣</div>' : '⭐';
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
      if (this.current >= this.target) {
        this.end(true);
      }
    }
  }

  start() {
    super.start();
    this.playing = true;
    for (let i = 0; i < this.difficulty; i++) {
      setTimeout(this.addPiece.bind(this), Math.random() * 1000);
    }
  }
}
