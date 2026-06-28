/* ciaobricks landing — interactions
 * - Animated brick mosaic rendered on the phone screen (no image assets needed)
 * - Tap the screen to rebuild with a fresh palette
 * - Lightweight waitlist form handler (front-end only; wire up a real
 *   endpoint in index.html when you have one)
 */
(function () {
  "use strict";

  // ── Mosaic on the phone screen ───────────────────────────────
  var canvas = document.getElementById("mosaic");
  var ctx = canvas && canvas.getContext("2d");

  // A few friendly brick palettes to cycle through on tap.
  var PALETTES = [
    ["#ff5a3c", "#ffb13c", "#ffd97d", "#fef6e4", "#1b1b1f"], // sunset
    ["#4f8cff", "#7bb0ff", "#bcd6ff", "#eaf2ff", "#0d2b54"], // sky
    ["#2ec4a6", "#7ad9bf", "#c8f0e3", "#0f3d34", "#fef6e4"], // mint
    ["#c44fff", "#ff7be0", "#ffc0f0", "#3a1147", "#fef6e4"]  // berry
  ];

  var COLS = 22;          // bricks across
  var paletteIndex = 0;

  // Build a smooth, photo-like field so the mosaic reads as "an image",
  // then snap each cell to the nearest palette colour.
  function fieldValue(x, y, seed) {
    return (
      Math.sin((x + seed) * 0.55) +
      Math.cos((y - seed) * 0.45) +
      Math.sin((x + y) * 0.3 + seed)
    );
  }

  function pickColor(palette, v) {
    var t = (v + 3) / 6; // normalise roughly to 0..1
    t = Math.max(0, Math.min(0.999, t));
    return palette[Math.floor(t * palette.length)];
  }

  function buildGrid(seed) {
    var rows = Math.round(COLS * (canvas.height / canvas.width));
    var palette = PALETTES[paletteIndex];
    var cells = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < COLS; c++) {
        cells.push({
          c: c,
          r: r,
          color: pickColor(palette, fieldValue(c, r, seed)),
          delay: Math.random() // for the staggered "build" reveal
        });
      }
    }
    // Reveal centre-out for a satisfying assembly.
    var cx = COLS / 2, cy = rows / 2;
    cells.forEach(function (cell) {
      var d = Math.hypot(cell.c - cx, cell.r - cy);
      cell.delay = d / Math.hypot(cx, cy) + Math.random() * 0.15;
    });
    return { cells: cells, rows: rows };
  }

  var current = null;
  var animStart = 0;
  var DURATION = 1100; // ms

  function render(now) {
    if (!current) return;
    var elapsed = now - animStart;
    var progress = Math.min(1, elapsed / DURATION);

    var w = canvas.width, h = canvas.height;
    var size = w / COLS;
    var pad = size * 0.08;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#1b1b1f";
    ctx.fillRect(0, 0, w, h);

    current.cells.forEach(function (cell) {
      var local = (progress - cell.delay) / 0.25;
      if (local <= 0) return;
      var a = Math.min(1, local);
      var scale = 0.5 + 0.5 * a;

      var x = cell.c * size + size / 2;
      var y = cell.r * size + size / 2;
      var s = (size - pad) * scale;

      ctx.globalAlpha = a;
      roundRect(ctx, x - s / 2, y - s / 2, s, s, s * 0.22);
      ctx.fillStyle = cell.color;
      ctx.fill();

      // tiny stud highlight = "brick"
      ctx.globalAlpha = a * 0.18;
      ctx.beginPath();
      ctx.arc(x, y - s * 0.12, s * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (progress < 1) requestAnimationFrame(render);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function rebuild() {
    if (!ctx) return;
    current = buildGrid(Math.random() * 100);
    animStart = performance.now();
    requestAnimationFrame(render);
  }

  if (ctx) {
    rebuild();
    canvas.addEventListener("click", function () {
      paletteIndex = (paletteIndex + 1) % PALETTES.length;
      rebuild();
    });
  }

  // ── Waitlist form ────────────────────────────────────────────
  function onWaitlistSubmit(event) {
    var form = event.target;
    var action = form.getAttribute("action");

    // If no real endpoint is wired up yet, just acknowledge locally.
    if (!action || action === "#") {
      event.preventDefault();
      var note = document.getElementById("form-note");
      if (note) {
        note.hidden = false;
        note.textContent = "Thanks! You're on the list — we'll be in touch. ✨";
      }
      form.reset();
      return false;
    }
    // Otherwise let the form POST to its configured endpoint.
    return true;
  }

  // ── Footer year ──────────────────────────────────────────────
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Expose handler for the inline onsubmit.
  window.ciaobricks = { onWaitlistSubmit: onWaitlistSubmit };
})();
