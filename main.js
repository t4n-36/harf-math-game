// ===============================
// 複素数
// ===============================
function C(re, im) {
  return { re, im };
}

// y = x^2 の複素拡張
function f(z) {
  return C(
    z.re * z.re - z.im * z.im,
    2 * z.re * z.im
  );
}

// ===============================
// 状態
// ===============================
let x = C(0, 0);
let y = f(x);
let plane = "reX-reY";

let target = C(1, 1);

// ===============================
// Canvas
// ===============================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ===============================
// 操作
// ===============================
function moveX(dr, di) {
  x.re += dr;
  x.im += di;
  y = f(x);
  draw();
}

function randomX() {
  x = C(
    Math.floor(Math.random() * 5) - 2,
    Math.floor(Math.random() * 5) - 2
  );
  y = f(x);
  draw();
}

function setPlane(p) {
  plane = p;
  draw();
}

// ===============================
// 軸値計算
// ===============================
function axisVal(a, b, c, d, axis) {
  switch (axis) {
    case "reX": return a;
    case "imX": return b;
    case "reY": return c;
    case "imY": return d;
  }
}

// ===============================
// 描画
// ===============================
function drawAxes() {
  ctx.beginPath();
  ctx.moveTo(210, 0);
  ctx.lineTo(210, 420);
  ctx.moveTo(0, 210);
  ctx.lineTo(420, 210);
  ctx.stroke();
}

function drawCurve() {
  const [ax, ay] = plane.split("-");

  ctx.beginPath();

  // x の走査は -5..5
  for (let A = -5; A <= 5; A += 0.1) {
    for (let B = -5; B <= 5; B += 0.1) {
      const z = C(A, B);
      const w = f(z);

      const vx = axisVal(z.re, z.im, w.re, w.im, ax);
      const vy = axisVal(z.re, z.im, w.re, w.im, ay);

      const px = 210 + vx * 20;
      const py = 210 - vy * 20;

      if (A === -5 && B === -5) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
  }
  ctx.strokeStyle = "#444";
  ctx.stroke();
}

function drawPoint() {
  const [ax, ay] = plane.split("-");

  const vx = axisVal(x.re, x.im, y.re, y.im, ax);
  const vy = axisVal(x.re, x.im, y.re, y.im, ay);

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(210 + vx * 20, 210 - vy * 20, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawTarget() {
  const [ax, ay] = plane.split("-");

  const vx = axisVal(target.re, target.im, target.re, target.im, ax);
  const vy = axisVal(target.re, target.im, target.re, target.im, ay);

  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(210 + vx * 20, 210 - vy * 20, 5, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, 420, 420);
  drawAxes();
  drawCurve();
  drawPoint();
  drawTarget();

  document.getElementById("input").textContent =
    `${x.re} + ${x.im}i`;
  document.getElementById("output").textContent =
    `${y.re} + ${y.im}i`;
}

draw();
