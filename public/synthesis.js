const textInput = document.getElementById("text");
const speedInput = document.getElementById("speed");
const voiceInput = document.getElementById("voice");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const stopBtn = document.getElementById("stop");
const synth = speechSynthesis;
let currentChar;
let voices = [];

// populate voice list in select element
voices = synth.getVoices();

function populateVoiceList() {
  if (typeof synth === "undefined") {
    return;
  }
  var voices = synth.getVoices();
  for (var i = 0; i < voices.length; i++) {
    var option = document.createElement("option");
    option.textContent = voices[i].name + " (" + voices[i].lang + ")";

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }
    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    document.getElementById("voice").appendChild(option);
  }
}
populateVoiceList();

if (typeof synth !== "undefined" && synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}

// playing audio of text
function playText(text) {
  if (synth.paused) synth.resume();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = speedInput.value;

  const selectedVoice = voiceInput.selectedOptions[0].getAttribute("data-name");
  voices.forEach((voice) => {
    if (voice.name === selectedVoice) {
      utter.voice = voice;
    }
  });

  utter.addEventListener("end", () => {
    textInput.disabled = false;
  });
  utter.addEventListener("boundary", (e) => {
    currentChar = e.charIndex;
  });
  textInput.disabled = true;
  synth.speak(utter);
}

// Play button
playBtn.addEventListener("click", () => {
  playText(textInput.value);
});

// pause button
pauseBtn.addEventListener("click", () => {
  if (synth.speaking) synth.pause();
});

// stop button
stopBtn.addEventListener("click", () => {
  synth.cancel();
});

// Speed slider
speedInput.addEventListener("input", () => {
  synth.cancel();
  playText(textInput.value.substr(currentChar));
});
