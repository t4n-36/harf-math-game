// ===============================
// 複素数ユーティリティ
// ===============================
function C(re, im) {
  return { re, im };
}

function add(a, b) {
  return C(a.re + b.re, a.im + b.im);
}

function mul(a, b) {
  return C(
    a.re * b.re - a.im * b.im,
    a.re * b.im + a.im * b.re
  );
}

// ===============================
// 状態
// ===============================
let A, B;        // f(z) = A z + B
let target;      // 複素数ターゲット
let plane = "reX-reY";

// ===============================
// Canvas
// ===============================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ===============================
// 問題生成
// ===============================
function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newProblem() {
  A = C(rnd(-2, 2), rnd(-2, 2));
  B = C(rnd(-3, 3), rnd(-3, 3));
  target = C(rnd(-4, 4), rnd(-4, 4));
  draw();
}

// ===============================
// 操作
// ===============================
function addRe() {
  B.re += 1;
  draw();
}

function addIm() {
  B.im += 1;
  draw();
}

function rotate() {
  A = mul(A, C(0, 1));
  B = mul(B, C(0, 1));
  draw();
}

function setPlane(p) {
  plane = p;
  draw();
}

// ===============================
// 数学
// ===============================
function f(x) {
  return add(mul(A, C(x, 0)), B);
}

// 4軸の意味付け
// reX : 入力 x の実部
// imX : 入力 x の虚部（今回は 0）
// reY : 出力の実部
// imY : 出力の虚部
function axisValue(x, z, axis) {
  switch (axis) {
    case "reX": return x;
    case "imX": return 0;
    case "reY": return z.re;
    case "imY": return z.im;
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

function drawGraph() {
  const [ax, ay] = plane.split("-");

  ctx.beginPath();
  for (let px = -210; px <= 210; px++) {
    const x = px / 20;
    const z = f(x);

    const vx = axisValue(x, z, ax);
    const vy = axisValue(x, z, ay);

    const cx = 210 + vx * 20;
    const cy = 210 - vy * 20;

    if (px === -210) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();
}

function drawTarget() {
  const [ax, ay] = plane.split("-");

  const tx = axisValue(target.re, target, ax);
  const ty = axisValue(target.re, target, ay);

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(210 + tx * 20, 210 - ty * 20, 5, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, 420, 420);
  drawAxes();
  drawGraph();
  drawTarget();

  document.getElementById("formula").textContent =
    `f(z)=(${A.re}+${A.im}i)z+(${B.re}+${B.im}i)`;

  document.getElementById("target").textContent =
    `(${target.re}, ${target.im})`;

  document.getElementById("result").textContent = "";
}

// ===============================
// 初期化
// ===============================
newProblem();
