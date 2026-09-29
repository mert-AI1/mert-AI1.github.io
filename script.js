const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('visible'); });
},{threshold:.12, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal,.reveal-right').forEach(el=>observer.observe(el));

const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
toggle?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',(e)=>{
  glow?.animate({left:`${e.clientX}px`,top:`${e.clientY}px`},{duration:450,fill:'forwards'});
});
document.getElementById('year').textContent=new Date().getFullYear();


// Subtle parallax for the hero image on desktop.
const portrait = document.querySelector('.portrait-frame');
window.addEventListener('pointermove', (e) => {
  if (!portrait || window.innerWidth < 801) return;
  const x = (e.clientX / window.innerWidth - .5) * 7;
  const y = (e.clientY / window.innerHeight - .5) * 5;
  portrait.style.transform = `perspective(900px) rotateY(${x * .18}deg) rotateX(${-y * .18}deg)`;
});
window.addEventListener('scroll', () => {
  if (!portrait || window.innerWidth < 801) return;
  const y = Math.min(window.scrollY * .035, 18);
  portrait.style.marginTop = `${y}px`;
});


// Cinematic page intro: fast enough for mobile, still gives the brand a reveal.
document.body.classList.add('loading');
const hidePreloader = () => {
  document.getElementById('preloader')?.classList.add('hide');
  document.body.classList.remove('loading');
};
window.addEventListener('load', () => {
  setTimeout(hidePreloader, 850);
});
// Fallback: hide preloader after 3.5 seconds even if load event doesn't fire
setTimeout(hidePreloader, 3500);


/* V4 motion polish */
(() => {
  const header = document.querySelector('.site-header');
  const root = document.documentElement;

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 18);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // Pointer glow only where a fine pointer exists.
  if (window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      root.style.setProperty('--mx', e.clientX + 'px');
      root.style.setProperty('--my', e.clientY + 'px');
    }, {passive:true});

    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX-r.left)/r.width-.5)*7;
        const y = ((e.clientY-r.top)/r.height-.5)*7;
        btn.style.transform = `translate(${x}px,${y}px) translateY(-3px)`;
      });
      btn.addEventListener('pointerleave', () => btn.style.transform = '');
    });
  }

  // Stagger cards as they enter the viewport.
  const groups = document.querySelectorAll('.services-grid,.offices-grid');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        [...entry.target.children].forEach((el,i) => {
          el.style.transitionDelay = `${Math.min(i*70,420)}ms`;
          el.classList.add('show');
        });
        io.unobserve(entry.target);
      });
    }, {threshold:.12});
    groups.forEach(g => io.observe(g));
  }
