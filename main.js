const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scale = 20;
const range = 10;

let plane = "reX-reY";
let mode = "slice";
let currentFunc = "square";

const axes = ["reX", "imX", "reY", "imY"];

let fixed = { reX:0, imX:0, reY:0, imY:0 };

// ========= 複素数演算 =========
function C(re, im) { return {re, im}; }

function add(a,b){ return C(a.re+b.re, a.im+b.im); }
function mul(a,b){
  return C(a.re*b.re - a.im*b.im, a.re*b.im + a.im*b.re);
}
function inv(z){
  const d = z.re*z.re + z.im*z.im;
  return C(z.re/d, -z.im/d);
}
function expC(z){
  const e = Math.exp(z.re);
  return C(e*Math.cos(z.im), e*Math.sin(z.im));
}
function sinC(z){
  return C(
    Math.sin(z.re)*Math.cosh(z.im),
    Math.cos(z.re)*Math.sinh(z.im)
  );
}

// ========= 関数定義（ここが増設ポイント） =========
const functions = {
  square: z => mul(z, z),
  cube: z => mul(mul(z, z), z),
  quartic: z => mul(mul(z,z), mul(z,z)),
  reciprocal: z => inv(z),
  exp: z => expC(z),
  sin: z => sinC(z)
};

// ========= UI =========
function updateFixedControls(){
  const box = document.getElementById("fixedControls");
  box.innerHTML = "";
  const [ax, ay] = plane.split("-");
  axes.filter(a=>a!==ax&&a!==ay).forEach(a=>{
    box.innerHTML += `
      ${a}：
      <button onclick="fixed.${a}--; draw()">−</button>
      ${fixed[a]}
      <button onclick="fixed.${a}++; draw()">＋</button><br>
    `;
  });
}

// ========= 描画 =========
function drawAxes(){
  ctx.strokeStyle="#999";
  ctx.beginPath();
  ctx.moveTo(250,0);ctx.lineTo(250,500);
  ctx.moveTo(0,250);ctx.lineTo(500,250);
  ctx.stroke();

  ctx.fillStyle="#444";
  for(let i=-range;i<=range;i++){
    if(i===0)continue;
    ctx.fillText(i,250+i*scale-5,265);
    ctx.fillText(i,235,250-i*scale+4);
  }
}

function drawCurve(vars){
  const [ax, ay] = plane.split("-");
  ctx.beginPath();
  for(let t=-range;t<=range;t+=0.05){
    let v={...vars};
    if(ax==="reX"||ax==="imX") v[ax]=t;
    if(ay==="reX"||ay==="imX") v[ay]=t;

    const z = C(v.reX, v.imX);
    const w = functions[currentFunc](z);

    v.reY=w.re; v.imY=w.im;

    const x=250+v[ax]*scale;
    const y=250-v[ay]*scale;

    if(t===-range) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  }
  ctx.stroke();
}

function draw(){
  ctx.clearRect(0,0,500,500);
  drawAxes();

  if(mode==="slice"){
    ctx.strokeStyle="#000";
    drawCurve(fixed);
  }else{
    ctx.strokeStyle="rgba(0,0,0,0.15)";
    for(let k=-5;k<=5;k++){
      let v={...fixed};
      const [ax,ay]= differAxes();
      v[ax]=k;
      drawCurve(v);
    }
  }
}

function differAxes(){
  const [ax,ay]=plane.split("-");
  return axes.filter(a=>a!==ax&&a!==ay);
}

// ========= イベント =========
document.getElementById("planeSelect").onchange=e=>{
  plane=e.target.value;updateFixedControls();draw();
};
document.getElementById("funcSelect").onchange=e=>{
  currentFunc=e.target.value;draw();
};
document.querySelectorAll("input[name='mode']").forEach(r=>{
  r.onchange=e=>{mode=e.target.value;draw();}
});

updateFixedControls();
draw();

