const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scale = 20;
const range = 10;

// 現在の平面
let plane = "reX-reY";

// 固定値（4軸すべて持つ）
let fixed = {
  reX: 0,
  imX: 0,
  reY: 0,
  imY: 0
};

// 軸ペア一覧
const axes = ["reX", "imX", "reY", "imY"];

// y = x^2
function square(reX, imX) {
  return {
    reY: reX * reX - imX * imX,
    imY: 2 * reX * imX
  };
}

// UI更新
function updateFixedControls() {
  const box = document.getElementById("fixedControls");
  box.innerHTML = "";

  const [ax, ay] = plane.split("-");
  const fixedAxes = axes.filter(a => a !== ax && a !== ay);

  fixedAxes.forEach(a => {
    const label = document.createElement("label");
    label.innerHTML = `
      ${a} 固定：
      <input type="range" min="-5" max="5" step="0.1"
        value="${fixed[a]}"
        oninput="fixed.${a}=parseFloat(this.value); draw();">
      <span>${fixed[a]}</span>
    `;
    box.appendChild(label);
  });
}

// 軸描画
function drawAxes() {
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;

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

// グラフ描画
function drawGraph() {
  const [ax, ay] = plane.split("-");
  ctx.strokeStyle = "#000";
  ctx.beginPath();

  for (let t = -range; t <= range; t += 0.05) {
    let vars = { ...fixed };

    if (ax === "reX" || ax === "imX") vars[ax] = t;
    if (ay === "reX" || ay === "imX") vars[ay] = t;

    const y = square(vars.reX, vars.imX);
    vars.reY = y.reY;
    vars.imY = y.imY;

    const xVal = vars[ax];
    const yVal = vars[ay];

    const cx = 250 + xVal * scale;
    const cy = 250 - yVal * scale;

    if (t === -range) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();
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

// 初期化
updateFixedControls();
draw();

