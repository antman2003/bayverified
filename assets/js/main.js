/* BayVerified v1.2 — vanilla JS only. */
(()=>{'use strict';
 const menu=document.querySelector('.menu-toggle');const nav=document.getElementById('primary-nav');
 if(menu&&nav){
  const setOpen=open=>{menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)};
  menu.addEventListener('click',()=>setOpen(menu.getAttribute('aria-expanded')!=='true'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setOpen(false);menu.focus()}});
  document.addEventListener('click',e=>{if(menu.getAttribute('aria-expanded')==='true'&&!nav.contains(e.target)&&!menu.contains(e.target))setOpen(false)});
 }
 const form=document.getElementById('directory-filter');
 if(form){
  const trade=form.querySelector('[name="trade"]'),area=form.querySelector('[name="area"]'),cards=[...document.querySelectorAll('[data-contractor-card]')],count=document.getElementById('result-count'),empty=document.getElementById('empty-results');
  const emptyText=empty.textContent;
  const WHOLE='湾区';
  // Area hierarchy: child -> parent. Matching is two-way (parent selection matches child records and vice versa).
  const PARENT={'Sunnyvale':'南湾','San Jose':'南湾','中半岛':'半岛','Dublin':'东湾','Union City':'东湾','Fremont':'东湾'};
  // Old fine-grained trade values (bookmarked URLs) -> major category.
  const TRADE_ALIAS={'全屋装修':'装修','室内装修':'装修','加建':'装修','新建':'装修','盖房子':'装修','水电':'电工','水管':'水管 / 下水道','下水道':'水管 / 下水道','地板':'地板 / 楼梯 / 木工','楼梯':'地板 / 楼梯 / 木工','木工':'地板 / 楼梯 / 木工'};
  const areaMatch=(sel,rec)=>!sel||rec===WHOLE||sel===WHOLE||sel===rec||PARENT[rec]===sel||PARENT[sel]===rec;
  const params=new URLSearchParams(location.search);
  const setSelected=(el,val)=>{if([...el.options].some(o=>o.value===val))el.value=val};
  setSelected(trade,TRADE_ALIAS[params.get('trade')]||params.get('trade')||'');
  setSelected(area,params.get('area')||'');
  const update=()=>{
   const parts=c=>[(c.dataset.trades||'').split('|'),(c.dataset.areas||'').split('|')];
   let shown=cards.filter(c=>{const [ts,as]=parts(c);return(!trade.value||ts.includes(trade.value))&&(!area.value||as.some(a=>areaMatch(area.value,a)))});
   let fallback=false;
   if(!shown.length){shown=cards.filter(c=>parts(c)[1].includes(WHOLE));fallback=shown.length>0}
   cards.forEach(c=>{c.hidden=!shown.includes(c)});
   document.querySelectorAll('[data-group]').forEach(g=>{const n=g.querySelectorAll('[data-contractor-card]:not([hidden])').length;g.hidden=n===0;const s=g.querySelector('[data-group-count]');if(s)s.textContent=n});
   if(fallback){count.textContent=`没有完全符合的师傅 · 以下 ${shown.length} 位为全湾区服务的师傅`;empty.textContent='以下师傅服务全湾区，工种不一定与所选相同，请查看详情确认。';empty.hidden=false}
   else{count.textContent=`共 ${shown.length} 位师傅`;empty.textContent=emptyText;empty.hidden=shown.length!==0}
   const url=new URL(location.href);
   if(trade.value)url.searchParams.set('trade',trade.value);else url.searchParams.delete('trade');
   if(area.value)url.searchParams.set('area',area.value);else url.searchParams.delete('area');
   history.replaceState(null,'',url.pathname+url.search)};
  form.addEventListener('submit',e=>{e.preventDefault();update()});trade.addEventListener('change',update);area.addEventListener('change',update);
  document.getElementById('reset-filters')?.addEventListener('click',()=>{trade.value='';area.value='';update()});
  update();
 }
 document.querySelectorAll('[data-tabs]').forEach(root=>{const tabs=[...root.querySelectorAll('[role="tab"]')];const activate=tab=>{for(const t of tabs){const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;const panel=document.getElementById(t.getAttribute('aria-controls'));if(panel)panel.hidden=!selected}};tabs.forEach((t,i)=>{t.addEventListener('click',()=>activate(t));t.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();activate(tabs[next]);tabs[next].focus()})});activate(tabs[0]);});
})();
