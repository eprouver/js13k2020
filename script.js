let isMobile = false;
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
  isMobile = true;
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
  explode: [,25,24,25,24,25,24,25],
  winProgress: 700,
  startProgress: 1300,
  zoomScaler: isMobile ? 0.8 : 1.5,
  progressDecay: 0.9,
  endingSpeed: 200,
  explodeScale: 2300,
};

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

  for (let i = 0; i < 10; i++) {
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
      v.style = `transition-duration: ${(Math.random() * 2000) + 500}ms;
      filter: hue-rotate(180deg) brightness(2) saturate(0.2);
      transform: rotateX(${randBetween(-100, 100)}deg)
      rotateY(${0})
      rotateZ(${randBetween(-100, 100)}deg)
      translate3d(${randBetween(-config.explodeScale, config.explodeScale)}px, ${randBetween(-config.explodeScale, config.explodeScale)}px, ${randBetween(-config.explodeScale, config.explodeScale)}px);
      opacity: 0;`;
      v.addEventListener("transitionend", () => {
        v.classList.add("remove-me");
        c.classList.add("remove-me");
      });
    });
  }, 10);

  for (let i = 1; i < times + 1; i++) {
    setTimeout(explode.call(this, c, 0), i * 10);
  }
}

/* End Explode */

const windowScale = () => {
  const hScale = window.innerHeight / config.height;
  const wScale = window.innerWidth / config.width;
  config.size = hScale > wScale ? wScale : hScale;
  container.style = `transform: scale(${config.size})`;
  document.body.style = `width:${window.innerWidth}px; height:${window.innerHeight}px;`
};

window.onresize = windowScale;
window.onorientationchange = windowScale;
windowScale();

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
    if (config.endingSpeed > 70) {
      config.endingSpeed *= config.progressDecay;
    }
    addBranch();
    addLeaf();
    dummySlides();
  }
};

const addContent = () => {
  ns.innerHTML = '<button onclick="nextSlide(true)">Passed</button> <button onclick="nextSlide(false)">Failed</button>';
};

const dummySlides = () => {
  // if (!isMobile) {
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
  // }

  gray = randBetween(0, 66);
  document.body.style = `background-color: rgb(${gray},${gray},${gray})`;
}

const nextSlide = (passed) => {
  container.classList.remove('playing')
  searching.classList.remove('expand');
  if (ns) {
    ns.classList.remove("playing");
    if (!passed) {
      say("bloque");
      play(config.block);
      ns.classList.add("failed");
      ns.innerHTML = "<h1>😢</h1>";
      addLeaf();
    } else if (progress < 2000) {
      say("for oh for. deadend");
      play(config.four);
      ns.classList.add("finished");
      ns.innerHTML = "<h1>404</h1>";
      progress += config.winProgress;
    } else {
      say( ["yess... continue", "good things", "tu vois? quand tu veux", "vachement, acceptable"][~~(Math.random() * 3)]);
      play(config.levelUp);
      ns.classList.add("winning");
      container.classList.add("winning");
      ns.innerHTML = "<h1>😃</h1>";

      setTimeout(() => {
        finishLeaf();
        reset(true);
        nextSlide();
      }, 25 * config.endingSpeed);

      return;
    }
  }

  points = points.map((p) => randBetween(-progress * config.zoomScaler, progress * config.zoomScaler));
  degs = degs.map((p) => randBetween(-20, 20));
  if (Math.random() < 0.1) {
    degs[1] = degs[1] > 0 ? degs[1] + 180 : degs[1] - 180;
  }

  vals = points.concat(degs);
  const oldNS = ns;

  ns = document.createElement("div");
  ns.classList.add("slide");
  ns.style = contentTransform(vals);
  viewport.append(ns);
  container.classList.add("loading");
  setTimeout(() => {
    viewport.classList.remove('loading');
    container.style = `transform: scale(${config.size / (progress * config.zoomScaler / 850)})`;
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
    }

    const zoom = config.size / (progress * config.zoomScaler / 150);
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
    say("New");
  }, 30 * config.endingSpeed);
  setTimeout(() => {
    ns.classList.remove("loading");
    ns.classList.add("playing");
    container.classList.remove("loading");
    windowScale();
    ns.style = contentTransform(vals);
    viewport.style = viewportTransform(vals);
    setTimeout(() => {
      container.classList.add("playing");
      addContent();
    }, 800);
  }, 32 * config.endingSpeed);
};


if (isMobile) {
  document.body.classList.add('mobile');
  sound = false;
}
reset(false);
viewport.classList.remove('loading');
vals = [0, 0, 0, 0, 0, 0];
document.getElementById("title").style = contentTransform(vals);
viewport.style = viewportTransform(vals);
