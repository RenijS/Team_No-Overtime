const inputs = document.getElementsByTagName("input");
const btnField = document.querySelector(".button-field");

for (let input of inputs) {
  input.addEventListener("click", () => {
    btnField.classList.remove("displayGone");
  });
}
