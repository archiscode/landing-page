"use strict";

/* ---------- Hero demo: a messy folder that tidies itself ---------- */
const FILES = [
  { name: "report.pdf", kind: "Documents" },
  { name: "holiday.jpg", kind: "Images" },
  { name: "budget.csv", kind: "Spreadsheets" },
  { name: "scraper.py", kind: "Code" },
  { name: "notes.txt", kind: "Documents" },
  { name: "logo.png", kind: "Images" },
  { name: "sales.xlsx", kind: "Spreadsheets" },
  { name: "app.js", kind: "Code" },
];
const KINDS = ["Documents", "Images", "Spreadsheets", "Code"];

const pile = document.getElementById("pile");
const binsBox = document.getElementById("bins");
const tidyBtn = document.getElementById("tidy-btn");
const demoStatus = document.getElementById("demo-status");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let tidy = false;
const chips = FILES.map((file) => {
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = file.name;
  chip.dataset.kind = file.kind;
  return chip;
});
const bins = {};
KINDS.forEach((kind) => {
  const bin = document.createElement("div");
  bin.className = "bin";
  const title = document.createElement("span");
  title.className = "bin-title";
  title.textContent = kind;
  bin.appendChild(title);
  binsBox.appendChild(bin);
  bins[kind] = bin;
});
chips.forEach((chip) => pile.appendChild(chip));

function moveChips(toTidy) {
  // FLIP animation: measure, move in the DOM, then animate from the old position.
  const before = chips.map((chip) => chip.getBoundingClientRect());
  chips.forEach((chip) => (toTidy ? bins[chip.dataset.kind] : pile).appendChild(chip));
  if (reduceMotion) return;
  chips.forEach((chip, i) => {
    const after = chip.getBoundingClientRect();
    const dx = before[i].left - after.left;
    const dy = before[i].top - after.top;
    chip.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }],
      { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)", delay: i * 30, fill: "backwards" }
    );
  });
}

tidyBtn.addEventListener("click", () => {
  tidy = !tidy;
  moveChips(tidy);
  tidyBtn.textContent = tidy ? "Make a mess" : "Tidy up";
  tidyBtn.setAttribute("aria-pressed", String(tidy));
  demoStatus.textContent = tidy ? "8 files sorted into 4 folders." : "8 files, no order.";
});

/* ---------- Contact form: validation, then opens the visitor's email app ---------- */
const CONTACT_EMAIL = "your.email@example.com"; // TODO: replace with your real address

const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const rules = {
  name: (v) => (v.trim().length < 2 ? "Please enter your name." : ""),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address."),
  message: (v) => (v.trim().length < 10 ? "Please write at least 10 characters about your task." : ""),
};

function validateField(id) {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}-error`);
  const message = rules[id](input.value);
  error.textContent = message;
  error.hidden = !message;
  input.setAttribute("aria-invalid", String(Boolean(message)));
  if (message) input.setAttribute("aria-describedby", error.id);
  else input.removeAttribute("aria-describedby");
  return !message;
}

Object.keys(rules).forEach((id) => {
  document.getElementById(id).addEventListener("blur", () => validateField(id));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const results = Object.keys(rules).map(validateField);
  if (results.includes(false)) {
    formStatus.textContent = "Please fix the highlighted fields.";
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  const data = new FormData(form);
  const subject = encodeURIComponent(`Project enquiry from ${data.get("name")}`);
  const body = encodeURIComponent(`${data.get("message")}\n\nFrom: ${data.get("name")} (${data.get("email")})`);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  formStatus.textContent = "Thank you. Your email app should open with the message ready to send.";
});

document.getElementById("year").textContent = new Date().getFullYear();
