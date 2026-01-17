// ===============================
// 分数ユーティリティ
// ===============================
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function frac(n, d = 1) {
  if (d < 0) n = -n, d = -d;
  const g = gcd(Math.abs(n), d);
  return { num: n / g, den: d / g };
}

function addFrac(a, b) {
  return frac(
    a.num * b.den + b.num * a.den,
    a.den * b.den
  );
}

function fracToNumber(f) {
  return f.num / f.den;
}

// ===============================
// 分数HTML（縦表示）
// ===============================
function fracToHTML(c) {
  if (c.den === 1) return `${c.num}`;
  return `
  <span style="display:inline-flex;flex-direction:column;align-items:center;">
    <span style="border-bottom:1px solid black">${c.num}</span>
    <span>${c.den}</span>
  </span>`;
}

// ===============================
// グローバル状態
// ===============================
let poly = [];
let target = { x: 0, y: 0 };

// ===============================
// 問題生成（★ここが今まで無かった）
// ===============================
function newProblem() {
  // 初期多項式：ax²（aは1〜3）
  const a = Math.floor(Math.random() * 3) + 1;
  poly = [{ coef: frac(a, 1), pow: 2 }];

  // 目標点（整数）
  target = {
    x: Math.floor(Math.random() * 5) - 2,
    y: Math.floor(Math.random() * 5) - 2
  };

  document.getElementById("target").textContent =
    `(${target.x}, ${target.y})`;

  document.getElementById("result").textContent = "";
  draw();
}

// ===============================
// 数学処理
// ===============================
function evaluate(poly, x) {
  return poly.reduce(
    (sum, t) => sum + fracToNumber(t.coef) * x ** t.pow,
    0
  );
}

function differentiate() {
  poly = poly
    .filter(t => t.pow > 0)
    .map(t => ({
      coef: frac(t.coef.num * t.pow, t.coef.den),
      pow: t.pow - 1
    }));
  draw();
}

function integrate() {
  poly = poly.map(t => ({
    coef: frac(t.coef.num, t.coef.den * (t.pow + 1)),
    pow: t.pow + 1
  }));
  draw();
}

function addConst(c) {
  const t = poly.find(t => t.pow === 0);
  if (t) t.coef = addFrac(t.coef, frac(c, 1));
  else poly.push({ coef: frac(c, 1), pow: 0 });
  draw();
}

// ===============================
// 表示
// ===============================
function polyToHTML(poly) {
  return poly.map((t, i) => {
    const sign = t.coef.num < 0 ? "−" : (i ? "+" : "");
    const coef = {
      num: Math.abs(t.coef.num),
      den: t.coef.den
    };
    const c = (coef.num === 1 && coef.den === 1 && t.pow)
      ? ""
      : fracToHTML(coef);
    if (t.pow === 0) return `${sign}${c}`;
    if (t.pow === 1) return `${sign}${c}x`;
    return `${sign}${c}x<sup>${t.pow}</sup>`;
  }).join(" ");
}

// ===============================
// 描画
// ===============================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function draw() {
  ctx.clearRect(0, 0, 400, 400);

  // 軸
  ctx.beginPath();
  ctx.moveTo(200, 0);
  ctx.lineTo(200, 400);
  ctx.moveTo(0, 200);
  ctx.lineTo(400, 200);
  ctx.stroke();

  // グラフ
  ctx.beginPath();
  for (let px = -200; px <= 200; px++) {
    const x = px / 20;
    const y = evaluate(poly, x);
    const py = -y * 20;
    px === -200
      ? ctx.moveTo(200 + px, 200 + py)
      : ctx.lineTo(200 + px, 200 + py);
  }
  ctx.stroke();

  // 目標点
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(200 + target.x * 20, 200 - target.y * 20, 5, 0, Math.PI * 2);
  ctx.fill();

  document.getElementById("formula").innerHTML =
    "f(x) = " + polyToHTML(poly);

  const y = evaluate(poly, target.x);
  document.getElementById("result").textContent =
    Math.abs(y - target.y) < 1e-6 ? "🎉 クリア！" : "";
}

// 初期問題
newProblem();

