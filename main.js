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
// 分数HTML
// ===============================
function fracToHTML(c) {
  if (c.den === 1) return `${c.num}`;
  return `
    <span class="fraction">
      <span class="top">${c.num}</span>
      <span class="bottom">${c.den}</span>
    </span>
  `;
}

// ===============================
// 状態
// ===============================
let poly = [];
let target = { x: 0, y: 0 };

// ===============================
// DOM
// ===============================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ===============================
// 数学処理
// ===============================
function evaluate(poly, x) {
  return poly.reduce(
    (sum, t) => sum + fracToNumber(t.coef) * x ** t.pow,
    0
  );
}

function differentiatePoly(poly) {
  return poly
    .filter(t => t.pow > 0)
    .map(t => ({
      coef: frac(t.coef.num * t.pow, t.coef.den),
      pow: t.pow - 1
    }));
}

function integratePoly(poly) {
  return poly.map(t => ({
    coef: frac(t.coef.num, t.coef.den * (t.pow + 1)),
    pow: t.pow + 1
  }));
}

function addConstant(poly, c) {
  const result = [...poly];
  const constant = result.find(t => t.pow === 0);

  if (constant) {
    constant.coef = addFrac(constant.coef, frac(c, 1));
  } else {
    result.push({ coef: frac(c, 1), pow: 0 });
  }
  return result;
}

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
// 表示
// ===============================
function polyToHTML(poly) {
  if (poly.length === 0) return "0";

  return poly.map((t, i) => {
    const sign = t.coef.num < 0 ? "−" : (i === 0 ? "" : "+");

    const absCoef = {
      num: Math.abs(t.coef.num),
      den: t.coef.den
    };

    const coefHTML =
      absCoef.num === 1 && absCoef.den === 1 && t.pow !== 0
        ? ""
        : fracToHTML(absCoef);

    if (t.pow === 0) return `${sign}${coefHTML}`;
    if (t.pow === 1) return `${sign}${coefHTML}x`;
    return `${sign}${coefHTML}x<sup>${t.pow}</sup>`;
  }).join(" ");
}

// ===============================
// 描画
// ===============================
function draw() {
  poly = normalizePoly(poly);

  ctx.clearRect(0, 0, 400, 400);

  ctx.beginPath();
  ctx.moveTo(200, 0);
  ctx.lineTo(200, 400);
  ctx.moveTo(0, 200);
  ctx.lineTo(400, 200);
  ctx.stroke();

  ctx.beginPath();
  for (let px = -200; px <= 200; px++) {
    const x = px / 20;
    const y = evaluate(poly, x);
    const py = -y * 20;

    if (px === -200) ctx.moveTo(200 + px, 200 + py);
    else ctx.lineTo(200 + px, 200 + py);
  }
  ctx.stroke();

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

  document.getElementById("formula").innerHTML =
    "f(x) = " + polyToHTML(poly);

  document.getElementById("target").textContent =
    `(${target.x}, ${target.y})`;

  const y = evaluate(poly, target.x);
  document.getElementById("result").textContent =
    Math.abs(y - target.y) < 1e-6 ? "🎉 クリア！" : "";
}

// ===============================
// ランダム問題
// ===============================
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newProblem() {
  poly = [
    { coef: frac(randInt(1, 3), 1), pow: 2 },
    { coef: frac(randInt(-3, 3), 1), pow: 1 },
    { coef: frac(randInt(-3, 3), 1), pow: 0 }
  ];

  target = {
    x: randInt(-4, 4),
    y: randInt(-4, 4)
  };

  document.getElementById("result").textContent = "";
  draw();
}

// ===============================
// イベント登録（重要）
// ===============================
document.getElementById("btn-diff").onclick = () =>
  poly = (draw(), normalizePoly(differentiatePoly(poly)));

document.getElementById("btn-int").onclick = () =>
  poly = (draw(), normalizePoly(integratePoly(poly)));

document.getElementById("btn-plus").onclick = () =>
  poly = (draw(), normalizePoly(addConstant(poly, 1)));

document.getElementById("btn-minus").onclick = () =>
  poly = (draw(), normalizePoly(addConstant(poly, -1)));

document.getElementById("btn-new").onclick = newProblem;

// 初期化
newProblem();
