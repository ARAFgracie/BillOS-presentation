const deck=document.getElementById('deck'),slides=[...document.querySelectorAll('.slide')],current=document.getElementById('current'),total=document.getElementById('total'),drawer=document.getElementById('drawer'),backdrop=document.getElementById('backdrop'),toast=document.getElementById('toast');

total.textContent=String(slides.length).padStart(2,'0');
let index=0,wheelLocked=false,touchStartY=0,cart=0,cartTotal=0;

function setIndex(i){
  index=Math.max(0,Math.min(slides.length-1,i));
  current.textContent=String(index+1).padStart(2,'0');
  document.querySelectorAll('.nav-item').forEach((e,n)=>e.classList.toggle('active',n===index))
}

function goTo(i){
  slides[i]?.scrollIntoView({behavior:'smooth'});
  setIndex(i)
}

function next(){goTo(index+1)}
function prev(){goTo(index-1)}

document.querySelectorAll('[data-next]').forEach(b=>b.onclick=next);

document.querySelectorAll('[data-jump]').forEach(b=>{
  b.onclick=()=>goTo(+b.dataset.jump)
});

slides.forEach((s,i)=>{
  let b=document.createElement('button');
  b.className='nav-item';
  b.innerHTML=`<b>${String(i+1).padStart(2,'0')}</b><span>${s.dataset.name}</span>`;
  b.onclick=()=>{
    goTo(i);
    closeDrawer()
  };
  document.getElementById('drawerNav').appendChild(b)
});

new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)setIndex(slides.indexOf(e.target))
}),{
  root:deck,
  threshold:.65
}).observe(slides[0]);

slides.slice(1).forEach(s=>new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)setIndex(slides.indexOf(e.target))
}),{
  root:deck,
  threshold:.65
}).observe(s));

function openDrawer(){
  drawer.classList.add('open');
  backdrop.classList.add('show')
}

function closeDrawer(){
  drawer.classList.remove('open');
  backdrop.classList.remove('show')
}

document.getElementById('menuBtn').onclick=openDrawer;
document.getElementById('closeDrawer').onclick=closeDrawer;
backdrop.onclick=closeDrawer;

document.onkeydown=e=>{
  if(['ArrowDown','PageDown',' '].includes(e.key)){
    e.preventDefault();
    next()
  }

  if(['ArrowUp','PageUp'].includes(e.key)){
    e.preventDefault();
    prev()
  }

  if(e.key==='Home'){
    e.preventDefault();
    goTo(0)
  }

  if(e.key==='End'){
    e.preventDefault();
    goTo(slides.length-1)
  }

  if(e.key==='Escape')closeDrawer()
};

deck.addEventListener('wheel',e=>{
  e.preventDefault();

  if(wheelLocked||Math.abs(e.deltaY)<2)return;

  wheelLocked=true;

  e.deltaY>0?next():prev();

  setTimeout(()=>{
    wheelLocked=false
  },850)
},{passive:false});

deck.addEventListener('touchstart',e=>{
  touchStartY=e.changedTouches[0].clientY
},{passive:true});

deck.addEventListener('touchend',e=>{
  let d=touchStartY-e.changedTouches[0].clientY;

  if(Math.abs(d)>55)d>0?next():prev()
},{passive:true});

document.querySelectorAll('[data-reveal]').forEach(b=>{
  b.onclick=()=>{
    document.getElementById(b.dataset.reveal)?.classList.toggle('show')
  }
});

document.querySelectorAll('.orbit').forEach(b=>{
  b.onclick=()=>{
    b.classList.toggle('active');
    document.getElementById(b.dataset.reveal)?.classList.toggle('show')
  }
});

const stepData={
  1:[
    '01',
    'Sale হলো → entry হলো.',
    'Product select, quantity, payment—তারপর bill. এতটুকুই.',
    'Chicken Chips × 2',
    'Cash ৳500'
  ],

  2:[
    '02',
    'Stock automatically moves.',
    'Sale হলে stock কমে যাবে. Receive করলে আবার বাড়বে.',
    'Cookies 42 → 40',
    'Dry Cake +20'
  ],

  3:[
    '03',
    'Owner sees the picture.',
    'দিনের শেষে dashboard থেকেই status দেখা যাবে.',
    'Sales ৳48.9k',
    'Low stock 07'
  ]
};

document.querySelectorAll('.step').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('.step').forEach(x=>x.classList.remove('active'));

    b.classList.add('active');

    let d=stepData[b.dataset.step];

    document.getElementById('stepPanel').innerHTML=`
      <div class="step-number">${d[0]}</div>

      <div>
        <h3>${d[1]}</h3>

        <p>${d[2]}</p>

        <div class="fake-inputs">
          <span>${d[3]}</span>
          <span>${d[4]}</span>
          <span class="ok">✓ Updated</span>
        </div>
      </div>
    `
  }
});

const prices={
  Cookies:120,
  'Dry Cake':180,
  Chanachur:90
};

document.querySelectorAll('.add').forEach(b=>{
  b.onclick=()=>{
    cart++;
    cartTotal+=prices[b.dataset.add];

    document.getElementById('cartText').textContent=
      `${cart} item${cart>1?'s':''}`;

    document.getElementById('cartTotal').textContent=
      '৳'+cartTotal.toLocaleString('en-BD');

    document.getElementById('demoNote').innerHTML=`
      <span>ADDED</span>

      <h3>${b.dataset.add} added.</h3>

      <p>আরেকটা add করতে পারো, অথবা checkout চাপো.</p>
    `
  }
});

document.getElementById('checkout').onclick=()=>{
  if(!cart){
    showToast('আগে একটা product add করো 🙂');
    return
  }

  showToast(
    `Bill complete — ৳${cartTotal.toLocaleString('en-BD')}`
  );

  document.getElementById('demoNote').innerHTML=`
    <span>DONE</span>

    <h3>Bill complete.</h3>

    <p>
      ${cart} item · ৳${cartTotal.toLocaleString('en-BD')}
      · receipt ready.
    </p>
  `
};

const roles={
  cashier:[
    'Cashier',
    'Sales, checkout, returns—day-to-day কাজের জন্য যা লাগে।'
  ],

  manager:[
    'Manager',
    'Stock, reports, branch activity—team চালানোর জন্য দরকারি view.'
  ],

  admin:[
    'Admin',
    'Users, roles, settings আর পুরো system-এর control.'
  ]
};

document.querySelectorAll('.role').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('.role').forEach(x=>x.classList.remove('active'));

    b.classList.add('active');

    let d=roles[b.dataset.role];

    document.getElementById('roleDetail').innerHTML=`
      <strong>${d[0]}</strong>
      <p>${d[1]}</p>
    `
  }
});

const phases={
  mvp:[
    'Phase 01',
    'Make the daily workflow solid.',
    'প্রথমে sale, stock আর receipt—এই তিনটা জিনিস cleanly কাজ করুক।'
  ],

  cloud:[
    'Phase 02',
    'Connect the branches.',
    'Branch sync, roles আর cloud access যোগ হবে।'
  ],

  smart:[
    'Phase 03',
    'Make the numbers useful.',
    'Analytics, alerts আর smarter insights দিয়ে next decision সহজ করা হবে।'
  ]
};

document.querySelectorAll('.phase').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('.phase').forEach(x=>x.classList.remove('active'));

    b.classList.add('active');

    let d=phases[b.dataset.phase];

    document.getElementById('phaseDetail').innerHTML=`
      <b>${d[0]}</b>

      <h3>${d[1]}</h3>

      <p>${d[2]}</p>
    `
  }
});

function showToast(m){
  toast.textContent=m;

  toast.classList.add('show');

  clearTimeout(showToast.t);

  showToast.t=setTimeout(()=>{
    toast.classList.remove('show')
  },2200)
}

setIndex(0);
