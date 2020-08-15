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

const voice = window.speechSynthesis
  .getVoices()
  .filter((voice) => voice.default == "Whisper")[0];

const say = (m) => {
  if (!sound) return;
  var msg = new SpeechSynthesisUtterance();
  msg.voice = voice;
  msg.volume = 3;
  msg.rate = 1;
  msg.pitch = randBetween(1, 14) / 10;
  msg.text = m;
  msg.lang = "fr";
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
