(function(){
  var body = document.body,
      env  = document.getElementById('envelope'),
      card = document.getElementById('card'),
      petalBox = document.getElementById('petals');

  var rnd = function(a,b){ return a + Math.random()*(b-a); };

  /* ── Petals setup ── */
  function makePetals(n, dense){
    var frag = document.createDocumentFragment();
    for (var i=0;i<n;i++){
      var p = document.createElement('i'),
          w = rnd(7,15);
      p.className = 'petal';
      p.style.left = rnd(-5,102) + 'vw';
      p.style.width = w + 'px';
      p.style.height = (w*1.3) + 'px';
      p.style.setProperty('--x1', rnd(-14,14) + 'vw');
      p.style.setProperty('--x2', rnd(-20,20) + 'vw');
      p.style.setProperty('--o', rnd(.45,.95));
      p.style.animationDuration = rnd(dense?7:12, dense?15:22) + 's';
      p.style.animationDelay = rnd(-20, dense?0:2) + 's';
      frag.appendChild(p);
    }
    petalBox.appendChild(frag);
  }
  makePetals(9,false);

  /* ── Audio chime ── */
  function chime(){
    try{
      var AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return;
      var ctx = new AC(), t = ctx.currentTime;
      [[880,0],[1318.5,.16],[1760,.32]].forEach(function(n){
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t+n[1]);
        g.gain.exponentialRampToValueAtTime(0.09, t+n[1]+0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t+n[1]+1.6);
        o.connect(g); g.connect(ctx.destination);
        o.start(t+n[1]); o.stop(t+n[1]+1.8);
      });
      setTimeout(function(){ ctx.close(); }, 3000);
    }catch(e){}
  }

  var opened = false;
  function open(){
    if(opened) return;
    opened = true;
    body.classList.add('opened');
    chime();
    setTimeout(function(){ makePetals(30,true); }, 500);
    setTimeout(function(){ card.setAttribute('tabindex','-1'); card.focus({preventScroll:true}); }, 1500);
  }

  /* ── Trigger Events: Click, Touch Swipe Up, and Wheel Scroll Up ── */
  env.addEventListener('click', open);

  // Mouse Wheel / Trackpad Scroll Up Detection
  window.addEventListener('wheel', function(e){
    if(!opened && e.deltaY > 0){ // Scrolling down / dragging up
      open();
    }
  }, { passive: true });

  // Touch Swipe Up Detection for Mobile
  var touchStartY = 0;
  window.addEventListener('touchstart', function(e){
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', function(e){
    var touchEndY = e.changedTouches[0].clientY;
    // Trigger if swiped upwards by more than 30px
    if(!opened && touchStartY - touchEndY > 30){
      open();
    }
  }, { passive: true });

  document.getElementById('replay').addEventListener('click', function(){
    body.classList.remove('opened');
    opened = false;
    petalBox.innerHTML = '';
    makePetals(9,false);
    env.focus();
  });

  /* ── Countdown ── */
  var target = new Date(2026,11,13,0,0,0);
  function pad(n){ return n<10 ? '0'+n : ''+n; }
  function tick(){
    var box = document.getElementById('count'),
        ms = target - new Date();
    if(ms <= 0){ box.innerHTML = '<div><b>Today</b><small>at last</small></div>'; return; }
    var d = Math.floor(ms/86400000),
        h = Math.floor(ms/3600000)%24,
        m = Math.floor(ms/60000)%60;
    box.innerHTML =
      '<div><b>'+d+'</b><small>Days</small></div>' +
      '<div><b>'+pad(h)+'</b><small>Hours</small></div>' +
      '<div><b>'+pad(m)+'</b><small>Minutes</small></div>';
  }
  tick(); setInterval(tick, 30000);

  /* ── Action Links ── */
  var address = 'Bhabhya Durlava Mandapa, Braja Nagar 3rd Lane, Berhampur, Odisha';
  document.getElementById('maps').href =
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);

  var ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DhruBiForever//EN','BEGIN:VEVENT',
    'UID:dhruti-biswa-engagement-20261213',
    'DTSTART;VALUE=DATE:20261213','DTEND;VALUE=DATE:20261214',
    'SUMMARY:Engagement — Dhruti & Biswa',
    'LOCATION:' + address.replace(/,/g,'\\,'),
    'DESCRIPTION:With immense joy and the blessings of our families\\, we warmly invite you to celebrate our engagement. #DhruBiForever',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  document.getElementById('cal').href =
    'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);

  document.getElementById('share').addEventListener('click', function(e){
    var text = 'Dhruti & Biswa — Engagement, 13 Dec 2026, Berhampur. #DhruBiForever ' + location.href;
    if(navigator.share){
      e.preventDefault();
      navigator.share({ title:'Dhruti & Biswa — Engagement', text:text }).catch(function(){});
    } else {
      this.href = 'https://wa.me/?text=' + encodeURIComponent(text);
    }
  });
})();