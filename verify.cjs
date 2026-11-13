const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'public/app.js'),'utf8');
class Element{
 constructor(){this.children=[];this.events={};this.hidden=false}
 append(...x){this.children.push(...x)}replaceChildren(...x){this.children=x}
 addEventListener(n,f){this.events[n]=f}setAttribute(){}focus(){this.focused=true}
}
function setup(config,pixel='ok'){
 const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id)};
 const events=[],navigations=[],timers=[],windows={},values=new Map();let visibility;
 const window={EDEN_CONFIG:config,addEventListener:(n,f)=>windows[n]=f,location:{assign:u=>{events.push('navigation');navigations.push(u)}},setTimeout:(f,ms)=>{assert.equal(ms,250);timers.push(f)},IntersectionObserver:class{constructor(callback){visibility=callback}observe(node){assert.equal(node,get('panel'))}}};
 if(pixel!=='missing')window.fbq=(...args)=>{if(pixel==='throw')throw Error('blocked');events.push(args)};
 const document={getElementById:get,createElement:()=>new Element(),querySelector:()=>get('panel'),head:new Element()};
 const FormData=class{constructor(){return new Map(values)}};
 const c=vm.createContext({window,document,FormData}),read=s=>vm.runInContext(s,c);vm.runInContext(source,c);
 return {get,events,navigations,timers,windows,values,read,visibility:visible=>visibility([{isIntersecting:visible}]),submit:()=>get('qualification').events.submit({preventDefault(){}})};
}
const live={mode:'live',whatsappNumber:'5548999999999',pixelId:'985054417533046'};
const a=setup(live);assert.deepEqual(Array.from(a.events[0]),['init',live.pixelId]);assert.deepEqual(Array.from(a.events[1]),['track','PageView']);assert.equal(a.events.length,2);
const qs=a.read('questions');assert.equal(qs.length,4);
assert.equal(a.get('questions').children.length,4);assert(qs.every(q=>q[2].length<=3));
let count=0;
for(const p of qs[0][2])for(const c of qs[1][2])for(const t of qs[2][2])for(const h of qs[3][2]){
 const x=setup(live);x.events.length=0;
 for(const [i,answer]of [p,c,t,h].entries()){
  x.submit();assert.equal(x.navigations.length,0);assert.equal(x.events.length,0);
  x.values.set(qs[i][0],answer);
 }
 x.submit();x.submit();assert.equal(x.timers.length,1);assert.equal(x.events.length,1);assert.deepEqual(Array.from(x.events[0]).slice(0,2),['track','Lead']);assert.equal(x.get('submit').disabled,true);
 x.timers.shift()();assert.equal(x.navigations.length,1);const url=new URL(x.navigations[0]);assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/5548999999999');
 const message=url.searchParams.get('text');for(const val of [p,c,t,h])assert(message.includes(val));assert(!message.includes('undefined'));count++;
}
function complete(x){qs.forEach(([name,,options])=>x.values.set(name,options[0]))}
for(const cfg of [{mode:'review',whatsappNumber:''},{...live,mode:'review'},{...live,whatsappNumber:'not-a-number'}]){
 const x=setup(cfg);complete(x);x.submit();assert.equal(x.events.length,0);assert.equal(x.navigations.length,0);assert.equal(x.get('message-preview').hidden,false);
 x.get('qualification').events.change();assert.equal(x.get('message-preview').hidden,true);assert.equal(x.get('form-status').hidden,true);
}
for(const pixel of ['missing','throw']){const x=setup({...live,pixelId:''},pixel);complete(x);x.submit();assert.equal(x.navigations.length,1)}
const invalid=setup(live);complete(invalid);invalid.values.set('configuration','Opção inválida');invalid.events.length=0;invalid.submit();assert.equal(invalid.events.length,0);assert.equal(invalid.navigations.length,0);assert.equal(invalid.get('configuration-0').focused,true);
const changed=setup(live);complete(changed);changed.values.set('purpose','Investir');changed.submit();changed.timers.shift()();assert(new URL(changed.navigations[0]).searchParams.get('text').includes('Seu objetivo: Investir'));
changed.windows.pageshow();assert.equal(changed.get('submit').disabled,false);changed.submit();assert.equal(changed.timers.length,1);
a.visibility(true);assert.equal(a.get('mobile-cta').hidden,true);a.visibility(false);assert.equal(a.get('mobile-cta').hidden,false);assert.equal(a.events.length,2);
const html=fs.readFileSync(path.join(__dirname,'public/index.html'),'utf8');assert.equal((html.match(/<section\b/g)||[]).length,3);assert.equal((html.match(/<h1\b/g)||[]).length,1);
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(!/^(?:https?:|\/)/.test(match[1]))assert(fs.existsSync(path.join(__dirname,'public',match[1])),match[1])}
assert(!html.includes('554891662560'));assert(!html.includes('R$'));assert(!html.includes('.pdf'));
console.log(`OK: ${count} combinações; 4 perguntas simultâneas; até 3 opções; validação; Lead único; WhatsApp; edição das respostas; Pixel indisponível; revisão; chamada fixa; assets locais.`);
