const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../prototypes/m1/index.html'),'utf8');
const code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function boot(blockStorage=false,initial={}){const listeners={},els={},canvas=new Proxy({createLinearGradient:()=>({addColorStop(){}}),measureText:t=>({width:t.length*8})},{get:(o,k)=>o[k]||(()=>{})});let saved=initial;const context={console,Set,Math,JSON,Number,performance,innerWidth:1280,innerHeight:720,devicePixelRatio:1,requestAnimationFrame:()=>{},localStorage:{getItem(){if(blockStorage)throw Error('blocked');return JSON.stringify(saved)},setItem(k,v){if(blockStorage)throw Error('blocked');saved=JSON.parse(v)}},document:{hidden:false,getElementById(id){return els[id]??={style:{},focus(){},getContext:()=>canvas}},addEventListener:(k,v)=>listeners[k]=v}};context.window=context;context.addEventListener=(k,v)=>listeners[k]=v;vm.createContext(context);vm.runInContext(code,context);return {g:context.CartCrash,ctx:context,listeners,els,get persisted(){return saved}};}
const neutral={steer:0,lean:0,crouch:false,brake:false};
function route(s,risky){return {...neutral,steer:s.s>200&&s.s<700?(s.x< -1.5?1:s.x>1.5?-1:0):(risky&&s.s>700&&s.x<3.5?1:0),crouch:s.s>590&&s.s<650}}
function run(risky,fps){const {g}=boot(),s=g.fresh();let accumulator=0,frames=0;while(s.s<g.LENGTH&&frames<fps*200){accumulator+=1/fps;let n=0;while(accumulator+1e-12>=g.DT&&n++<8&&s.s<g.LENGTH){g.step(s,route(s,risky));accumulator-=g.DT}frames++}assert(s.s>=g.LENGTH,JSON.stringify({risky,fps,s}));return s}
const results=[];for(const risky of [false,true]){let base;for(const fps of [30,60,120]){const s=run(risky,fps);assert(s.time>=35&&s.time<=55,'course duration '+s.time);assert.equal(s.crashes,0);assert.equal(s.gaps,risky?1:0);assert.equal(s.clean,risky?1:0);assert.equal(s.pumps,1);assert.equal(s.pending,0);if(base){assert(Math.abs(s.time/base.time-1)<=.02);assert.equal(s.bank,base.bank)}base=s;results.push({route:risky?'ramp':'safe',fps,time:+s.time.toFixed(3),bank:s.bank,pumps:s.pumps,crashes:s.crashes})}}
const {g,ctx,listeners,els}=boot(true);
// Partial caster guidance: hands-off drifts visibly; small keyboard corrections suffice.
function bendRun(correct,slow=false){const s=g.fresh();let peak=0,early=0,edgeSeconds=0,steerSeconds=0;while(s.s<610){const steering=correct?(s.x< -1.5?1:s.x>1.5?-1:0):0;g.step(s,{...neutral,steer:steering,brake:slow&&s.s>180&&s.v>27});peak=Math.max(peak,Math.abs(s.x));if(s.s<280)early=Math.max(early,Math.abs(s.x));if(Math.abs(s.x)>6.6)edgeSeconds+=g.DT;if(steering)steerSeconds+=g.DT}return {peak,early,edgeSeconds,steerSeconds,time:s.time,crashes:s.crashes}}
const handsOff=bendRun(false),corrected=bendRun(true),slower=bendRun(false,true);
console.log('Bend comparison',JSON.stringify({handsOff,corrected,slower}));
assert(handsOff.peak>6&&handsOff.peak<=8);assert(handsOff.early<2);assert.equal(handsOff.crashes,0);assert(corrected.peak<3);assert(corrected.edgeSeconds===0);assert(corrected.steerSeconds<corrected.time*.4);assert(slower.peak<handsOff.peak-1);
// The hill actually descends in world space, and the bend carries lateral inertia.
assert(g.elevation(1800)<g.elevation(0)-300);assert(Math.abs(g.grade(100)-g.grade(700))>.02);
const bend=g.fresh();while(bend.s<350)g.step(bend,neutral);assert(Math.abs(bend.x)>.25);assert(Math.abs(bend.camYaw)>.02);assert(bend.v>40);
const brake=g.fresh();brake.v=50;for(let n=0;n<240;n++)g.step(brake,{...neutral,brake:true});assert(brake.v<40,'brake remains effective at the faster pace');
// Flat-ground tap and charged release really leave the ground and land again.
for(const charge of [0,1]){const hop=g.fresh();hop.s=100;hop.held=true;hop.charge=charge;g.step(hop,neutral);assert(hop.h>0&&hop.vy>0);let peak=0;for(let n=0;n<200;n++){g.step(hop,neutral);peak=Math.max(peak,hop.h)}assert(peak>(charge?1.9:.8));assert.equal(hop.h,0);assert.equal(hop.crashes,0)}
// A quick tap wholly between simulation frames must not be lost.
g.restart();listeners.keydown({code:'Space',preventDefault(){}});listeners.keyup({code:'Space'});g.frame(1);g.frame(18);assert(g.state.h>0);
// Maximum reachable speed crosses the ramp and gap without tunnelling.
const lip=g.fresh();Object.assign(lip,{s:899.99,x:4,v:32});g.step(lip,neutral);assert(lip.h>=1.3,'takeoff starts at the visible ramp top');
let s=g.fresh();Object.assign(s,{s:899.9,x:4,v:g.P.maxSpeed,safeS:874,safeX:4});for(let n=0;n<700&&s.s<1010;n++)g.step(s,neutral);assert.equal(s.crashes,0);assert.equal(s.gaps,1);assert.equal(s.clean,1);
// Release in air must match a control trace with no stored compression.
let a=g.fresh(),b=g.fresh();Object.assign(a,{h:4,vy:2,held:true,charge:1,s:650});Object.assign(b,{h:4,vy:2,s:650});g.step(a,neutral);g.step(b,neutral);assert.equal(a.v,b.v);assert.equal(a.vy,b.vy);assert.equal(a.pumps,0);
// Under-speed gap and misaligned landing recover without resetting banked score.
s=g.fresh();Object.assign(s,{s:899.9,x:4,v:10,safeS:870,safeX:4,bank:55,pending:0});for(let n=0;n<1000&&!s.crashes;n++)g.step(s,neutral);assert.equal(s.crashes,1);assert.equal(s.bank,55);assert.equal(s.pending,0);assert.equal(s.s,870);assert(s.time>=2);
s=g.fresh();Object.assign(s,{s:980,h:.01,vy:-5,pitch:.5,flight:true,safeS:874,bank:55,pending:100});g.step(s,{...neutral,lean:1});assert.equal(s.crashes,1);assert.equal(s.pending,0);assert.equal(s.bank,55);
// Event IDs survive recovery and cannot be farmed.
s=run(true,60);const bank=s.bank;Object.assign(s,{s:899.9,x:4,v:g.P.maxSpeed});for(let n=0;n<700&&s.s<1040;n++)g.step(s,neutral);assert.equal(s.bank,bank);
// Restart/focus contracts exercised through actual registered input handlers.
for(let i=0;i<20;i++){listeners.keydown({code:'KeyD'});listeners.keydown({code:'Space',preventDefault(){}});listeners.keydown({code:'KeyR'});assert.equal(g.held,0);assert.equal(g.state.events.size,0);assert.equal(g.state.s,0);assert.equal(g.state.charge,0)}
listeners.keydown({code:'KeyD'});listeners.blur();assert.equal(g.mode,'pause');assert.equal(g.held,0);let time=g.state.time;g.frame(100);g.frame(5000);assert.equal(g.state.time,time);
els.resume.onclick();g.frame(10000);g.frame(20000);assert(g.state.time<=8*g.DT+.00001,'catch-up capped');
g.restart();g.state.s=1799.99;g.frame(1);g.frame(34);assert.equal(g.mode,'result');assert(els.panel.innerHTML.includes('Still in one piece'));els.go.onclick();assert.equal(g.mode,'play');assert.equal(g.state.time,0);
// Ten minutes of fixed simulation, with full routes and resets; wall-clock soak is separate.
s=g.fresh();let finishes=0;for(let i=0;i<72000;i++){g.step(s,route(s,true));assert(Number.isFinite(s.s+s.v+s.h+s.pitch+s.camYaw+s.camPitch+s.camX));if(s.s>=g.LENGTH){finishes++;s=g.fresh()}}assert(finishes>=8);
// Valid records/settings persist, corrupted numeric records are ignored, reset is explicit.
const storage=boot(false,{time:-3,score:'invalid'});storage.g.restart();storage.g.state.s=1799.99;storage.g.frame(1);storage.g.frame(34);assert(storage.persisted.time>0);assert.equal(storage.persisted.score,0);storage.els.mute.onchange({target:{checked:false}});assert.equal(storage.persisted.mute,false);const restored=boot(false,storage.persisted);assert(restored.els.panel.innerHTML.includes('id="mute" type="checkbox" >'));restored.els.reset.onclick();assert.equal(restored.persisted.time,null);assert.equal(restored.persisted.score,0);
assert(!/<script[^>]+src=|fetch\(|https?:\/\//.test(html),'offline dependency contract');
console.log(JSON.stringify({routeResults:results,assertions:'PASS: max-speed sweep, air pump, crashes, unique events, 20 restarts, focus, backlog, result/retry, blocked storage, 10-minute simulated soak',simulatedSoakFinishes:finishes},null,2));
