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
    <span style="
      display:inline-block;
      text-align:center;
      vertical-align:middle;
      line-height:1;
    ">
      <span style="display:block; border-bottom:1px solid black;">
        ${c.num}
      </span>
      <span style="display:block;">
        ${c.den}
      </span>
    </span>
  `;
}

// ===============================
// 多項式状態
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

// 評価（描画用）
function evaluate(poly, x) {
  return poly.reduce(
    (sum, t) => sum + fracToNumber(t.coef) * x ** t.pow,
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
  return [...poly, { coef: frac(c, 1), pow: 0 }];
}

// ===============================
// 正規化（同じ次数をまとめる）
// ===============================

function normalizePoly(poly) {
  const map = {};

  poly.forEach(t => {
    if (!map[t.pow]) {
      map[t.pow] = frac(t.coef.num, t.coef.den);
    } else {
      map[t.pow] = addFrac(map[t.pow], t.coef);
    }
  });

  return Object.keys(map)
    .map(p => ({
      pow: Number(p),
      coef: map[p]
    }))
    .filter(t => t.coef.num !== 0)
    .sort((a, b) => b.pow - a.pow);
}

// ===============================
// 数式表示（HTML）
// ===============================

function polyToHTML(poly) {
  if (poly.length === 0) return "0";

  return poly
    .map((t, i) => {
      const sign =
        t.coef.num < 0 ? "−" : (i === 0 ? "" : "+");

      const coefHTML = fracToHTML({
        num: Math.abs(t.coef.num),
        den: t.coef.den
      });

      if (t.pow === 0) return `${sign}${coefHTML}`;
      if (t.pow === 1) return `${sign}${coefHTML}x`;
      return `${sign}${coefHTML}x<sup>${t.pow}</sup>`;
    })
    .join(" ");
}

// ===============================
// 描画
// ===============================

function draw() {
  poly = normalizePoly(poly);

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

  // 数式
  document.getElementById("formula").innerHTML =
    "f(x) = " + polyToHTML(poly);

  // クリア判定
  const y = evaluate(poly, target.x);
  document.getElementById("result").textContent =
    Math.abs(y - target.y) < 1e-6 ? "🎉 クリア！" : "";
}

// ===============================
// 操作
// ===============================

function differentiate() {
  poly = normalizePoly(differentiatePoly(poly));
  draw();
}

function integrate() {
  poly = normalizePoly(integratePoly(poly));
  draw();
}

function addConst(c) {
  poly = normalizePoly(addConstant(poly, c));
  draw();
}

// 初期描画
draw();
