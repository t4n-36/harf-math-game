const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const planeSel = document.getElementById("plane");
const modeSel  = document.getElementById("mode");
const fixedInp = document.getElementById("fixedVal");

const axisInfo = document.getElementById("axisInfo");
const calcInfo = document.getElementById("calcInfo");

const axes = ["reX","imX","reY","imY"];
const scale = 25;
const center = 250;

// 実関数（例）
function f(x, y){
  return x*x - y;
}

// 軸描画
function drawAxes(){
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(center, 0);
  ctx.lineTo(center, 500);
  ctx.moveTo(0, center);
  ctx.lineTo(500, center);
  ctx.stroke();

  // 目盛り
  for(let i=-10;i<=10;i++){
    ctx.fillRect(center + i*scale, center-3, 1, 6);
    ctx.fillRect(center-3, center - i*scale, 6, 1);
  }
}

// 曲線描画
function drawCurve(fixed){
  const [ax, ay] = planeSel.value.split("-");

  ctx.beginPath();
  for(let i=-10;i<=10;i+=0.05){
    let v = {...fixed};

    v[ax] = i;
    v[ay] = f(
      (v.reX ?? 0) - (v.imX ?? 0),
      (v.reY ?? 0) - (v.imY ?? 0)
    );

    const x = center + v[ax]*scale;
    const y = center - v[ay]*scale;

    i === -10 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  }
  ctx.stroke();
}

// 整数点
function drawIntegerPoints(){
  const [ax, ay] = planeSel.value.split("-");

  for(let i=-10;i<=10;i++){
    const x = center + i*scale;
    const y = center;

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI*2);
    ctx.fill();
  }
}

// クリック解析
canvas.onclick = e => {
  const x = Math.round((e.offsetX-center)/scale);
  if(Math.abs(x)>10) return;

  calcInfo.textContent =
    `x = ${x} のとき f(x,y)=x²−y → ${x*x}`;
};

// メイン描画
function draw(){
  ctx.clearRect(0,0,500,500);
  drawAxes();

  const [ax, ay] = planeSel.value.split("-");
  const fixedAxes = axes.filter(a => a!==ax && a!==ay);

  const fixedVal = parseInt(fixedInp.value);

  let base = { reX:0, imX:0, reY:0, imY:0 };
  base[fixedAxes[0]] = fixedVal;

  axisInfo.textContent =
    `表示: ${ax} × ${ay} ｜ 固定: ${fixedAxes[0]} = ${fixedVal}`;

  if(modeSel.value==="slice"){
    ctx.strokeStyle="#000";
    drawCurve(base);
  }

  if(modeSel.value==="surface"){
    ctx.strokeStyle="rgba(0,0,0,0.15)";
    for(let k=-5;k<=5;k++){
      let v={...base};
      v[fixedAxes[0]]=k;
      drawCurve(v);
    }
  }

  drawIntegerPoints();
}

draw();
