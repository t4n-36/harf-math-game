
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

let func = x => x * x; // 初期関数 f(x)=x^2
const target = { x: 4, y: 0 };

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    const y = func(x);
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
  ctx.arc(200 + target.x * 20, 200 - target.y * 20, 5, 0, Math.PI * 2);
  ctx.fill();

  check();
}

function check() {
  const y = func(target.x);
  const result = document.getElementById("result");
  if (Math.abs(y - target.y) < 0.01) {
    result.textContent = "🎉 クリア！";
  } else {
    result.textContent = "";
  }
}

function add() {
  const prev = func;
  func = x => prev(x) + 1;
  draw();
}

function sub() {
  const prev = func;
  func = x => prev(x) - 1;
  draw();
}

function diff() {
  const prev = func;
  func = x => (prev(x + 0.001) - prev(x)) / 0.001;
  draw();
}

function integrate() {
  const prev = func;
  func = x => {
    let sum = 0;
    const dx = 0.01;
    for (let t = 0; t < x; t += dx) {
      sum += prev(t) * dx;
    }
    return sum;
  };
  draw();
}

draw();
