const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

const msgContainer = document.querySelector(".msgContainer");

//message status type
let statusType = msgContainer.dataset.status;

msgStatus(statusType);

//text color changer according to msg type
function msgStatus(statusType) {
  if (statusType == "error") {
    msgContainer.classList.add("error");
  }
}

pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    let pwFields =
      eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwFields.forEach((password) => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bxs-hide", "bxs-show");
        return;
      }
      password.type = "password";
      eyeIcon.classList.replace("bxs-show", "bxs-hide");
    });
  });
});

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    forms.classList.toggle("show-signup");
  });
});
