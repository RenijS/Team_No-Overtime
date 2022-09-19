const pgCookie = document.cookie;
const loginBtn = document.querySelector(".loginBtn");
const signoutBtn = document.querySelector(".signoutBtn");

function cookieChecker(pgCookie) {
  if (pgCookie.length > 0) {
    loginBtn.classList.add("displayGone");
    signoutBtn.classList.remove("displayGone");
  }
}

cookieChecker(pgCookie);
