const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ===== 状態 =====
let plane = "reX-reY";
let mode = "slice"; // slice | surface
let imX = 0;

// ===== 設定 =====
const scale = 20;
const size = 210;

// ===== 実数関数 y = x^2 を複素数入力に拡張 =====
// x = a + bi
// y = (a^2 - b^2) + 2abi
function f(reX, imX) {
  return {
    reY: reX * reX - imX * imX,
    imY: 2 * reX * imX
  };
}

// ===== UI操作 =====
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

// ===== 座標変換 =====
function project(reX, imX, reY, imY) {
  if (plane === "reX-reY") return { x: reX, y: reY };
  if (plane === "reX-imY") return { x: reX, y: imY };
}

// ===== 描画 =====
function drawAxes() {
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(size, size * 2);
  ctx.moveTo(0, size);
  ctx.lineTo(size * 2, size);
  ctx.stroke();
}

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();

  if (mode === "surface") {
    for (let b = -5; b <= 5; b += 0.5) {
      drawSlice(b, "rgba(0,0,0,0.08)", 1);
    }
  }

  // 現在の断面（強調）
  drawSlice(imX, "#1976d2", 2);
}

// 初期描画
draw();
