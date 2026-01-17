\// ===============================
// 複素数ユーティリティ
// ===============================
function complex(re, im) {
  return { re, im };
}

function add(a, b) {
  return complex(a.re + b.re, a.im + b.im);
}

function mulI(z) {
  // z * i
  return complex(-z.im, z.re);
}

// ===============================
// ゲーム状態
// ===============================

// 入力 w と出力 z = f(w)（今は恒等関数）
let w = complex(0, 0);
let z = complex(0, 0);

// ターゲット
let targetW = complex(0, 0);
let targetZ = complex(0, 0);

// ===============================
// DOM
// ===============================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const planeSelect = document.getElementById("plane");

// ===============================
// 描画
// ===============================
function getCoords(plane, w, z) {
  switch (plane) {
    case "RxRy": return [w.re, z.re];
    case "RxIy": return [w.re, z.im];
    case "IxRy": return [w.im, z.re];
    case "IxIy": return [w.im, z.im];
    case "RyIy": return [z.re, z.im];
    case "RxIx": return [w.re, w.im];
  }
}

function draw() {
  ctx.clearRect(0, 0, 400, 400);

  // 軸
  ctx.beginPath();
  ctx.moveTo(200, 0);
  ctx.lineTo(200, 400);
  ctx.moveTo(0, 200);
  ctx.lineTo(400, 200);
  ctx.stroke();

  const plane = planeSelect.value;

  // 現在点
  let [x, y] = getCoords(plane, w, z);
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(200 + x * 40, 200 - y * 40, 5, 0, Math.PI * 2);
  ctx.fill();

  // 目標点
  let [tx, ty] = getCoords(plane, targetW, targetZ);
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(200 + tx * 40, 200 - ty * 40, 5, 0, Math.PI * 2);
  ctx.fill();

  document.getElementById("info").textContent =
    `w = ${w.re} + ${w.im}i , z = ${z.re} + ${z.im}i`;

  // クリア判定（4成分すべて一致）
  const clear =
    w.re === targetW.re &&
    w.im === targetW.im &&
    z.re === targetZ.re &&
    z.im === targetZ.im;

  document.getElementById("result").textContent =
    clear ? "🎉 完全一致！" : "";
}

// ===============================
// 操作
// ===============================
function move(dx, di) {
  w = add(w, complex(dx, di));
  z = add(z, complex(dx, di)); // 今は恒等
  draw();
}

function rotate() {
  w = mulI(w);
  z = mulI(z);
  draw();
}

// ===============================
// ランダム問題
// ===============================
function rand() {
  return Math.floor(Math.random() * 5) - 2;
}

function newProblem() {
  w = complex(0, 0);
  z = complex(0, 0);

  targetW = complex(rand(), rand());
  targetZ = complex(rand(), rand());

  document.getElementById("result").textContent = "";
  draw();
}

// ===============================
// イベント
// ===============================
document.getElementById("px").onclick = () => move(1, 0);
document.getElementById("mx").onclick = () => move(-1, 0);
document.getElementById("pi").onclick = () => move(0, 1);
document.getElementById("mi").onclick = () => move(0, -1);
document.getElementById("rot").onclick = rotate;
document.getElementById("new").onclick = newProblem;
planeSelect.onchange = draw;

// 初期化
newProblem();
