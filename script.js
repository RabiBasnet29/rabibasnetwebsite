const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav-links');
menuBtn?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'✕':'☰'});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false');if(menuBtn)menuBtn.textContent='☰'}));

const header=document.querySelector('.site-header');
const progress=document.querySelector('.scroll-progress span');
const timeline=document.getElementById('timeline');
const timelineFill=timeline?.querySelector('.timeline-line span');
function onScroll(){
  const y=window.scrollY;header?.classList.toggle('scrolled',y>18);
  const doc=document.documentElement;const max=doc.scrollHeight-innerHeight;progress.style.width=`${max?y/max*100:0}%`;
  if(timeline&&timelineFill){const r=timeline.getBoundingClientRect();const start=innerHeight*.72;const total=r.height;const p=Math.max(0,Math.min(1,(start-r.top)/total));timelineFill.style.height=`${p*100}%`}
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');if(entry.target.querySelector?.('[data-counter]'))runCounters(entry.target);io.unobserve(entry.target)}}),{threshold:.13});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

let counted=false;function runCounters(){if(counted)return;counted=true;document.querySelectorAll('[data-counter]').forEach(el=>{const target=+el.dataset.counter;const suffix=el.dataset.suffix||'';const start=performance.now();const dur=1200;function tick(now){const p=Math.min(1,(now-start)/dur);const eased=1-Math.pow(1-p,3);el.textContent=Math.floor(target*eased)+suffix;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)})}
const heroObserver=new IntersectionObserver(e=>{if(e[0].isIntersecting){runCounters();heroObserver.disconnect()}},{threshold:.25});heroObserver.observe(document.querySelector('.hero'));

document.querySelectorAll('.tilt-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(innerWidth<900)return;const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(800px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-2px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});

const heroVisual=document.getElementById('hero-visual');
heroVisual?.addEventListener('pointermove',e=>{if(innerWidth<850)return;const r=heroVisual.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;heroVisual.querySelectorAll('[data-depth]').forEach(el=>{const d=+el.dataset.depth;el.style.transform=`translate(${x*d*90}px,${y*d*90}px)`})});
heroVisual?.addEventListener('pointerleave',()=>heroVisual.querySelectorAll('[data-depth]').forEach(el=>el.style.transform=''));

const glow=document.querySelector('.cursor-glow');
addEventListener('pointermove',e=>{if(!glow)return;glow.style.opacity='1';glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

// Lightweight animated network graphic behind the hero.
const canvas=document.getElementById('network-canvas');
const ctx=canvas?.getContext('2d');
let points=[];let raf;
function resizeCanvas(){if(!canvas)return;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=canvas.clientWidth*dpr;canvas.height=canvas.clientHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(52,Math.floor(canvas.clientWidth/24));points=Array.from({length:count},()=>({x:Math.random()*canvas.clientWidth,y:Math.random()*canvas.clientHeight,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.6+.6}))}
function drawNetwork(){if(!ctx||!canvas)return;ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);for(const p of points){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>canvas.clientWidth)p.vx*=-1;if(p.y<0||p.y>canvas.clientHeight)p.vy*=-1}for(let i=0;i<points.length;i++){for(let j=i+1;j<points.length;j++){const a=points[i],b=points[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<105){ctx.strokeStyle=`rgba(22,138,164,${(1-d/105)*.16})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}for(const p of points){ctx.fillStyle='rgba(16,126,153,.36)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}raf=requestAnimationFrame(drawNetwork)}
if(canvas&&!matchMedia('(prefers-reduced-motion: reduce)').matches){resizeCanvas();drawNetwork();addEventListener('resize',resizeCanvas)}

document.getElementById('year').textContent=new Date().getFullYear();

// Keep the mobile navigation predictable when the viewport changes.
addEventListener('resize',()=>{
  if(innerWidth>1000 && nav?.classList.contains('open')){
    nav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded','false');
    if(menuBtn) menuBtn.textContent='☰';
  }
},{passive:true});

document.addEventListener('click',e=>{
  if(!nav?.classList.contains('open')) return;
  if(nav.contains(e.target) || menuBtn?.contains(e.target)) return;
  nav.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded','false');
  if(menuBtn) menuBtn.textContent='☰';
});
