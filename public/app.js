'use strict';
// Quatro perguntas visíveis, com uma escolha por pergunta.
const questions = [
  ['purpose','Você procura um apartamento para…',['Morar','Investir','Ainda estou avaliando']],
  ['configuration','Qual tamanho combina com você?',['68 ou 80 m²','90 a 117 m²','Ainda não decidi']],
  ['timing','Quando você pensa em comprar?',['Até 6 meses','De 6 a 12 meses','Ainda estou pesquisando']],
  ['help','Como podemos ajudar você?',['Consultar valores e unidades','Conhecer os apartamentos','Entender as condições de compra']]
];
const titles = ['Seu objetivo','Tamanho desejado','Prazo de compra','Seu atendimento'];
let forwardingToTeam=false;
const config=window.EDEN_CONFIG || {};
const form=document.getElementById('qualification');
const container=document.getElementById('questions');
const status=document.getElementById('form-status');
const preview=document.getElementById('message-preview');

function buildMessage(data){
  return 'Olá! Conheci o Éden e gostaria de receber atendimento personalizado da equipe da Zilli.\n\n'+questions.map(([name],i)=>titles[i]+': '+data.get(name)).join('\n');
}
function render(){
  container.replaceChildren();
  questions.forEach(([name,title,options],questionIndex)=>{
    const field=document.createElement('fieldset');field.className='form-question';
    const legend=document.createElement('legend');
    const number=document.createElement('span');number.className='question-number';number.textContent=String(questionIndex+1).padStart(2,'0');number.setAttribute('aria-hidden','true');
    const heading=document.createElement('span');heading.textContent=title;legend.append(number,heading);field.append(legend);
    const choices=document.createElement('div');choices.className='options';
    options.forEach((value,index)=>{
      const label=document.createElement('label');label.className='option';
      const input=document.createElement('input');input.type='radio';input.name=name;input.value=value;input.required=true;input.id=name+'-'+index;
      const text=document.createElement('span');text.textContent=value;label.append(input,text);choices.append(label);
    });
    field.append(choices);container.append(field);
  });
}

// Pixel do Éden confirmado pelo responsável. Desativado na revisão.
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
form.addEventListener('change',()=>{status.hidden=true;preview.hidden=true});
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(forwardingToTeam)return;
  const data=new FormData(form);
  const missing=questions.find(([name,,options])=>!options.includes(data.get(name)));
  if(missing){
    status.textContent='Selecione uma opção em cada uma das quatro perguntas para continuar.';status.hidden=false;
    document.getElementById(missing[0]+'-0').focus();return;
  }
  const message=buildMessage(data);
  if(config.mode!=='live'||!/^55\d{10,11}$/.test(config.whatsappNumber||'')){
    status.textContent='Esta é uma página em revisão. O atendimento será habilitado após a confirmação do WhatsApp comercial do Éden. Nenhuma mensagem foi enviada.';status.hidden=false;
    document.getElementById('message-text').textContent=message;preview.hidden=false;return;
  }
  forwardingToTeam=true;document.getElementById('submit').disabled=true;
  const whatsappUrl='https://wa.me/'+config.whatsappNumber+'?text='+encodeURIComponent(message);
  let pixelEventQueued=false;
  try{if(typeof window.fbq==='function'){window.fbq('track','Lead',{empreendimento:'Eden'});pixelEventQueued=true}}catch(error){/* O contato continua funcionando se o Pixel estiver bloqueado. */}
  const openWhatsApp=()=>window.location.assign(whatsappUrl);
  if(pixelEventQueued)window.setTimeout(openWhatsApp,250);else openWhatsApp();
});

// A chamada fixa libera a tela assim que o formulário fica visível.
const mobileCta=document.getElementById('mobile-cta');
if(mobileCta&&'IntersectionObserver' in window){
  const observer=new window.IntersectionObserver(entries=>{
    mobileCta.hidden=entries.some(entry=>entry.isIntersecting);
  });
  observer.observe(document.querySelector('.form-panel'));
}
initializePixel();render();
