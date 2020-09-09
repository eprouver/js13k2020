let isMobile = false;
if (typeof window.orientation !== 'undefined') {
  isMobile = true;
}

document.monetization = { state: true };
if (document.monetization&&document.monetization.state) {
  document.getElementById('monetization').style.display = 'none';
}

const viewport = document.getElementById("viewport");
const container = document.getElementById("container");
const searching = document.getElementById("searching");

const config = {
  height: 600,
  width: 700,
  base: [0, 0, -2000, 0, 0, 0],
  loadMusic: [, , , 17, 16],
  four: [, , , 21, , , 21, , , 21, , 24],
  block: [, , , , , 21, , 21, , 24],
  levelUp: [, , , 12, , , 9, , 9, , , 7, , 4, 5, 4],
  start: [, , 21, , 16, , 12, , 9, 7, 4],
  explode: [, 25, 24, 25, 24, 25, 24, 25],
  winProgress: 700,
  startProgress: 1300,
  zoomScaler: 1.5,
  progressDecay: 0.9,
  endingSpeed: 200,
  explodeScale: 2300,
  languages: [],
  difficulties: [1, 1, 1, 1, 1],
  targets: [1, 1, 1, 1, 1],
  diftimes: 1.55,
  tartimes: 1.75,
  levelProgress: 2000,
  timeLimit: 40,
  currentLevel: 1,
};

const randBetween = (min, max) => {
  return ~~(Math.random() * (max - min + 1) + min);
};

const removeAllChildren = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

let sound = true;

const toggleSound = () => {
  sound = !sound;
  play([, 12]);
  [].forEach.call(document.getElementsByClassName("toggle-sound"), (ts) => {
    ts.innerHTML = sound ? "🔊" : "🔈";
  });
};

const selectNewVoice = (specific) => {
  if (!sound || isMobile) return;
  const oldLang = config.lang;
  let tries = 0;

  while (config.lang === oldLang && tries < 3) {
    tries++;
    config.lang = specific || config.languages[randBetween(0, config.languages.length)];
  }
  voice = window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.indexOf(config.lang) > -1);
  voice = voice[randBetween(0, voice.length)];
}

let voice;
selectNewVoice();

let say = (m) => {
  if (!sound || isMobile) return;
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance();
  msg.voice = voice;
  msg.volume = 3;
  msg.rate = 1.3;
  msg.pitch = randBetween(3, 12) / 10;
  msg.text = m;
  msg.lang = config.lang;
  speechSynthesis.speak(msg);
};

const play = (D) => {
  if (!sound || isMobile) return;
  eval(
    `with(new AudioContext)
    with(G=createGain())
    for(i in D)
    with(createOscillator())
    if(D[i])
    connect(G),
    G.connect(destination),
    start(i*.1),
    frequency.setValueAtTime(440*1.06**(13-D[i]),i*.1),
    gain.setValueAtTime(0.5,i*.1),
    gain.setTargetAtTime(.0001,i*.1+.08,.005),
    stop(i*.1+.09)`);
};

setInterval(() => {
  [].forEach.call(document.getElementsByClassName("remove-me"), (p) => {
    p.parentNode.removeChild(p);
  });
}, 2000);

document.body.addEventListener('touchend', function preventZoom(e) {
  var t2 = e.timeStamp;
  var t1 = e.currentTarget.dataset.lastTouch || t2;
  var dt = t2 - t1;
  var fingers = e.touches.length;
  e.currentTarget.dataset.lastTouch = t2;

  if (!dt || dt > 500 || fingers > 1) return; // not double-tap

  e.preventDefault();
  e.target.click();
});

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
        this.playing = false;
        say("Time");
        this.end(false, 'time');
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
      say('unlocked!');
      [].forEach.call(document.querySelectorAll("#controls .control"), (c) => {
        c.classList.add('winner')
      });
      setTimeout(() => {
        super.end(true);
      }, 1000);
    } else {
      this.disable();
      if (icon === 'time') {
        this.instructions.innerHTML = "Time's up!";
      } else {
        say(`Error: You clicked ${icon} not ${this.targetSeq[0]}`);
        this.instructions.innerHTML = `You clicked ${icon} not ${this.targetSeq[0]}`;
      }

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
            this.end(false, emo);
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

  newRow(cNum = 2) {
    let holder,
      cHolder,
      i;
    cHolder = document.createElement("div");
    cHolder.classList.add("c-holder");
    for (i = 0; i < cNum; i++) {
      holder = this.newControl();
      cHolder.append(holder);
    }
    if (Math.random() > 0.5) {
      this.game.prepend(cHolder);
    } else {
      this.game.append(cHolder);
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
    this.lockmsg = document.createElement('div');
    this.lockmsg.classList.add('locks');
    this.game.append(this.lockmsg);
    let thisRow, numRows = 0;
    let numCtrls = (this.difficulty) + ~~(Math.random() * (this.difficulty / this.target)) + (config.currentLevel * 0.35);
    this.keypad = false;

    while (numCtrls > 0 && numRows < 5) {
      thisRow = Math.min(~~(Math.random() * (numCtrls * 0.9)) + 1, 6);
      if (thisRow > numCtrls) thisRow = numCtrls;

      this.newRow(thisRow);
      numCtrls -= thisRow;
      numRows++;
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
    div.innerHTML = `<svg width="100%" height="100%" viewBox="-50 -50 100 75" xmlns="http://www.w3.org/2000/svg"><text x="0" y="0" text-anchor="middle" font-size="50">${piece}</text></svg>`;
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

    if (this.currentPiece && this.playing) {
      const winner = this.currentPiece == piece;
      this.currentPiece = null;

      setTimeout(() => {
        if (!this.playing) return;
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
    const bad = Math.random() > 0.55;
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
      say(this.current);
      this.score.innerText = this.current;
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
    super(container, difficulty, target, "findTheJack", `Find a key`);
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
    this.cards.forEach((c) => {
      c.classList.remove("select");
    })

    if (winner) {
      say('the key');
      this.addScore(1);

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
        this.cards.forEach(c => { c.classList.remove('white'); c.classList.remove('variant'); c.classList.add('select'); });
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
    this.instructions.innerHTML = `Find any ${this.winning}: ` + (this.tries > 1 ? `${this.tries} tries remaining.` : 'Last Try');
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
      setTimeout(() => {
        say((this.tries > 1 ? `${this.tries} tries remaining.` : 'Last Try'))
      }, 1500);
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

/* Start Minimap */
const bar = document.getElementById('bar');
const barHolder = document.getElementById('bar-holder');
const leaf = '<div class="leaf testing"></div>';
let leafHolder, currentLeaf, appendLeaf = true,
  barHeight = 30;

const showBarHolder = (ms = 2000) => {
  barHolder.classList.add('active');

  setTimeout(() => {
    barHolder.classList.remove('active');
  }, ms);
};

const addBranch = () => {
  const branch = document.createElement('div');
  branch.classList.add('branch');
  const leaves = document.createElement('div');
  leaves.classList.add('leaves');
  leafHolder = leaves;

  if (barHeight < 90) {
    barHeight += 5;
  }

  barHolder.style = `height: ${barHeight}vh`;

  setTimeout(() => {
    bar.append(branch);
    bar.append(leaves);
  }, 250);
  showBarHolder();
}

const addLeaf = () => {
  setTimeout(() => {
    if (currentLeaf) {
      currentLeaf.classList.remove('testing');
      currentLeaf.classList.add('ended');
    }

    const leaf = document.createElement('div');
    leafHolder.children.length ? leafHolder.insertBefore(leaf, leafHolder.children[~~(leafHolder.children.length / randBetween(1, 4))]) : leafHolder.append(leaf);
    leaf.classList.add('leaf');

    setTimeout(() => {

      leaf.classList.add('testing');

      appendLeaf = !appendLeaf;
      currentLeaf = leaf;

    }, 300);
  }, 250);
  showBarHolder();
}

const finishLeaf = () => {
  if (currentLeaf) {
    setTimeout(() => {
      currentLeaf.classList.remove('testing');
      currentLeaf.classList.add('finished');
    }, 250);

    showBarHolder();
  }
}
/* End Minimap */

/* Start Explode */
const drawRect = (c, color = 'white') => {
  c.style = 'display: inline-block';
  const ctx = c.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

function explode(c, times = 3) {
  let copy;
  const prevslices = [];
  const ctx = c.getContext("2d");

  for (let i = 0; i < 15; i++) {
    copy = document.createElement("canvas");
    copy.classList.add("explode-copy");
    copy.width = c.width;
    copy.height = c.height;
    c.parentNode.appendChild(copy);
    copy = copy.getContext("2d");
    copy.drawImage(c, 0, 0);

    copy.save();
    copy.filter = "contrast(200%)";
    copy.translate(
      Math.random() * ctx.canvas.width,
      Math.random() * ctx.canvas.height
    );
    copy.rotate(2 * Math.random() * Math.PI);
    copy.fillStyle = "black";
    copy.scale(Math.random() * 2, Math.random() * 2);
    copy.globalCompositeOperation = "destination-in";
    copy.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    copy.restore();

    prevslices.forEach(function(v) {
      copy.globalCompositeOperation = "destination-out";
      copy.drawImage(v.canvas, 0, 0);
    });
    prevslices.push(copy);
  }

  copy = document.createElement("canvas");
  copy.classList.add("explode-copy");
  copy.width = c.width;
  copy.height = c.height;
  copy = copy.getContext("2d");
  prevslices.forEach(function(v) {
    copy.globalCompositeOperation = "source-over";
    copy.drawImage(v.canvas, 0, 0);
  });
  copy.globalCompositeOperation = "source-out";
  copy.drawImage(c, 0, 0);
  c.parentNode.appendChild(copy.canvas);
  c.style = "display:none";

  setTimeout(function() {
    [].forEach.call(document.querySelectorAll("canvas.explode-copy"), (v, i) => {
      v.style = `transition-duration: ${(Math.random() * 5000) + 500}ms;filter: hue-rotate(380deg) brightness(2) saturate(0.2);transform:translate3d(${randBetween(-config.explodeScale, config.explodeScale)}px,${randBetween(-config.explodeScale, config.explodeScale)}px, ${randBetween(-config.explodeScale, config.explodeScale * 3)}px) rotateX(${randBetween(-100, 100)}deg) rotateY(${randBetween(-100, 100)}deg) rotateZ(${randBetween(-100, 100)}deg); opacity: 0;`;
      v.addEventListener("transitionend", () => {
        v.classList.add("remove-me");
        c.classList.add("remove-me");
      });
    });
  }, 10);
}

/* End Explode */

const windowScale = () => {
  const hScale = window.innerHeight / config.height;
  const wScale = window.innerWidth / config.width;
  config.size = hScale > wScale ? wScale : hScale;
  container.style = `transform: scale(${config.size})`;
  document.body.style = `width:${window.innerWidth}px; height:${window.innerHeight}px;`;

  const timer = document.getElementById('timer-holder');
  if (!timer.classList.contains('not-playing')) {
    timer.classList.add('not-playing');
    setTimeout(() => {
      timer.classList.remove('not-playing');
    }, 1500);
  }
};

window.onresize = windowScale;
window.onorientationchange = windowScale;
setTimeout(() => {
  windowScale();
}, 500);

const viewportTransform = (val) => {
  val = val.map((val) => -val);
  return `transform: rotateZ(${val[5]}deg) rotateY(${val[4]}deg) rotateX(${val[3]}deg) translate3d(${val[0]}px, ${val[1]}px, ${val[2]}px)`;
};

const contentTransform = (val) => {
  return `transform: translate(-50%, -50%) translate3d(${val[0]}px, ${val[1]}px, ${val[2]}px) rotateX(${val[3]}deg) rotateY(${val[4]}deg) rotateZ(${val[5]}deg);`;
};

let ns, points, degs, vals, progress;

const reset = (empty = true) => {
  ns = null;
  points = [0, 0, 0].map((p) => randBetween(-3000, 3000));
  degs = [0, 0, 0].map((p) => randBetween(-300, 300));
  progress = config.startProgress;
  viewport.style = viewportTransform(config.base);
  viewport.classList.add('loading');
  container.classList.remove('winning');
  windowScale();

  if (empty) {
    removeAllChildren(viewport);
    config.winProgress *= config.progressDecay;
    addBranch();
    addLeaf();
    dummySlides();
  }
};

const addContent = () => {
  const c = config.currentGame;
  const games = ((document.monetization&&document.monetization.state) ? [taptap, controls, controls2, flipper, findTheJack] : [taptap, controls, flipper])
  while (c === config.currentGame) {
    config.currentGame = ~~(Math.random() * games.length);
  }

  let myGame = games[config.currentGame];
  myGame = new myGame(ns, ~~config.difficulties[config.currentGame], ~~config.targets[config.currentGame]);
  myGame.start();
};

const dummySlides = () => {
  let dummy, pts, degrees, pos, gray;
  for (let i = 1; i < 10; i++) {
    for (let j = 1; j < 5; j++) {
      pts = [0, 0, 0].map((p) => randBetween(-3500 * i, 3500 * i))
        .map(p => p > 0 ? p + 600 : p - 600);
      degrees = [0, 0, 0].map((p) => randBetween(-20, 20));

      pos = pts.concat(degrees);
      dummy = document.createElement("div");
      dummy.classList.add("slide");
      dummy.classList.add("dummy");
      gray = randBetween(0, 66);
      dummy.style = `${contentTransform(pos)} background-color: rgb(${gray},${gray},${gray})`;
      viewport.append(dummy);
    }
  }
}

const nextSlide = (passed) => {
  container.classList.remove('playing')
  searching.classList.remove('expand');
  if (ns) {
    ns.classList.remove("playing");
    if (!passed) {
      config.timeLimit += 15;
      config.difficulties = config.difficulties.map(d => d * 0.9);
      config.difficulties[config.currentGame] *= 0.9;
      config.targets[config.currentGame] *= 0.9;
      setTimeout(() => {
        say("blocked");
      }, 500);
      play(config.block);
      ns.classList.add("failed");
      ns.innerHTML = "<h1>😢</h1><p>Blocked</p>";
      addLeaf();
    } else if (progress < config.levelProgress) {
      config.difficulties[config.currentGame] *= config.diftimes;
      config.targets[config.currentGame] *= config.tartimes;
      config.timeLimit -= 2;
      setTimeout(() => {
        say("for oh for. null pointer");
      }, 500);
      play(config.four);
      ns.classList.add("finished");
      ns.innerHTML = "<h1 class='glitch'>404</h1><p>You found a null pointer!</p>";
      progress += config.winProgress;
    } else {
      config.timeLimit -= 10;
      config.levelProgress *= 1.25;
      config.targets = config.targets.map(t => t += 1);
      say(["yess... continue", "good things", "Advance"][~~(Math.random() * 3)]);
      play(config.levelUp);
      ns.classList.add("winning");
      container.classList.add("winning");
      config.currentLevel += 1;
      const faces = ['😃', '😄', '😎', '😊', '🤠', '😆', '😁', '🤩', '😜', '😋', '😲'];
      ns.innerHTML = `<h1>${faces[~~randBetween(0, Math.min(config.currentLevel * 2, faces.length - 1))]}</h1>`;
      selectNewVoice();

      setTimeout(() => {
        say(`Welcome to Level ${config.currentLevel}`);
        finishLeaf()
        reset(true);
        nextSlide();
      }, 25 * config.endingSpeed);

      return;
    }
  }

  points = points.map((p) => randBetween(-progress * config.zoomScaler, progress * config.zoomScaler));
  degs = [randBetween(-20, 20), randBetween(-120, 120), 0];

  vals = points.concat(degs);
  const oldNS = ns;

  ns = document.createElement("div");
  ns.classList.add("slide");
  ns.style = contentTransform(vals);
  viewport.append(ns);
  container.classList.add("loading");
  setTimeout(() => {
    viewport.classList.remove('loading');
    container.style = `transform: scale(${config.size / (config.startProgress * config.zoomScaler / 850)})`;
  }, 5 * config.endingSpeed);

  setTimeout(() => {
    if (oldNS && passed) {
      oldNS.innerHTML = '';
      const canvas = document.createElement('canvas');
      canvas.classList.add('slide-canvas');
      canvas.setAttribute('width', '605');
      canvas.setAttribute('height', '500');
      drawRect(canvas, passed ? '#148' : '#a11');
      oldNS.append(canvas);
      oldNS.classList.add('hidden');
      explode(canvas, 1);
      play(config.explode);
      say('deleted');
    }

    const zoom = config.size / (config.startProgress * config.zoomScaler / 150);
    container.style = `transform: scale(${zoom})`;
  }, 18 * config.endingSpeed);
  if (!passed) {
    setTimeout(() => {
      searching.classList.add("expand");
    }, 21 * config.endingSpeed);
  }
  setTimeout(() => {
    play(config.loadMusic);
    ns.classList.add("loading");
  }, 23 * config.endingSpeed);
  setTimeout(() => {
    say("suspicion");
  }, 30 * config.endingSpeed);
  setTimeout(() => {
    ns.classList.remove("loading");
    ns.classList.add("playing");
    container.classList.remove("loading");
    container.style = `transform: scale(${config.size})`;
    ns.style = contentTransform(vals);
    viewport.style = viewportTransform(vals);
    setTimeout(() => {
      container.classList.add("playing");
      addContent();
    }, 1800);
  }, 32 * config.endingSpeed);
};


if (isMobile) {
  document.body.classList.add('mobile');
  sound = false;
}
reset(false);
setTimeout(() => {
  config.languages = config.languages = window.speechSynthesis
    .getVoices()
    .map((voice) => voice.lang);
  selectNewVoice("en-GB");
}, 1000);

viewport.classList.remove('loading');
vals = [0, 0, 0, 0, 0, 0];
document.getElementById("title").style = contentTransform(vals);
viewport.style = viewportTransform(vals);
