const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const size = 210;
const scale = 20;
const range = 10;

let plane = "reX-reY";
let mode = "slice";
let imX = 0;

// ===== y = x^2（x は複素数）=====
function f(reX, imX) {
  return {
    reX,
    imX,
    reY: reX * reX - imX * imX,
    imY: 2 * reX * imX
  };
}

// ===== 軸定義（★ここが核心）=====
const axisGetter = {
  reX: z => z.reX,
  imX: z => z.imX,
  reY: z => z.reY,
  imY: z => z.imY
};

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

// ===== 表示用文字 =====
function axisValueText(axis, v) {
  if (axis.startsWith("re")) return v.toString();
  if (axis.startsWith("im")) return v === 1 ? "i" : `${v}i`;
}

// ===== 軸描画 =====
function drawAxes(xAxis, yAxis) {
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(size, size * 2);
  ctx.moveTo(0, size);
  ctx.lineTo(size * 2, size);
  ctx.stroke();

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

    // x
    ctx.beginPath();
    ctx.moveTo(size + p, size - 4);
    ctx.lineTo(size + p, size + 4);
    ctx.stroke();
    if (i !== 0)
      ctx.fillText(axisValueText(xAxis, i), size + p - 6, size + 18);

    // y
    ctx.beginPath();
    ctx.moveTo(size - 4, size - p);
    ctx.lineTo(size + 4, size - p);
    ctx.stroke();
    if (i !== 0)
      ctx.fillText(axisValueText(yAxis, i), size + 8, size - p + 4);
  }
}

// ===== 曲線描画 =====
function drawSlice(b, color, width) {
  const [xAxis, yAxis] = plane.split("-");

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();

  for (let px = -size; px <= size; px++) {
    const reX = px / scale;
    const z = f(reX, b);

    const xVal = axisGetter[xAxis](z);
    const yVal = axisGetter[yAxis](z);

    const cx = size + xVal * scale;
    const cy = size - yVal * scale;

    if (px === -size) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();
}

// ===== 全体描画 =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const [xAxis, yAxis] = plane.split("-");
  drawAxes(xAxis, yAxis);

  if (mode === "surface") {
    for (let b = -range; b <= range; b += 0.5) {
      drawSlice(b, "rgba(0,0,0,0.07)", 1);
    }
  }

  drawSlice(imX, "#1976d2", 2);
}

draw();

