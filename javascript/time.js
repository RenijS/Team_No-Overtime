function refreshTime() {
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: "numeric"};
    const timeDisplay = document.getElementById("time");
    const dateString = new Date().toLocaleDateString(undefined, options);
    timeDisplay.textContent = dateString;
  }
    setInterval(refreshTime, 1000);