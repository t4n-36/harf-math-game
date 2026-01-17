const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scale = 20;
const range = 10;

let plane = "reX-reY";
let mode = "slice";

const axes = ["reX", "imX", "reY", "imY"];

let fixed = {
  reX: 0,
  imX: 0,
  reY: 0,
  imY: 0
};

// y = x^2
function square(reX, imX) {
  return {
    reY: reX * reX - imX * imX,
    imY: 2 * reX * imX
  };
}

// UI（固定値：整数）
function updateFixedControls() {
  const box = document.getElementById("fixedControls");
  box.innerHTML = "";

  const [ax, ay] = plane.split("-");
  const fixedAxes = axes.filter(a => a !== ax && a !== ay);

  fixedAxes.forEach(a => {
    const container = document.createElement("div");
    container.innerHTML = `
      ${a}：
      <button onclick="fixed.${a}--; draw()">−</button>
      <span>${fixed[a]}</span>
      <button onclick="fixed.${a}++; draw()">＋</button>
    `;
    box.appendChild(container);
  });
}

// 軸描画
function drawAxes() {
  ctx.strokeStyle = "#999";
  ctx.beginPath();
  ctx.moveTo(250, 0);
  ctx.lineTo(250, 500);
  ctx.moveTo(0, 250);
  ctx.lineTo(500, 250);
  ctx.stroke();

  ctx.fillStyle = "#444";
  ctx.font = "12px sans-serif";

  for (let i = -range; i <= range; i++) {
    if (i === 0) continue;
    ctx.fillText(i, 250 + i * scale - 5, 265);
    ctx.fillText(i, 235, 250 - i * scale + 4);
  }

  const [ax, ay] = plane.split("-");
  ctx.fillText(ax, 480, 245);
  ctx.fillText(ay, 255, 15);
}

// 曲線1本
function drawCurve(fixedVars) {
  const [ax, ay] = plane.split("-");
  ctx.beginPath();

  for (let t = -range; t <= range; t += 0.05) {
    let v = { ...fixedVars };

    if (ax === "reX" || ax === "imX") v[ax] = t;
    if (ay === "reX" || ay === "imX") v[ay] = t;

    const y = square(v.reX, v.imX);
    v.reY = y.reY;
    v.imY = y.imY;

    const cx = 250 + v[ax] * scale;
    const cy = 250 - v[ay] * scale;

    if (t === -range) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();
}

// グラフ描画
function drawGraph() {
  ctx.strokeStyle = "#000";

  if (mode === "slice") {
    drawCurve(fixed);
  } else {
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    for (let k = -5; k <= 5; k++) {
      let vars = { ...fixed };
      const [ax, ay] = plane.split("-");
      const other = axes.filter(a => a !== ax && a !== ay)[0];
      vars[other] = k;
      drawCurve(vars);
    }
  }
}

// 固定値表示
function drawFixedInfo() {
  ctx.fillStyle = "#006";
  ctx.font = "13px sans-serif";
  let y = 20;

  const [ax, ay] = plane.split("-");
  axes.filter(a => a !== ax && a !== ay).forEach(a => {
    ctx.fillText(`${a} = ${fixed[a]}`, 10, y);
    y += 16;
  });
}

function draw() {
  ctx.clearRect(0, 0, 500, 500);
  drawAxes();
  drawGraph();
  drawFixedInfo();
}

// イベント
document.getElementById("planeSelect").onchange = e => {
  plane = e.target.value;
  updateFixedControls();
  draw();
};

document.querySelectorAll("input[name='mode']").forEach(r => {
  r.onchange = e => {
    mode = e.target.value;
    draw();
  };
});

// 初期化
updateFixedControls();
draw();
