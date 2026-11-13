const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'public/app.js'),'utf8');
class Element{constructor(){this.children=[];this.events={};this.hidden=false;this.classList={toggle(){}}}append(...x){this.children.push(...x)}replaceChildren(...x){this.children=x}addEventListener(n,f){this.events[n]=f}focus(){}}
function setup(config,pixel='ok'){
 const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id)};
 const events=[],navigations=[],timers=[],windows={};
 const window={EDEN_CONFIG:config,addEventListener:(n,f)=>windows[n]=f,location:{assign:u=>{events.push('navigation');navigations.push(u)}},setTimeout:(f,ms)=>{assert.equal(ms,250);timers.push(f)}};
 if(pixel!=='missing')window.fbq=(...args)=>{if(pixel==='throw')throw Error('blocked');events.push(args)};
 const document={getElementById:get,createElement:()=>new Element(),querySelectorAll:()=>Array.from({length:4},()=>new Element()),head:new Element()};
 const c=vm.createContext({window,document}),read=s=>vm.runInContext(s,c);vm.runInContext(source,c);
 return {get,events,navigations,timers,windows,read,submit:()=>get('qualification').events.submit({preventDefault(){}})};
}
const live={mode:'live',whatsappNumber:'5548999999999',pixelId:'985054417533046'};
const a=setup(live);assert.deepEqual(Array.from(a.events[0]),['init',live.pixelId]);assert.deepEqual(Array.from(a.events[1]),['track','PageView']);assert.equal(a.events.length,2);const qs=a.read('questions');let count=0;
for(const p of qs[0][2])for(const c of qs[1][2])for(const t of qs[2][2])for(const h of qs[3][2]){
 const x=setup(live);x.events.length=0;
 for(const [i,answer]of [p,c,t,h].entries()){
  x.submit();assert.equal(x.navigations.length,0);assert.equal(x.events.length,0);
  x.read(`advance(questions[${i}][0],${JSON.stringify(answer)})`);
 }
 assert.equal(x.get('summary').children.length,4);assert.equal(x.get('review').hidden,false);
 x.submit();x.submit();assert.equal(x.timers.length,1);assert.equal(x.events.length,1);assert.deepEqual(Array.from(x.events[0]).slice(0,2),['track','Lead']);
 x.timers.shift()();assert.equal(x.navigations.length,1);const url=new URL(x.navigations[0]);assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/5548999999999');
 const m=url.searchParams.get('text');for(const val of [p,c,t,h])assert(m.includes(val));assert(!m.includes('undefined'));count++;
}
function complete(x){for(let i=0;i<4;i++)x.read(`advance(questions[${i}][0],questions[${i}][2][0])`)}
for(const cfg of [{mode:'review',whatsappNumber:''},{...live,mode:'review'},{...live,whatsappNumber:'not-a-number'}]){
 const x=setup(cfg);complete(x);x.submit();assert.equal(x.events.length,0);assert.equal(x.navigations.length,0);assert.equal(x.get('message-preview').hidden,false);
 x.get('back').events.click();assert.equal(x.read('step'),3);assert.equal(x.get('review').hidden,true);assert.equal(x.get('message-preview').hidden,true);
 x.read("advance('purpose','Invalid')");assert.equal(x.read('step'),3);
}
for(const pixel of ['missing','throw']){const x=setup({...live,pixelId:''},pixel);complete(x);x.submit();assert.equal(x.navigations.length,1)}
const x=setup(live);complete(x);x.submit();x.timers.shift()();x.windows.pageshow();x.submit();assert.equal(x.timers.length,1);
const html=fs.readFileSync(path.join(__dirname,'public/index.html'),'utf8');assert.equal((html.match(/<section\b/g)||[]).length,3);assert.equal((html.match(/<h1\b/g)||[]).length,1);
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(!/^(?:https?:|\/)/.test(match[1]))assert(fs.existsSync(path.join(__dirname,'public',match[1])),match[1])}
assert(!html.includes('554891662560'));assert(!html.includes('R$'));assert(!html.includes('.pdf'));
console.log(`OK: ${count} combinações; bloqueio de envio incompleto; evento único antes do redirecionamento; Pixel indisponível; retorno do WhatsApp; revisão sem eventos; 3 seções; assets locais.`);
