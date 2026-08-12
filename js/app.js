const menuBtn = document.querySelector("#menuBtn");
const app = document.querySelector(".app");
const closeBtn = document.querySelector(".sidebar-close");

menuBtn.addEventListener("click", (e) => {
  app.classList.add("nav-open");
});

closeBtn.addEventListener("click", (e) => {
  app.classList.remove("nav-open");
});
