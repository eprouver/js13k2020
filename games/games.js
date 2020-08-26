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
  }

  end(winner) {
    this.playing = false;
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
}

class masterMind extends game {
  constructor(container, difficulty, target) {
    super(container, difficulty, target, 'master-mind', `Find the code: 🌕 = exact, 🌑 = right icon, wrong place`);
  }

  clickHandler(emo) {
    const children = this.guessRow.slotHolder.children;
    children[this.currentSlot].innerHTML = emo;
    this.currentSlot += 1;
    if (this.currentSlot >= children.length) {
      this.currentSlot = 0;
    }
    this.pickSlot(this.currentSlot);
  }

  makeKeyPad() {
    const holder = document.createElement("div");
    holder.classList.add("control");

    const keyHolder = document.createElement("div");
    keyHolder.classList.add("key-holder");

    const row1 = document.createElement("div");
    row1.classList.add("key-row");
    const row2 = document.createElement("div");
    row2.classList.add("key-row");

    this.emos.forEach((emo, i) => {
      let button;
      button = document.createElement("div");
      button.innerHTML = emo;
      button.classList.add("key-button");

      button.addEventListener("click", (e) => {
        this.clickHandler(emo);
      });
      if (i % 2 == 1) {
        row2.append(button);
      } else {
        row1.append(button);
      }
    });
    keyHolder.append(row1);
    keyHolder.append(row2);

    const prompt = document.createElement("div");
    prompt.classList.add("prompt");
    prompt.innerHTML = "ENTER GUESS:";
    holder.append(prompt);

    holder.append(keyHolder);

    const answer = document.createElement("div");
    answer.classList.add("submit");
    answer.innerHTML = "SUBMIT";

    answer.addEventListener("click", () => {
      this.submit();
    });
    holder.append(answer);

    return holder;
  }

  pickSlot(slot) {
    const slots = this.guessRow.slotHolder.children;
    [].forEach.call(slots, (c) => c.classList.remove("active"));
    slots[slot].classList.add("active");

    this.currentSlot = slot;
  }

  newRow(slots, guess = false) {
    const holder = document.createElement("div");
    holder.classList.add("row-holder");
    const pen = document.createElement("div");
    pen.classList.add("pen");
    const slotHolder = document.createElement("div");
    slotHolder.classList.add("slot-holder");
    let slot;
    for (let i = 0; i < slots; i++) {
      slot = document.createElement("div");
      slot.classList.add("slot");
      slot.innerHTML = "❓";
      if (guess) {
        slot.addEventListener("click", () => {
          this.pickSlot(i);
        });
        slot.classList.add("guess");
      }
      slotHolder.append(slot);
    }
    holder.append(pen);
    holder.append(slotHolder);

    return { holder, pen, slotHolder };
  }

  submit() {
    this.disable();
    this.guessRow.pen.innerHTML = "";
    const slots = this.guessRow.slotHolder.children;
    const answer = [].map.call(
      this.guessRow.slotHolder.children,
      (c) => c.innerHTML
    );
    let cows = 0;

    answer.forEach((input, i) => {
      if (this.correct.indexOf(input) === i) {
        this.guessRow.pen.append("🌕");
        cows += 1;
      } else if (this.correct.indexOf(input) > -1) {
        this.guessRow.pen.append("🌑");
      }
    });

    if (cows === answer.length) {
      this.end(true);
      return;
    } else {
      this.target -= 1;
      this.score.innerHTML = this.target;
      if (this.target === 0) {
        [].forEach.call(this.codeRow.slotHolder.children, (c, i) => {
          c.innerHTML = this.correct[i];
        });
        setTimeout(() => {
          this.end(false);
        }, 2000);
        return;
      }
    }
    this.disable(false);

    [].forEach.call(slots, (c) => {
      c.classList.remove("active");
      c.classList.remove("guess");
    });
    const oldHolder = this.guessRow.holder;
    this.guessRow.holder.style.opacity = 0;
    this.tries.prepend(this.guessRow.holder);
    setTimeout(() => {
      oldHolder.style.opacity = 1;
    }, 100);

    this.guessRow = this.newRow(this.guessLength, true);
    this.rowsHolder.append(this.guessRow.holder);
    this.guessRow.pen.innerHTML = "YOUR GUESS:";
  }

  setup(difficulty = 3) {
    this.guessLength = difficulty;
    this.emos = ["❤️", "💚", "🧡", "💙", "💛", "💜"];
    this.correct = [];
    for (let i = 0; i < difficulty; i++) {
      this.correct.push(this.emos[~~(Math.random() * this.emos.length)]);
    }

    this.rowsHolder = document.createElement("div");
    this.rowsHolder.classList.add("rows-holder");
    this.codeRow = this.newRow(difficulty);
    this.codeRow.pen.innerHTML = "THE CODE:";
    this.rowsHolder.append(this.codeRow.holder);
    this.guessRow = this.newRow(difficulty, true);
    this.rowsHolder.append(this.guessRow.holder);
    this.guessRow.pen.innerHTML = "YOUR GUESS:";

    this.game.append(this.rowsHolder);

    this.tries = document.createElement("div");
    this.tries.classList.add("tries");
    this.game.append(this.tries);

    const keypad = this.makeKeyPad();
    this.game.append(keypad);
  }

  start() {
    this.setup(this.difficulty);
    this.score.innerHTML = this.target;
    this.slotIndex = 0;
    this.pickSlot(0);
  }
}

class controls extends game {
  constructor(container, difficulty = 20, target = 5) {
    super(container, difficulty, target, "controls", `Use the controls to recreate the sequence`);
    this.resets = [];
    this.disable();
    this.setup();
  }

  end(winner) {
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
                 ["🇨🇵","🇨🇦","🇨🇩", "🇩🇿"],
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
    this.loading = true;
    this.targetSeq = [];
    const controls = document.querySelectorAll("#controls .control");
    const symb = ~~(Math.random() * this.difficulty) + 2;

    for (let i = 0; i < symb; i++) {
      setTimeout(() => {
        controls[~~(Math.random() * controls.length)].click();
        this.instructions.innerText = this.targetSeq.join(", ");
      }, i * 500);
    }

    setTimeout(() => {
      this.resetAll();
      this.disable(false);
    }, symb * 500);
  }

  setup() {
    let thisRow, numRows = 0;
    let numCtrls = ~~(Math.random() * this.difficulty * 0.5) + ~~(Math.random() * this.difficulty * 0.25) + 2;
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
        const small = Math.min(rect.width, rect.height);
        control.style.fontSize = `${(small / 2) * config.size * 0.4}px`;
      }
    );
  }

  resetAll() {
    this.loading = false;
    this.resets.forEach((r) => r());
  }

  start() {
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
    super(container, difficulty, target, "flipper", `Find ${target} Pairs of Matching Symbols`);
    this.board = [];
    this.cards = remoji(20);
  }

  addPiece(piece) {
    const div = document.createElement("div");
    div.innerHTML = `<div>${piece}</div>`;
    div.classList.add("piece");
    div.onclick = () => {
      say(piece);
      this.clickHandler(div, piece);
    };
    return div;
  }

  clickHandler(card, piece) {
    const clicked = document.getElementsByClassName("clicked")[0];
    card.classList.add("clicked");

    if (this.currentPiece) {
      this.game.style.pointerEvents = 'none';
      const winner = this.currentPiece == piece;
      this.currentPiece = null;

      setTimeout(() => {
        if (winner) {
          this.addScore();
          clicked.classList.add('finished');
          card.classList.add('finished');
          clicked.classList.remove("clicked");
          card.classList.remove("clicked");
        } else {
          clicked.classList.remove("clicked");
          card.classList.remove("clicked");
        }
        setTimeout(() => {
          this.game.style.pointerEvents = 'auto';
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
      setTimeout(() => {
        this.end(true);
      }, 1000);
    }
  }

  start(rows = 2, cols = 2) {
    this.board = [];
    let pieces = Array.from(Array((rows * cols) & ~1), (_, i) => i + 1)
      .map((i) => {
        return this.cards[~~((i + 1) / 2) - 1];
      })
      .sort(() => (Math.random() > 0.5 ? -1 : 0));

    let row;

    for (let i = 0; i < cols; i++) {
      row = document.createElement("div");
      row.classList.add("row");
      for (let j = 0; j < rows && pieces[0]; j++) {
        row.append(this.addPiece(pieces.pop()));
      }
      this.game.append(row);
    }
    this.disable(false);
  }
}

class taptap extends game {
  constructor(container, difficulty, target) {
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
    piece.style = `top: ${Math.random() * 150 - 50}%`;
    this.game.appendChild(piece);

    piece.ontransitionend = () => {
      piece.classList.add("remove-me");
    };

    piece.onmousedown = this.clickHandler.bind(this, piece, bad);

    setTimeout(() => {
      piece.style = `top: ${Math.random() * 150 - 50}%; left: ${
        left ? 120 : -20
      }%; transition-duration: ${Math.random() * 4 + 2}s;`;
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
    this.playing = true;
    for (let i = 0; i < this.difficulty; i++) {
      setTimeout(this.addPiece.bind(this), Math.random() * 1000);
    }
  }
}
