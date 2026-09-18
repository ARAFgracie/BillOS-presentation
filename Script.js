const deck = document.getElementById("deck");
const slides = [...document.querySelectorAll(".slide")];

const bar = document.getElementById("progressBar");
const slideNo = document.getElementById("slideNo");
const slideName = document.getElementById("slideName");
const currentDot = document.getElementById("currentDot");
const toast = document.getElementById("toast");

let current = 0;
let wheelLock = false;

/* =========================================
SLIDE MENU
========================================= */

const links = document.getElementById("slideLinks");

links.innerHTML = slides
.map(
(slide, index) => "<button class="drawer-link" data-index="${index}"> <b>${String(index + 1).padStart(2, "0")}</b> ${slide.dataset.name} </button>"
)
.join("");

/* =========================================
GO TO SLIDE
========================================= */

function goTo(index) {
index = Math.max(0, Math.min(slides.length - 1, index));

slides[index].scrollIntoView({
behavior: "smooth",
block: "start"
});

current = index;
updateUI();

document.getElementById("drawer").classList.remove("open");
}

/* =========================================
UPDATE UI
========================================= */

function updateUI() {
const slide = slides[current];

const number = String(current + 1).padStart(2, "0");

slideNo.textContent = number;
currentDot.textContent = number;
slideName.textContent = slide.dataset.name;

const progress =
slides.length > 1
? (current / (slides.length - 1)) * 100
: 0;

bar.style.width = progress + "%";

document.querySelectorAll(".drawer-link").forEach((link, index) => {
link.classList.toggle("active", index === current);
});
}

/* =========================================
NEXT / PREVIOUS
========================================= */

function next() {
goTo(current + 1);
}

function prev() {
goTo(current - 1);
}

/* =========================================
NAVIGATION BUTTONS
========================================= */

document.getElementById("next").addEventListener("click", next);
document.getElementById("prev").addEventListener("click", prev);

/* =========================================
NEXT BUTTONS
========================================= */

document.querySelectorAll("[data-next]").forEach((button) => {
button.addEventListener("click", next);
});

/* =========================================
JUMP BUTTONS
========================================= */

document.querySelectorAll("[data-jump]").forEach((button) => {
button.addEventListener("click", () => {
const targetId = button.dataset.jump;

const targetIndex = slides.findIndex(
  (slide) => slide.id === targetId
);

if (targetIndex !== -1) {
  goTo(targetIndex);
}

});
});

/* =========================================
DRAWER LINKS
========================================= */

document.querySelectorAll(".drawer-link").forEach((button) => {
button.addEventListener("click", () => {
goTo(Number(button.dataset.index));
});
});

/* =========================================
MENU OPEN / CLOSE
========================================= */

const drawer = document.getElementById("drawer");
const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");

menuBtn.addEventListener("click", () => {
drawer.classList.add("open");
});

closeMenu.addEventListener("click", () => {
drawer.classList.remove("open");
});

/* =========================================
KEYBOARD NAVIGATION
========================================= */

document.addEventListener("keydown", (event) => {

/* Next */
if (
event.key === "ArrowDown" ||
event.key === "PageDown" ||
event.key === " "
) {
event.preventDefault();
next();
}

/* Previous */
if (
event.key === "ArrowUp" ||
event.key === "PageUp"
) {
event.preventDefault();
prev();
}

/* First slide */
if (event.key === "Home") {
event.preventDefault();
goTo(0);
}

/* Last slide */
if (event.key === "End") {
event.preventDefault();
goTo(slides.length - 1);
}

/* Close drawer */
if (event.key === "Escape") {
drawer.classList.remove("open");
}
});

/* =========================================
MOUSE WHEEL NAVIGATION
========================================= */

deck.addEventListener(
"wheel",
(event) => {

if (wheelLock) return;

event.preventDefault();

wheelLock = true;

if (event.deltaY > 0) {
  next();
} else if (event.deltaY < 0) {
  prev();
}

setTimeout(() => {
  wheelLock = false;
}, 650);

},
{ passive: false }
);

/* =========================================
TOUCH / SWIPE NAVIGATION
========================================= */

let touchStartY = 0;

deck.addEventListener(
"touchstart",
(event) => {
touchStartY = event.touches[0].clientY;
},
{ passive: true }
);

deck.addEventListener(
"touchend",
(event) => {

const touchEndY = event.changedTouches[0].clientY;

const difference = touchStartY - touchEndY;

/* Ignore very small movements */
if (Math.abs(difference) < 45) return;

if (difference > 0) {
  next();
} else {
  prev();
}

},
{ passive: true }
);

/* =========================================
ACTIVE SLIDE DETECTION
========================================= */

const observer = new IntersectionObserver(
(entries) => {

entries.forEach((entry) => {

  if (entry.isIntersecting) {

    const index = slides.indexOf(entry.target);

    if (index !== -1) {
      current = index;
      updateUI();
    }
  }
});

},
{
root: deck,
threshold: 0.6
}
);

slides.forEach((slide) => {
observer.observe(slide);
});

/* =========================================
POS DEMO CHECKOUT
========================================= */

const mockCheckout = document.getElementById("mockCheckout");

if (mockCheckout) {

mockCheckout.addEventListener("click", () => {

toast.textContent = "Demo: checkout flow ready";

toast.classList.add("show");

setTimeout(() => {
  toast.classList.remove("show");
}, 1800);

});

}

/* =========================================
PRINT / SAVE AS PDF
========================================= */

const printBtn = document.getElementById("printBtn");

if (printBtn) {

printBtn.addEventListener("click", () => {
window.print();
});

}

/* =========================================
INITIALIZE
========================================= */

updateUI();
