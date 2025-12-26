// v7: gift icon matches iOS-ish + explosions on ALL buttons + bigger finale bang
const CONFIG = {
  video1: { id: "c53lhh", lengthSeconds: 8.0 },
  video2: { id: "uwkejn", lengthSeconds: 15.04 },
};

// Elements
const start = document.getElementById("start");
const loader = document.getElementById("loader");
const player = document.getElementById("player");
const frame = document.getElementById("frame");
const which = document.getElementById("which");

const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const end = document.getElementById("end");
const finale = document.getElementById("finale");
const closed = document.getElementById("closed");

const particles = document.getElementById("particles");
const flash = document.getElementById("flash");

const giftIcon = document.getElementById("giftIcon");
const openBtn = document.getElementById("openGift");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let timers = [];

function clearTimers() { timers.forEach((t) => clearTimeout(t)); timers = []; }

function setVideo(id) { frame.src = `https://streamable.com/e/${id}?autoplay=1&hd=1`; }
function stopVideo() { frame.src = ""; }

function requestFs() {
  const rfs = player.requestFullscreen || player.webkitRequestFullscreen || player.msRequestFullscreen;
  if (rfs) { try { rfs.call(player); } catch (e) {} }
}

function showPlayer() {
  start.style.display = "none";
  player.classList.add("show");
  player.setAttribute("aria-hidden", "false");
}

function showAfterPart1Modal() {
  overlay.classList.add("show");
  modal.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  modal.setAttribute("aria-hidden", "false");

  // Make it obvious
  doFlash();
  burstAtViewportCenter(["✨","💛","✨"], 48, 230, 1700);
}

function hideAfterPart1Modal() {
  overlay.classList.remove("show");
  modal.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-hidden", "true");
}

function showFinale() {
  finale.classList.add("show");
  finale.setAttribute("aria-hidden", "false");
  doFlash();
  burstAtViewportCenter(["🎄","✨","💛"], 52, 260, 1800);
}
function hideFinale() {
  finale.classList.remove("show");
  finale.setAttribute("aria-hidden", "true");
}

function showClosed() {
  closed.classList.add("show");
  closed.setAttribute("aria-hidden", "false");
}
function hideClosed() {
  closed.classList.remove("show");
  closed.setAttribute("aria-hidden", "true");
}

function playPart1() {
  clearTimers();
  hideAfterPart1Modal();
  hideFinale();
  hideClosed();
  end.classList.remove("show");
  end.setAttribute("aria-hidden", "true");

  which.textContent = "Deel 1";
  setVideo(CONFIG.video1.id);
  showPlayer();
  timers.push(setTimeout(showAfterPart1Modal, CONFIG.video1.lengthSeconds * 1000));
}

function playPart2() {
  clearTimers();
  hideAfterPart1Modal();
  hideFinale();
  hideClosed();
  end.classList.remove("show");
  end.setAttribute("aria-hidden", "true");

  which.textContent = "Deel 2";
  setVideo(CONFIG.video2.id);

  timers.push(setTimeout(() => {
    end.classList.add("show");
    end.setAttribute("aria-hidden", "false");
    doFlash();
    burstAtViewportCenter(["💛","✨","💖"], 46, 240, 1700);
  }, CONFIG.video2.lengthSeconds * 1000));
}

function returnToStart() {
  clearTimers();
  hideAfterPart1Modal();
  hideFinale();
  hideClosed();

  end.classList.remove("show");
  end.setAttribute("aria-hidden", "true");

  player.classList.remove("show");
  player.setAttribute("aria-hidden", "true");
  stopVideo();

  start.style.display = "grid";
  giftIcon.classList.remove("pop");
}

// FX helpers
function doFlash() {
  flash.classList.remove("show");
  // force reflow so animation restarts
  void flash.offsetWidth;
  flash.classList.add("show");
  setTimeout(() => flash.classList.remove("show"), 900);
}

function burstAt(x0, y0, emojiList, count = 40, spread = 240, durationMs = 1700) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "particle";
    el.textContent = emojiList[i % emojiList.length];

    const angle = Math.random() * Math.PI * 2;
    const radius = (Math.random() * 0.65 + 0.35) * spread;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius - (Math.random() * 130);

    const rot = (Math.random() * 260 - 130).toFixed(0) + "deg";
    const size = (Math.random() * 14 + 18).toFixed(0) + "px";

    el.style.setProperty("--x", x0 + "px");
    el.style.setProperty("--y", y0 + "px");
    el.style.setProperty("--dx", dx.toFixed(1) + "px");
    el.style.setProperty("--dy", dy.toFixed(1) + "px");
    el.style.setProperty("--rot", rot);
    el.style.fontSize = size;

    const delay = Math.random() * 120;
    el.style.animation = `burst ${durationMs}ms ease-out ${delay}ms forwards`;

    particles.appendChild(el);
    setTimeout(() => el.remove(), durationMs + delay + 250);
  }
}

function burstAtViewportCenter(emojiList, count, spread, durationMs) {
  burstAt(window.innerWidth / 2, window.innerHeight / 2, emojiList, count, spread, durationMs);
}

function burstFromEvent(ev, emojiList, count = 36, spread = 200, durationMs = 1600) {
  const x = ev.clientX ?? (ev.touches && ev.touches[0]?.clientX) ?? window.innerWidth/2;
  const y = ev.clientY ?? (ev.touches && ev.touches[0]?.clientY) ?? window.innerHeight/2;
  burstAt(x, y, emojiList, count, spread, durationMs);
  doFlash();
}

function loveExplosionBig() {
  // 3 big waves => impossible to miss
  doFlash();
  burstAt(window.innerWidth/2, window.innerHeight*0.74, ["💛","💖","💞","✨","💥"], 95, 380, 2600);
  setTimeout(() => burstAt(window.innerWidth/2, window.innerHeight*0.74, ["💛","✨","💖","💞"], 80, 340, 2400), 240);
  setTimeout(() => burstAt(window.innerWidth/2, window.innerHeight*0.74, ["✨","💛","💥"], 70, 300, 2200), 540);
}

// Gift easter egg: pop + burst from gift center
function giftEasterEgg() {
  giftIcon.classList.add("pop");
  setTimeout(() => giftIcon.classList.remove("pop"), 600);

  const r = giftIcon.getBoundingClientRect();
  const x0 = r.left + r.width / 2;
  const y0 = r.top + r.height / 2;
  burstAt(x0, y0, ["🎁","✨","💛","🎄"], 52, 260, 1900);
  doFlash();
}

// Small "click bursts" on buttons (so it feels alive)
function attachBurst(button, emojiList) {
  if (!button) return;
  button.addEventListener("pointerdown", (ev) => burstFromEvent(ev, emojiList, 34, 190, 1500), { passive: true });
}

// Attach bursts to all key buttons
attachBurst(openBtn, ["🎁","✨","💛"]);
attachBurst(document.getElementById("replay1"), ["✨","✨","💛"]);
attachBurst(document.getElementById("play2"), ["🎁","💛","✨"]);
attachBurst(document.getElementById("again"), ["✨","💛","🎁"]);
attachBurst(document.getElementById("closeEnd"), ["💥","💛","💖","✨"]);
attachBurst(document.getElementById("finalRestart"), ["🎁","✨","💛"]);
attachBurst(document.getElementById("finalClose"), ["💥","💛","✨"]);
attachBurst(document.getElementById("closedBack"), ["✨","💛"]);
attachBurst(document.getElementById("closedTryClose"), ["✨","💛","💥"]);
attachBurst(document.getElementById("fsBtn"), ["✨","💛"]);

// Events
openBtn.addEventListener("click", async () => {
  giftEasterEgg();
  loader.classList.add("show");
  loader.setAttribute("aria-hidden", "false");
  await sleep(1050);
  loader.classList.remove("show");
  loader.setAttribute("aria-hidden", "true");

  playPart1();
  requestFs();
});

document.getElementById("replay1").addEventListener("click", () => {
  doFlash();
  burstAtViewportCenter(["✨","💛"], 30, 220, 1600);
  playPart1();
});

document.getElementById("play2").addEventListener("click", () => {
  doFlash();
  burstAtViewportCenter(["🎁","💛","✨"], 42, 240, 1700);
  playPart2();
});

document.getElementById("again").addEventListener("click", () => {
  doFlash();
  burstAtViewportCenter(["✨","💛","🎁"], 42, 260, 1800);
  setTimeout(returnToStart, 850);
});

document.getElementById("closeEnd").addEventListener("click", () => {
  // Strong love-bomb and keep it long enough
  loveExplosionBig();

  end.style.transition = "opacity 260ms ease";
  end.style.opacity = "0.08";

  // WAIT longer so it feels like a real finale
  setTimeout(() => {
    end.style.opacity = "";
    end.style.transition = "";
    end.classList.remove("show");
    end.setAttribute("aria-hidden", "true");
    showFinale();
  }, 2100);
});

document.getElementById("finalRestart").addEventListener("click", () => {
  doFlash();
  burstAtViewportCenter(["🎁","✨","💛"], 50, 280, 1900);
  setTimeout(returnToStart, 950);
});

document.getElementById("finalClose").addEventListener("click", () => {
  loveExplosionBig();
  setTimeout(() => {
    hideFinale();
    showClosed();
  }, 1200);
});

document.getElementById("closedBack").addEventListener("click", () => {
  doFlash();
  burstAtViewportCenter(["✨","💛"], 34, 220, 1600);
  setTimeout(returnToStart, 750);
});

document.getElementById("closedTryClose").addEventListener("click", () => {
  loveExplosionBig();
  setTimeout(() => { try { window.close(); } catch (e) {} }, 250);
});

document.getElementById("fsBtn").addEventListener("click", requestFs);
