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
      v.style = `transition-duration: ${(Math.random() * 5000) + 500}ms;
      filter: hue-rotate(380deg) brightness(2) saturate(0.2);
      transform:
      translate3d(${randBetween(-config.explodeScale, config.explodeScale)}px,
       ${randBetween(-config.explodeScale, config.explodeScale)}px,
        ${randBetween(-config.explodeScale, config.explodeScale * 3)}px)
        rotateX(${randBetween(-100, 100)}deg)
        rotateY(${randBetween(-100, 100)}deg)
        rotateZ(${randBetween(-100, 100)}deg)

        ;
      opacity: 0;`;
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
  const games = [taptap, controls, flipper, findTheJack];
  while(c === config.currentGame) {
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
      config.difficulties = config.difficulties.map(d => d * 0.8);
      say("blocked");
      play(config.block);
      ns.classList.add("failed");
      ns.innerHTML = "<h1>😢</h1><p>Blocked</p>";
      addLeaf();
    } else if (progress < config.levelProgress) {
      config.difficulties[config.currentGame] *= config.diftimes;
      config.targets[config.currentGame] *= config.tartimes;
      config.timeLimit -= 2;
      say("for oh for. null pointer");
      play(config.four);
      ns.classList.add("finished");
      ns.innerHTML = "<h1>404</h1><p>You found a null pointer!</p>";
      progress += config.winProgress;
    } else {
      config.timeLimit -= 10;
      config.levelProgress *= 1.25;
      config.targets = config.targets.map(t => t += 1);
      say( ["yess... continue", "good things", "Advance"][~~(Math.random() * 3)]);
      play(config.levelUp);
      ns.classList.add("winning");
      container.classList.add("winning");
      config.currentLevel += 1;
      const faces = ['😃', '😄', '😎', '😊', '🥳', '🤠','😆', '😁', '🤩', '😜', '😋', '😲'];
      ns.innerHTML = `<h1>${faces[~~randBetween(0, Math.min(config.currentLevel * 2, faces.length))]}</h1>`;
      selectNewVoice();

      setTimeout(() => {
        say(`Welcome to Level ${config.currentLevel}`);
        finishLeaf();
        reset(true);
        nextSlide();
      }, 25 * config.endingSpeed);

      return;
    }
  }

  points = points.map((p) => randBetween(-progress * config.zoomScaler, progress * config.zoomScaler));
  degs = [randBetween(-20, 20),randBetween(-120, 120),0];

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
    selectNewVoice();
}, 1000);

viewport.classList.remove('loading');
vals = [0, 0, 0, 0, 0, 0];
document.getElementById("title").style = contentTransform(vals);
viewport.style = viewportTransform(vals);
