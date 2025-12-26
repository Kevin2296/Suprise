// ====== CONFIG ======
const CONFIG = {
  toName: "Kiki",
  fromName: "Kevin",
  // Streamable IDs (je link: https://streamable.com/<id>)
  video1: { id: "c53lhh", lengthSeconds: 8.0 },     // jouw deel 1 is ± 8 sec
  video2: { id: "uwkejn", lengthSeconds: 15.04 }    // jouw deel 2 is ± 15,04 sec
};

// ====== ELEMENTS ======
const start = document.getElementById("start");
const env = document.getElementById("env");
const loader = document.getElementById("loader");
const player = document.getElementById("player");
const frame = document.getElementById("frame");
const banner = document.getElementById("banner");
const end = document.getElementById("end");
const which = document.getElementById("which");

document.getElementById("toName").textContent = CONFIG.toName;
document.getElementById("chipName").textContent = CONFIG.toName;
document.getElementById("endName").textContent = CONFIG.toName;
document.getElementById("fromName").textContent = CONFIG.fromName;

// ====== HELPERS ======
let timers = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function clearTimers() {
  timers.forEach((t) => clearTimeout(t));
  timers = [];
}

function setVideo(id) {
  frame.src = `https://streamable.com/e/${id}?autoplay=1&hd=1`;
}

function requestFs() {
  const el = document.getElementById("player");
  const rfs =
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.msRequestFullscreen;
  if (rfs) {
    try { rfs.call(el); } catch { /* ignore */ }
  }
}

function showPlayer() {
  start.style.display = "none";
  player.classList.add("show");
}

// ====== CONFETTI (subtiel wow-effect) ======
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d", { alpha: true });

function resizeCanvas() {
  canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
  canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas, { passive: true });
resizeCanvas();

function runConfetti(durationMs = 1200) {
  const pieces = [];
  const count = 110;
  const w = window.innerWidth, h = window.innerHeight;

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.6,
      r: 2 + Math.random() * 4,
      vx: -0.5 + Math.random() * 1.0,
      vy: 2.0 + Math.random() * 4.2,
      rot: Math.random() * Math.PI,
      vrot: (-0.08 + Math.random() * 0.16),
      a: 0.65 + Math.random() * 0.35
    });
  }

  canvas.classList.add("show");

  const startT = performance.now();
  function draw(t) {
    const elapsed = t - startT;
    ctx.clearRect(0, 0, w, h);

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      // geen vaste kleuren hardcoden; we gebruiken goud/wit variaties via alpha
      ctx.fillStyle = `rgba(255, 226, 178, ${p.a})`;
      ctx.fillRect(-p.r, -p.r, p.r * 2.2, p.r * 1.2);

      ctx.fillStyle = `rgba(255, 138, 31, ${p.a * 0.85})`;
      ctx.fillRect(-p.r * 0.7, -p.r * 0.4, p.r * 1.8, p.r * 0.9);

      ctx.restore();
    });

    if (elapsed < durationMs) {
      requestAnimationFrame(draw);
    } else {
      canvas.classList.remove("show");
      ctx.clearRect(0, 0, w, h);
    }
  }
  requestAnimationFrame(draw);
}

// ====== FLOW ======
function playPart1() {
  clearTimers();
  banner.classList.remove("show");
  end.classList.remove("show");
  which.textContent = "Deel 1";
  setVideo(CONFIG.video1.id);
  showPlayer();
  timers.push(setTimeout(() => banner.classList.add("show"), CONFIG.video1.lengthSeconds * 1000));
}

function playPart2() {
  clearTimers();
  banner.classList.remove("show");
  end.classList.remove("show");
  which.textContent = "Deel 2";
  setVideo(CONFIG.video2.id);
  timers.push(setTimeout(() => {
    end.classList.add("show");
    runConfetti(1400);
  }, CONFIG.video2.lengthSeconds * 1000));
}

// Open gift
document.getElementById("openGift").addEventListener("click", async () => {
  env.classList.add("opening");         // envelope open animation
  runConfetti(900);                    // kleine “wow”
  loader.classList.add("show");        // luxe “magie laden”
  await sleep(1050);
  loader.classList.remove("show");

  playPart1();
  requestFs(); // best effort
});

// Controls
document.getElementById("replay1").addEventListener("click", playPart1);
document.getElementById("play2").addEventListener("click", playPart2);
document.getElementById("again").addEventListener("click", () => location.reload());
document.getElementById("closeEnd").addEventListener("click", () => end.classList.remove("show"));
document.getElementById("fsBtn").addEventListener("click", requestFs);
