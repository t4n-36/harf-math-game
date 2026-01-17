const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const size = 210;
const scale = 20;
const range = 10; // ← 描画範囲を拡張

let plane = "reX-reY";
let mode = "slice";
let imX = 0;

// ===== y = x^2（x 複素数） =====
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

// ===== 表示用文字 =====
function axisValueText(axis, v) {
  if (axis.startsWith("re")) return v.toString();
  if (axis.startsWith("im")) return v === 1 ? "i" : `${v}i`;
}

// ===== 軸描画（意味付き） =====
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

  const [xAxis, yAxis] = plane.split("-");
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#222";

  // 軸名
  ctx.fillText(xAxis, size * 2 - 50, size - 6);
  ctx.fillText(yAxis, size + 6, 14);

  // 固定値表示
  ctx.fillStyle = "#666";
  ctx.fillText(`imX = ${imX}i`, 10, 20);

  // 目盛り
  for (let i = -range; i <= range; i++) {
    const p = i * scale;

    // x軸
    ctx.beginPath();
    ctx.moveTo(size + p, size - 4);
    ctx.lineTo(size + p, size + 4);
    ctx.stroke();
    if (i !== 0) {
      ctx.fillText(
        axisValueText(xAxis, i),
        size + p - 6,
        size + 18
      );
    }

    // y軸
    ctx.beginPath();
    ctx.moveTo(size - 4, size - p);
    ctx.lineTo(size + 4, size - p);
    ctx.stroke();
    if (i !== 0) {
      ctx.fillText(
        axisValueText(yAxis, i),
        size + 8,
        size - p + 4
      );
    }
  }
}

// ===== 曲線 =====
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

    if (px === -size) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();
}

// ===== 全体 =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();

  if (mode === "surface") {
    for (let b = -range; b <= range; b += 0.5) {
      drawSlice(b, "rgba(0,0,0,0.07)", 1);
    }
  }

  drawSlice(imX, "#1976d2", 2);
}

draw();
