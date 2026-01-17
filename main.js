

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

function mulFrac(a, b) {
  return frac(
    a.num * b.num,
    a.den * b.den
  );
}

function fracToNumber(f) {
  return f.num / f.den;
}

// ===============================
// 多項式の状態
// f(x) = x^2
// ===============================

let poly = [
  { coef: frac(1, 1), pow: 2 }
];

// 目標点
const target = { x: 4, y: 0 };

// ===============================
// DOM
// ===============================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

document.getElementById("target").textContent =
  `(${target.x}, ${target.y})`;

// ===============================
// 数学処理
// ===============================

// 評価（描画専用：ここだけ数値化）
function evaluate(poly, x) {
  return poly.reduce(
    (sum, t) =>
      sum + fracToNumber(t.coef) * x ** t.pow,
    0
  );
}

// 微分
function differentiatePoly(poly) {
  return poly
    .filter(t => t.pow > 0)
    .map(t => ({
      coef: frac(t.coef.num * t.pow, t.coef.den),
      pow: t.pow - 1
    }));
}

// 積分（積分定数なし）
function integratePoly(poly) {
  return poly.map(t => ({
    coef: frac(t.coef.num, t.coef.den * (t.pow + 1)),
    pow: t.pow + 1
  }));
}

// 定数加算
function addConstant(poly, c) {
  const result = [...poly];
  result.push({ coef: frac(c, 1), pow: 0 });
  return result;
}

// ===============================
// 数式表示
// ===============================

function coefToString(c) {
  if (c.den === 1) return `${c.num}`;
  return `${c.num}/${c.den}`;
}

function polyToString(poly) {
  if (poly.length === 0) return "0";

  return poly
    .map(t => {
      const c = coefToString(t.coef);
      if (t.pow === 0) return c;
      if (t.pow === 1) return `${c}x`;
      return `${c}x^${t.pow}`;
    })
    .join(" + ");
}

// ===============================
// 描画
// ===============================

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

    if (px === -200) {
      ctx.moveTo(200 + px, 200 + py);
    } else {
      ctx.lineTo(200 + px, 200 + py);
    }
  }
  ctx.stroke();

  // 目標点
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    200 + target.x * 20,
    200 - target.y * 20,
    5,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // 数式表示
  document.getElementById("formula").textContent =
    "f(x) = " + polyToString(poly);

  // クリア判定
  const y = evaluate(poly, target.x);
  document.getElementById("result").textContent =
    Math.abs(y - target.y) < 1e-3 ? "🎉 クリア！" : "";
}

// ===============================
// 操作ボタン
// ===============================

function differentiate() {
  poly = differentiatePoly(poly);
  draw();
}

function integrate() {
  poly = integratePoly(poly);
  draw();
}

function addConst(c) {
  poly = addConstant(poly, c);
  draw();
}

// 初期描画
draw();
