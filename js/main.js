/* РН-ДОМ: скрипты сайта (анимация появления, форма звонка, политика конфиденциальности, видео и галерея домов).
   Код безопасно работает и на главной странице, и на странице отзывов (otzyvy.html). */
document.documentElement.classList.add('js');
var $=function(i){return document.getElementById(i)};
try{var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});document.querySelectorAll('.rv').forEach(function(el){io.observe(el)})}catch(e){document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})}

/* Окно «Политика конфиденциальности» (на странице отзывов ссылка ведёт на index.html#privacy) */
var dg=$('pdlg');
if(dg){
  document.querySelectorAll('.pp').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();if(dg.showModal)dg.showModal();else dg.setAttribute('open','')})});
  $('pclose').addEventListener('click',function(){dg.close()});
  dg.addEventListener('click',function(e){if(e.target===dg)dg.close()});
  if(location.hash==='#privacy'&&dg.showModal)dg.showModal();
}

/* Форма обратного звонка (пока без отправки данных, см. README) */
var fo=$('f');
if(fo)fo.addEventListener('submit',function(e){e.preventDefault();this.querySelector('button').style.display='none';$('ok').style.display='block'});

/* Видео Rutube с обложкой: плеер загружается по клику (быстрее открывается сайт) */
document.querySelectorAll('.vid[data-rutube]').forEach(function(v){
  function go(){
    if(v.dataset.on)return;v.dataset.on='1';
    var f=document.createElement('iframe');
    f.src='https://rutube.ru/play/embed/'+v.dataset.rutube+'/?autoStart=true';
    f.allow='autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write';
    f.setAttribute('allowfullscreen','');f.title=v.dataset.title||'Видео';
    v.innerHTML='';v.classList.remove('cv');v.appendChild(f);
  }
  v.addEventListener('click',go);
});

/* Карточки домов: слайдер в карточке и окно «Подробнее» почти на весь экран */
var hd=$('hd');
if(hd){
  var hi=$('hdi'),hc=$('hdc'),hth=$('hdth'),hImgs=[],hIdx=0;
  var hdShow=function(i){
    hIdx=(i+hImgs.length)%hImgs.length;var im=hImgs[hIdx];
    hi.src=im.src;hi.alt=im.alt;hi.className=im.classList.contains('plan')?'plan':'';
    hc.textContent=(hIdx+1)+' / '+hImgs.length;
    [].forEach.call(hth.children,function(t,k){t.classList.toggle('on',k===hIdx)});
  };
  var hdOpen=function(card,i){
    hImgs=[].slice.call(card.querySelectorAll('.sl img'));
    $('hdh').textContent=card.querySelector('h3').textContent;
    $('hdch').innerHTML=card.querySelector('.ch').innerHTML;
    $('hdd').innerHTML=card.querySelector('.hd-desc').innerHTML;
    hth.innerHTML='';
    hImgs.forEach(function(im,k){var t=document.createElement('button'),th=document.createElement('img');t.type='button';t.setAttribute('aria-label','Фото '+(k+1));th.src=im.src;th.alt='';t.appendChild(th);t.addEventListener('click',function(){hdShow(k)});hth.appendChild(t)});
    hdShow(i||0);hd.showModal();hd.querySelector('.hd-t').scrollTop=0;hd.scrollTop=0;
  };
  document.querySelectorAll('.hc').forEach(function(card){
    var sl=card.querySelector('.sl'),ct=card.querySelector('.ct'),imgs=[].slice.call(sl.querySelectorAll('img'));
    sl.addEventListener('scroll',function(){ct.textContent=(Math.round(sl.scrollLeft/sl.clientWidth)+1)+' / '+imgs.length});
    card.querySelector('.ar.l').addEventListener('click',function(){sl.scrollBy({left:-sl.clientWidth,behavior:'smooth'})});
    card.querySelector('.ar.r').addEventListener('click',function(){sl.scrollBy({left:sl.clientWidth,behavior:'smooth'})});
    imgs.forEach(function(im,i){im.addEventListener('click',function(){hdOpen(card,i)})});
    card.querySelector('.more-btn').addEventListener('click',function(){hdOpen(card,0)});
  });
  $('hdp').addEventListener('click',function(){hdShow(hIdx-1)});
  $('hdn').addEventListener('click',function(){hdShow(hIdx+1)});
  $('hdx').addEventListener('click',function(){hd.close()});
  $('hdb').addEventListener('click',function(){hd.close()});
  hd.addEventListener('click',function(e){if(e.target===hd)hd.close()});
  document.addEventListener('keydown',function(e){if(!hd.open)return;if(e.key==='ArrowLeft')hdShow(hIdx-1);if(e.key==='ArrowRight')hdShow(hIdx+1)});
}

/* Кнопка «Наверх» */
var up=$('up');
if(up){
  var upCheck=function(){up.classList.toggle('on',window.scrollY>600)};
  window.addEventListener('scroll',upCheck,{passive:true});upCheck();
  up.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
}

/* Мобильное меню (бургер) */
var burger=$('burger'),hdrEl=document.querySelector('header');
if(burger&&hdrEl){
  var menuSet=function(o){hdrEl.classList.toggle('menu',o);burger.setAttribute('aria-expanded',o?'true':'false')};
  burger.addEventListener('click',function(){menuSet(!hdrEl.classList.contains('menu'))});
  hdrEl.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',function(){menuSet(false)})});
  window.addEventListener('resize',function(){if(window.innerWidth>860)menuSet(false)});
}

/* Если обложка видео не загрузилась, остаётся фирменный фон с кнопкой play */
document.querySelectorAll('.vid .cover').forEach(function(i){
  var rm=function(){i.remove()};
  i.addEventListener('error',rm);
  setTimeout(function(){if(i.complete&&i.naturalWidth===0&&i.getAttribute('src'))rm()},0);
});
