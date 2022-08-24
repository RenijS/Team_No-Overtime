const addSwitch = document.querySelector("#addSwitch");
const upcomingSwitch = document.querySelector("#upcomingSwitch");
const addSection = document.querySelector(".addSection");
const upcomingSection = document.querySelector(".upcomingSection");
const addBtn = document.querySelector("#addBtn");
const upcomingList = document.querySelector(".upcomingList");

const storage = [];
storage.push(createEvent("test1", "2022-08-09T14:45", "2022-08-09T14:45"));

function createEvent(title, startDate, endDate, notes) {
  return {
    title: title,
    startDate: startDate,
    endDate: endDate,
    notes: notes,
    getTitle() {
      return title;
    },
    getStartDate() {
      return startDate;
    },
    getEndDate() {
      return endDate;
    },
    getNotes() {
      return notes;
    },
  };
}

const loadReminder = () => {
  upcomingList.innerHTML = "";
  for (let event of storage) {
    let newLi = document.createElement("li");
    let newP = document.createElement("p");
    let newP2 = document.createElement("p");
    newP.textContent = `${event.getTitle()}`;
    newP2.textContent = `${event.getStartDate()} - ${event.getEndDate()}`;
    newLi.appendChild(newP);
    newLi.appendChild(newP2);
    upcomingList.appendChild(newLi);
  }
};

function inactiveBtn() {}

upcomingSwitch.addEventListener("click", (e) => {
  if (upcomingSection.classList.contains("displayGone")) {
    upcomingSection.classList.remove("displayGone");
    addSection.classList.add("displayGone");
    addSwitch.classList.remove("active");
    upcomingSwitch.classList.add("active");
    loadReminder();
  }
});

addSwitch.addEventListener("click", () => {
  if (addSection.classList.contains("displayGone")) {
    addSection.classList.remove("displayGone");
    upcomingSection.classList.add("displayGone");
    addSwitch.classList.add("active");
    upcomingSwitch.classList.remove("active");
  }
});

addBtn.addEventListener("click", () => {
  const title = document.querySelector("#title");
  const startTime = document.querySelector("#startTime");
  const endTime = document.querySelector("#endTime");
  const notes = document.querySelector("#notes");

  let event = createEvent(
    title.value,
    startTime.value,
    endTime.value,
    notes.value
  );
  console.dir("event: " + event);
  storage.push(event);
  console.log(storage);
});
