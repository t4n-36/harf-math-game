const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const calcText = document.getElementById("calcText");

const scale = 20;
const range = 10;

let plane = "reX-reY";
let mode = "slice";
let currentFunc = "square";

const axes = ["reX", "imX", "reY", "imY"];
let fixed = { reX:0, imX:0, reY:0, imY:0 };

// ================= 複素数 =================
const C = (re, im) => ({ re, im });

const mul = (a,b)=>C(
  a.re*b.re - a.im*b.im,
  a.re*b.im + a.im*b.re
);

const inv = z => {
  const d = z.re*z.re + z.im*z.im;
  return C(z.re/d, -z.im/d);
};

const expC = z => {
  const e = Math.exp(z.re);
  return C(e*Math.cos(z.im), e*Math.sin(z.im));
};

const sinC = z =>
  C(Math.sin(z.re)*Math.cosh(z.im),
    Math.cos(z.re)*Math.sinh(z.im));

// ================= 関数定義 =================
const functions = {
  square: z => mul(z,z),
  cube: z => mul(mul(z,z),z),
  quartic: z => mul(mul(z,z),mul(z,z)),
  reciprocal: z => inv(z),
  exp: z => expC(z),
  sin: z => sinC(z)
};

// ================= 表示用ユーティリティ =================
function complexToString(z){
  const r = z.re;
  const i = z.im;

  if (r === 0 && i === 0) return "0";
  if (i === 0) return `${r}`;
  if (r === 0) return `${i}i`;
  return `${r} ${i>0?"+":"−"} ${Math.abs(i)}i`;
}

// ================= 描画 =================
function drawAxes(){
  ctx.strokeStyle="#aaa";
  ctx.beginPath();
  ctx.moveTo(250,0);ctx.lineTo(250,500);
  ctx.moveTo(0,250);ctx.lineTo(500,250);
  ctx.stroke();

  ctx.fillStyle="#555";
  for(let i=-range;i<=range;i++){
    if(i===0)continue;
    ctx.fillText(i,250+i*scale-4,265);
    ctx.fillText(i,235,250-i*scale+4);
  }
}

// 整数Xの「クリック用ポイント」
function drawIntegerPoints(){
  const [ax] = plane.split("-");
  ctx.fillStyle="rgba(30,144,255,0.6)";

  for(let k=-range;k<=range;k++){
    let v={...fixed};
    v[ax]=k;

    const z=C(v.reX,v.imX);
    const w=functions[currentFunc](z);

    v.reY=w.re;
    v.imY=w.im;

    const x=250+v[ax]*scale;
    const y=250-v[plane.split("-")[1]]*scale;

    ctx.beginPath();
    ctx.arc(x,y,6,0,Math.PI*2);
    ctx.fill();
  }
}

function drawCurve(vars){
  const [ax, ay] = plane.split("-");
  ctx.beginPath();

  for(let t=-range;t<=range;t+=0.05){
    let v={...vars};
    if(ax.includes("X")) v[ax]=t;
    if(ay.includes("X")) v[ay]=t;

    const z=C(v.reX,v.imX);
    const w=functions[currentFunc](z);

    v.reY=w.re;
    v.imY=w.im;

    const x=250+v[ax]*scale;
    const y=250-v[ay]*scale;

    t===-range?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }
  ctx.stroke();
}

function draw(){
  ctx.clearRect(0,0,500,500);
  drawAxes();
  ctx.strokeStyle="#000";
  drawCurve(fixed);
  drawIntegerPoints();
}

// ================= クリック解析 =================
canvas.addEventListener("click", e=>{
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;

  const [ax] = plane.split("-");
  const xVal = Math.round((mx-250)/scale);

  if(Math.abs(mx-(250+xVal*scale))>8) return;

  let v={...fixed};
  v[ax]=xVal;

  const z=C(v.reX,v.imX);
  const w=functions[currentFunc](z);

  calcText.textContent =
`x = ${complexToString(z)}
y = ${document.getElementById("funcSelect").selectedOptions[0].text}
y = ${complexToString(w)}`;
});

// ================= UI =================
document.getElementById("planeSelect").onchange=e=>{
  plane=e.target.value;
  draw();
};

document.getElementById("funcSelect").onchange=e=>{
  currentFunc=e.target.value;
  draw();
};

document.querySelectorAll("input[name='mode']").forEach(r=>{
  r.onchange=e=>{
    mode=e.target.value;
    draw();
  };
});

draw();
