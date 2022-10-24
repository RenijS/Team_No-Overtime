const voiceBtn = document.querySelector(".voiceBtn");

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const recognition = new SpeechRecognition();

voiceBtn.addEventListener("click", () => {
  recognition.start();
  voiceBtn.classList.add("voiceActivated");
  console.log("Ready to receive a command");
});

recognition.onresult = (event) => {
  const voiceInput = event.results[0][0].transcript;
  document.querySelector("#voiceTxt").value = voiceInput;
  console.log(`Confidence: ${event.results[0][0].confidence}`);
  if (voiceInput == "go to login") {
    window.location.href = "/login";
  } else if (voiceInput == "go to contact") {
    window.location.href = "/contact";
  } else if (
    voiceInput == "go to reminder" ||
    voiceInput == "go to remainder"
  ) {
    window.location.href = "/reminder";
  } else if (voiceInput == "go to profile") {
    window.location.href = "/profile";
  } else if (voiceInput == "refresh" || voiceInput == "go to main") {
    window.location.href = "/";
  } else if (
    voiceInput == "signout" ||
    voiceInput == "sign out" ||
    voiceInput == "sign-out"
  ) {
    window.location.href = "/signout";
  }
};

recognition.onspeechend = () => {
  recognition.stop();
  voiceBtn.classList.remove("voiceActivated");
  console.log("voice command stopped");
};

recognition.onerror = (event) => {
  console.log(event.error);
  voiceBtn.classList.remove("voiceActivated");
};
