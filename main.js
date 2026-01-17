// ===============================
// 複素数
// ===============================
function C(re, im) {
  return { re, im };
}

// y = x^2（実数係数）
function f(x) {
  return C(
    x.re * x.re - x.im * x.im,
    2 * x.re * x.im
  );
}

// ===============================
// 状態
// ===============================
let x = C(1, 1);   // 入力
let y = f(x);      // 出力
let plane = "reX-imX";

// ===============================
// DOM
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
    Math.floor(Math.random()*5)-2,
    Math.floor(Math.random()*5)-2
  );
  y = f(x);
  draw();
}

function setPlane(p) {
  plane = p;
  draw();
}

// ===============================
// 軸取得
// ===============================
function getAxis(axis) {
  switch (axis) {
    case "reX": return x.re;
    case "imX": return x.im;
    case "reY": return y.re;
    case "imY": return y.im;
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

function drawPoint() {
  const [ax, ay] = plane.split("-");

  const px = getAxis(ax);
  const py = getAxis(ay);

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(210 + px * 20, 210 - py * 20, 5, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, 420, 420);
  drawAxes();
  drawPoint();

  document.getElementById("input").textContent =
    `${x.re} + ${x.im}i`;
  document.getElementById("output").textContent =
    `${y.re} + ${y.im}i`;
}

// 初期描画
draw();

