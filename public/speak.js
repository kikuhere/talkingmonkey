// DOM Elements
const textInput = document.getElementById("text");
const speedInput = document.getElementById("speed");
const voiceInput = document.getElementById("voice");
const speedValue = document.getElementById("speedValue");
const pitchInput = document.getElementById("pitch");
const pitchValue = document.getElementById("pitchValue");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const stopBtn = document.getElementById("stop");
// speachSynthesis API
const synth = speechSynthesis;
let currentCharector;

// get all voices in the machine
let voices = [];
const getVoices = () => {
  voices = synth.getVoices();
  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.textContent = voice.name + "(" + voice.lang + ")";
    option.setAttribute("data-name", voice.name);
    option.setAttribute("data-lang", voice.lang);

    // for default voice
    if (voice.default) {
      option.textContent += "-DEFAULT";
    }
    voiceInput.appendChild(option);
  });
};

// call getVoices function (for firefox)
getVoices();

// getting voices through asynchronously when onvoiceschanged event fired
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// speak function
const speak = (text) => {
  if (textInput.value !== "") {
    if (synth.paused) synth.resume();
    const speakText = new SpeechSynthesisUtterance(text);

    // on Error speaking text
    speakText.onerror = (e) => {
      console.error("something went wrong");
    };

    //on finised speaking
    speakText.onend = () => {
      textInput.disabled = false;
    };

    //Change voice
    const selectedVoice =
      voiceInput.selectedOptions[0].getAttribute("data-name");
    voices.forEach((voice) => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // set pitch and speed of the voice
    speakText.rate = speedInput.value;
    speakText.pitch = pitchInput.value;

    // making textinput disabled
    textInput.disabled = true;

    //getting the current speaking charector
    speakText.onboundary = (e) => {
      currentCharector = e.charIndex;
    };

    // speak the text
    synth.speak(speakText);
  }
};

//# # # # EVENT LISTENERS # # # # #

// play button
playBtn.addEventListener("click", () => {
  speak(textInput.value);
  console.log("play button clicked");
});

//pause Button
pauseBtn.addEventListener("click", () => {
  if (synth.speaking) {
    synth.pause();
  }
});

//stop button
stopBtn.addEventListener("click", () => {
  if (synth.speaking) {
    synth.cancel();
    textInput.disabled = false;
  }
});

// speed Slider
speedInput.addEventListener("input", () => {
  speedValue.textContent = speedInput.value;
  synth.cancel();
  speak(textInput.value.substr(currentCharector));
});

// pitch Slider
pitchInput.addEventListener("input", () => {
  pitchValue.textContent = pitchInput.value;
  synth.cancel();
  speak(textInput.value.substr(currentCharector));
});

//voice selected
voiceInput.addEventListener("change", () => speak(textInput.value));
