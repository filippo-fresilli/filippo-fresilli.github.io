/* ciaobricks landing — interactions
 * - The phone shows a real subject getting "bricked" into a mosaic.
 *   The subject is drawn onto an offscreen canvas and sampled cell-by-cell,
 *   so it genuinely reads as photo -> mosaic (no image assets needed).
 * - Tap the screen to rebuild with a fresh subject + palette.
 * - Lightweight waitlist form handler (front-end only).
 */
(function () {
  "use strict";

  var canvas = document.getElementById("mosaic");
  var ctx = canvas && canvas.getContext("2d");

  // Recognisable subjects to cycle through (rendered as large glyphs,
  // then sampled into bricks). Each pairs with a backdrop tint.
  var SUBJECTS = [
    { glyph: "🐶", bg: "#fde9c8" },
    { glyph: "🌺", bg: "#ffe0ec" },
    { glyph: "🦊", bg: "#ffe7cf" },
    { glyph: "🏝️", bg: "#d6f1ff" },
    { glyph: "🐱", bg: "#efe6ff" },
    { glyph: "🍓", bg: "#ffe2e2" }
  ];

  var COLS = 26;                 // bricks across
  var subjectIndex = 0;
  var grid = null;
  var animStart = 0;
  var DURATION = 1000;           // ms

  // Offscreen canvas used to "photograph" the subject before bricking it.
  var src = document.createElement("canvas");
  var sctx = src.getContext("2d");

  function buildGrid() {
    var rows = Math.round(COLS * (canvas.height / canvas.width));
    var subj = SUBJECTS[subjectIndex];

    // 1) Draw the subject onto the offscreen canvas at grid resolution.
    src.width = COLS;
    src.height = rows;
    sctx.clearRect(0, 0, COLS, rows);
    sctx.fillStyle = subj.bg;
    sctx.fillRect(0, 0, COLS, rows);
    sctx.textAlign = "center";
    sctx.textBaseline = "middle";
    // Size the glyph to fill most of the frame.
    var fontPx = Math.min(COLS, rows) * 0.92;
    sctx.font = fontPx + "px serif";
    sctx.fillText(subj.glyph, COLS / 2, rows / 2 + rows * 0.02);

    // 2) Read it back and turn every cell into a brick.
    var data = sctx.getImageData(0, 0, COLS, rows).data;
    var cells = [];
    var cx = COLS / 2, cy = rows / 2;
    var maxD = Math.hypot(cx, cy);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < COLS; c++) {
        var i = (r * COLS + c) * 4;
        var color = "rgb(" + data[i] + "," + data[i + 1] + "," + data[i + 2] + ")";
        var d = Math.hypot(c - cx, r - cy);
        cells.push({
          c: c,
          r: r,
          color: color,
          delay: d / maxD + Math.random() * 0.12 // centre-out reveal
        });
      }
    }
    return { cells: cells, rows: rows };
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

  function render(now) {
    if (!grid) return;
    var progress = Math.min(1, (now - animStart) / DURATION);

    var w = canvas.width, h = canvas.height;
    var size = w / COLS;
    var pad = size * 0.1;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#1b1b1f";
    ctx.fillRect(0, 0, w, h);

    grid.cells.forEach(function (cell) {
      var local = (progress - cell.delay) / 0.25;
      if (local <= 0) return;
      var a = Math.min(1, local);
      var scale = 0.55 + 0.45 * a;

      var x = cell.c * size + size / 2;
      var y = cell.r * size + size / 2;
      var s = (size - pad) * scale;

      ctx.globalAlpha = a;
      roundRect(ctx, x - s / 2, y - s / 2, s, s, s * 0.24);
      ctx.fillStyle = cell.color;
      ctx.fill();

      // stud highlight = "brick"
      ctx.globalAlpha = a * 0.16;
      ctx.beginPath();
      ctx.arc(x, y - s * 0.13, s * 0.17, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (progress < 1) requestAnimationFrame(render);
  }

  function rebuild() {
    if (!ctx) return;
    grid = buildGrid();
    animStart = performance.now();
    requestAnimationFrame(render);
  }

  if (ctx) {
    rebuild();
    canvas.addEventListener("click", function () {
      subjectIndex = (subjectIndex + 1) % SUBJECTS.length;
      rebuild();
    });
  }

  // ── Waitlist form ────────────────────────────────────────────
  function onWaitlistSubmit(event) {
    var form = event.target;
    var action = form.getAttribute("action");
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
    return true;
  }

  // ── Footer year ──────────────────────────────────────────────
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  window.ciaobricks = { onWaitlistSubmit: onWaitlistSubmit };
})();
