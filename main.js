// ===== 状態 =====

// 初期関数 f(x) = x^2
let poly = [
  { coef: 1, pow: 2 }
];

// 目標点
const target = { x: 4, y: 0 };

// ===== 表示 =====

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

document.getElementById("target").textContent =
  `(${target.x}, ${target.y})`;

// ===== 数学処理 =====

// 評価
function evaluate(poly, x) {
  return poly.reduce(
    (sum, t) => sum + t.coef * x ** t.pow,
    0
  );
}

// 微分
function diff(poly) {
  return poly
    .filter(t => t.pow > 0)
    .map(t => ({
      coef: t.coef * t.pow,
      pow: t.pow - 1
    }));
}

// 積分（積分定数なし）
function integ(poly) {
  return poly.map(t => ({
    coef: t.coef / (t.pow + 1),
    pow: t.pow + 1
  }));
}

// 定数加算
function addConstant(poly, c) {
  const result = [...poly];
  result.push({ coef: c, pow: 0 });
  return result;
}

// ===== 数式表示 =====

function polyToString(poly) {
  if (poly.length === 0) return "0";

  return poly.map(t => {
    if (t.pow === 0) return `${t.coef}`;
    if (t.pow === 1) return `${t.coef}x`;
    return `${t.coef}x^${t.pow}`;
  }).join(" + ");
}

// ===== 描画 =====

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

// ===== 操作 =====

function differentiate() {
  poly = diff(poly);
  draw();
}

function integrate() {
  poly = integ(poly);
  draw();
}

function addConst(c) {
  poly = addConstant(poly, c);
  draw();
}

// 初期描画
draw();
