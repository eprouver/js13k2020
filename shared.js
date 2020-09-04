let isMobile = false;
if (typeof window.orientation !== 'undefined') {
  isMobile = true;
}

if (document.monetization && document.monetization.state) {
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
  zoomScaler: isMobile ? 0.8 : 1.5,
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
  const oldLang = specific ? -1 : config.lang;
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
  if (!sound) return;
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
  if (!sound) return;
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

const nearSquare = (n) => {
  if (Math.sqrt(n)%1 === 0) {
    return Math.sqrt(n);
  }

  return nearSquare(++n);
};
