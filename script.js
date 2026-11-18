"use strict";

const startsAt = Date.parse(document.querySelector("#event-start").dateTime);
const timer = document.querySelector("#timer");
const digits = ["days", "hours", "minutes", "seconds"].map((id) =>
  document.getElementById(id)
);
const motionAllowed = window.matchMedia("(prefers-reduced-motion: no-preference)");
let tickTimeout;

// Use the absolute UTC+5 instant so guests see the same countdown in any timezone.
function updateTimer(animate = true) {
  window.clearTimeout(tickTimeout);

  const remainingMs = Math.max(0, startsAt - Date.now());
  const secondsLeft = Math.ceil(remainingMs / 1000);
  const values = [
    Math.floor(secondsLeft / 86400),
    Math.floor((secondsLeft % 86400) / 3600),
    Math.floor((secondsLeft % 3600) / 60),
    secondsLeft % 60,
  ];

  digits.forEach((element, index) => {
    const value = String(values[index]).padStart(2, "0");
    if (value === element.textContent) return;

    element.textContent = value;
    if (animate && motionAllowed.matches) {
      element.classList.remove("is-updated");
      window.requestAnimationFrame(() => element.classList.add("is-updated"));
    }
  });

  if (remainingMs > 0) {
    // Schedule the next change on a whole-second boundary to avoid drift.
    tickTimeout = window.setTimeout(updateTimer, remainingMs % 1000 || 1000);
  }
}

updateTimer(false);
timer.hidden = false;
timer.addEventListener("animationend", (event) => {
  if (event.animationName === "tick") event.target.classList.remove("is-updated");
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateTimer(false);
});

// Trigger each reveal once. Pause the heart until the calendar enters the viewport.
if ("IntersectionObserver" in window && motionAllowed.matches) {
  const calendar = document.querySelector(".calendar");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const section = entry.target;
      section.classList.add("revealing");
      if (section === calendar) {
        section.classList.remove("waiting");
        section.classList.add("draw-heart");
      }
      observer.unobserve(section);
    });
  }, { threshold: 0.16 });

  calendar.classList.add("waiting");
  document.querySelectorAll("[data-reveal]").forEach((section) => observer.observe(section));
}
const music = document.getElementById("music");
const musicButton = document.getElementById("music-button");

function playMusic() {
  music.play().catch(() => {
    musicButton.textContent = "Әуенді қосу";
  });
}

music.addEventListener("playing", () => {
  musicButton.textContent = "Әуенді өшіру";
});

music.addEventListener("pause", () => {
  musicButton.textContent = "Әуенді қосу";
});

music.addEventListener("ended", () => {
  musicButton.textContent = "Әуенді қосу";
});

musicButton.addEventListener("click", () => {
  if (music.paused) {
    playMusic();
  } else {
    music.pause();
  }
});

musicButton.hidden = false;
playMusic();

