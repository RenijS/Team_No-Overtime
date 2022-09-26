const inputs = document.getElementsByTagName("input");
const btnField = document.querySelector(".button-field");

for (let input of inputs) {
  input.addEventListener("change", () => {
    btnField.classList.remove("displayGone");
  });
}
