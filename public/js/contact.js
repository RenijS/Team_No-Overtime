const smsBtn = document.querySelector(".smsBtn");
const addBtn = document.querySelector(".addBtn");
const viewBtn = document.querySelector(".viewBtn");
const addSection = document.querySelector(".addSection");
const smsSection = document.querySelector(".smsSection");
const viewSection = document.querySelector(".viewSection");
const msgContainer = document.querySelector(".msgContainer");

let statusType = msgContainer.dataset.status;

msgStatus(statusType);

//text color changer according to msg type
function msgStatus(statusType) {
  if (statusType == "error") {
    msgContainer.classList.add("error");
  }
}

smsBtn.addEventListener("click", () => {
  if (!smsBtn.classList.contains("active")) {
    smsBtn.classList.add("active");
    addBtn.classList.remove("active");
    viewBtn.classList.remove("active");

    smsSection.classList.remove("displayGone");
    addSection.classList.add("displayGone");
    viewSection.classList.add("displayGone");
  }
});

addBtn.addEventListener("click", () => {
  if (!addBtn.classList.contains("active")) {
    addBtn.classList.add("active");
    smsBtn.classList.remove("active");
    viewBtn.classList.remove("active");

    addSection.classList.remove("displayGone");
    viewSection.classList.add("displayGone");
    smsSection.classList.add("displayGone");
  }
});

viewBtn.addEventListener("click", () => {
  if (!viewBtn.classList.contains("active")) {
    viewBtn.classList.add("active");
    smsBtn.classList.remove("active");
    addBtn.classList.remove("active");

    viewSection.classList.remove("displayGone");
    addSection.classList.add("displayGone");
    smsSection.classList.add("displayGone");
  }
});
