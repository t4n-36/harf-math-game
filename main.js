const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const size = 210;
const scale = 20;

let plane = "reX-reY";
let mode = "slice";
let imX = 0;

// ===== 実数関数 y = x^2 の複素数拡張 =====
function f(reX, imX) {
  return {
    reY: reX * reX - imX * imX,
    imY: 2 * reX * imX
  };
}

// ===== UI =====
function setPlane(p) {
  plane = p;
  draw();
}

function setMode(m) {
  mode = m;
  draw();
}

function setImX(v) {
  imX = Number(v);
  document.getElementById("imxValue").textContent = v;
  draw();
}

// ===== 射影 =====
function project(reX, imX, reY, imY) {
  if (plane === "reX-reY") return { x: reX, y: reY };
  if (plane === "reX-imY") return { x: reX, y: imY };
}

// ===== 軸描画（目盛り付き） =====
function drawAxes() {
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;

  // 軸
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(size, size * 2);
  ctx.moveTo(0, size);
  ctx.lineTo(size * 2, size);
  ctx.stroke();

  ctx.fillStyle = "#333";
  ctx.font = "11px sans-serif";

  // 軸ラベル
  const [xLabel, yLabel] = plane.split("-");
  ctx.fillText(xLabel, size * 2 - 40, size - 5);
  ctx.fillText(yLabel, size + 5, 12);

  // 目盛り（−5〜5）
  for (let i = -5; i <= 5; i++) {
    const p = i * scale;

    // x目盛り
    ctx.beginPath();
    ctx.moveTo(size + p, size - 4);
    ctx.lineTo(size + p, size + 4);
    ctx.stroke();
    if (i !== 0) ctx.fillText(i, size + p - 4, size + 16);

    // y目盛り
    ctx.beginPath();
    ctx.moveTo(size - 4, size - p);
    ctx.lineTo(size + 4, size - p);
    ctx.stroke();
    if (i !== 0) ctx.fillText(i, size + 6, size - p + 4);
  }
}

// ===== 曲線描画 =====
function drawSlice(b, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();

  for (let px = -size; px <= size; px++) {
    const reX = px / scale;
    const { reY, imY } = f(reX, b);
    const p = project(reX, b, reY, imY);

    const cx = size + p.x * scale;
    const cy = size - p.y * scale;

    px === -size ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
  }
  ctx.stroke();
}

// ===== 全体描画 =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();

  if (mode === "surface") {
    for (let b = -5; b <= 5; b += 0.5) {
      drawSlice(b, "rgba(0,0,0,0.08)", 1);
    }
  }

  drawSlice(imX, "#1976d2", 2);
}

draw();
