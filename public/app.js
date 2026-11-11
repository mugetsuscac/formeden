'use strict';
// Interação adaptada do Solo: etapas, revisão, confirmação e WhatsApp.
const questions = [
  ['purpose','Você procura um apartamento para…',['Morar','Investir','Ainda estou avaliando']],
  ['configuration','Qual espaço combina com o seu momento?',['1 suíte · 68 m²','2 dormitórios, sendo 1 suíte · 80 m²','2 suítes · 90 ou 94 m²','3 suítes · 117 m²','Ainda não decidi']],
  ['timing','Quando você pensa em comprar?',['Até 3 meses','De 3 a 6 meses','De 6 a 12 meses','Ainda estou pesquisando']],
  ['help','Como a equipe pode ajudar você?',['Quero consultar valores e unidades','Quero conhecer as configurações e os diferenciais','Quero entender as possibilidades de compra']]
];
const titles = ['Seu objetivo','Configuração desejada','Prazo de compra','Seu atendimento'];
const answers = new Map();
let step=0, forwardingToTeam=false;
const config=window.EDEN_CONFIG || {};
const form=document.getElementById('qualification');
const container=document.getElementById('questions');
const review=document.getElementById('review');
const back=document.getElementById('back');
const status=document.getElementById('form-status');
const preview=document.getElementById('message-preview');

function buildMessage(data){
  return 'Olá! Conheci o Éden e gostaria de receber atendimento personalizado da equipe da Zilli.\n\n'+questions.map(([name],i)=>titles[i]+': '+data.get(name)).join('\n');
}
function isComplete(){return questions.every(([name,,options])=>options.includes(answers.get(name)))}
function render(focus=false){
  container.replaceChildren();status.hidden=true;preview.hidden=true;
  const complete=step===questions.length;
  container.hidden=complete;review.hidden=!complete;back.hidden=step===0;
  document.getElementById('step-label').textContent=complete?'04 / 04 · Suas escolhas':String(step+1).padStart(2,'0')+' / 04';
  document.querySelectorAll('.progress span').forEach((segment,index)=>segment.classList.toggle('done',complete||index<=step));
  document.getElementById('nav-hint').textContent=complete?'Você pode voltar e rever suas respostas.':'Selecione uma opção para continuar.';
  if(complete){
    const summary=document.getElementById('summary');summary.replaceChildren();
    questions.forEach(([name],index)=>{const item=document.createElement('div');const title=document.createElement('dt');const value=document.createElement('dd');title.textContent=titles[index];value.textContent=answers.get(name);item.append(title,value);summary.append(item)});
    if(focus)document.getElementById('review-title').focus({preventScroll:true});return;
  }
  const [name,title,options]=questions[step];
  const field=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=title;legend.tabIndex=-1;field.append(legend);
  const choices=document.createElement('div');choices.className='options';
  options.forEach((value,index)=>{
    const label=document.createElement('label');label.className='option';
    const input=document.createElement('input');input.type='radio';input.name=name;input.value=value;input.checked=answers.get(name)===value;input.required=true;input.id=name+'-'+index;
    // Como no Solo, a seleção avança. A guarda de etapa evita avanço duplo.
    input.addEventListener('change',()=>advance(name,value));
    input.addEventListener('click',()=>{if(answers.get(name)===value)advance(name,value)});
    const text=document.createElement('span');text.textContent=value;label.append(input,text);choices.append(label);
  });field.append(choices);container.append(field);if(focus)legend.focus({preventScroll:true});
}
function advance(name,value){if(forwardingToTeam||step>=questions.length||questions[step][0]!==name||!questions[step][2].includes(value))return;answers.set(name,value);step++;render(true)}
back.addEventListener('click',()=>{if(step>0&&!forwardingToTeam){step--;render(true)}});

// Mesma conta de Pixel encontrada no código atual do Solo. Desativada na revisão.
function initializePixel(){
  if(config.mode!=='live'||!/^55\d{10,11}$/.test(config.whatsappNumber||'')||!/^\d+$/.test(config.pixelId||''))return;
  if(!window.fbq){
    const q=function(){q.callMethod?q.callMethod.apply(q,arguments):q.queue.push(arguments)};
    window.fbq=q;if(!window._fbq)window._fbq=q;q.push=q;q.loaded=true;q.version='2.0';q.queue=[];
    const script=document.createElement('script');script.async=true;script.src='https://connect.facebook.net/en_US/fbevents.js';document.head.append(script);
  }
  window.fbq('init',config.pixelId);window.fbq('track','PageView');
}
window.addEventListener('pageshow',()=>{forwardingToTeam=false;document.getElementById('submit').disabled=false});
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(forwardingToTeam||step!==questions.length||!isComplete())return;
  const message=buildMessage(answers);
  if(config.mode!=='live'||!/^55\d{10,11}$/.test(config.whatsappNumber||'')){
    status.textContent='Esta é uma página em revisão. O atendimento será habilitado após a confirmação do WhatsApp comercial do Éden. Nenhuma mensagem foi enviada.';status.hidden=false;
    document.getElementById('message-text').textContent=message;preview.hidden=false;return;
  }
  forwardingToTeam=true;document.getElementById('submit').disabled=true;
  const whatsappUrl='https://wa.me/'+config.whatsappNumber+'?text='+encodeURIComponent(message);
  let pixelEventQueued=false;
  try{if(typeof window.fbq==='function'){window.fbq('trackCustom','Form Response',{empreendimento:'Eden'});pixelEventQueued=true}}catch(error){/* O contato funciona com o Pixel bloqueado, como no Solo. */}
  const openWhatsApp=()=>window.location.assign(whatsappUrl);
  if(pixelEventQueued)window.setTimeout(openWhatsApp,250);else openWhatsApp();
});
initializePixel();render();
