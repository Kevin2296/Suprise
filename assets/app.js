// Streamable IDs
    const VIDEO1_ID = "c53lhh";
    const VIDEO2_ID = "uwkejn";

    // Echte duur (jij gaf: 8s en 15.04s) + mini buffer
    const PART1_LENGTH = 8.1;
    const PART2_LENGTH = 15.2;

    const start = document.getElementById('start');
    const env = document.getElementById('env');
    const loader = document.getElementById('loader');
    const player = document.getElementById('player');
    const frame = document.getElementById('frame');
    const banner = document.getElementById('banner');
    const overlay = document.getElementById('overlay');
    const end = document.getElementById('end');
    const which = document.getElementById('which');
    const hearts = document.getElementById('hearts');

    let timers = [];
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function clearTimers(){ timers.forEach(t => clearTimeout(t)); timers = []; }

    function setVideo(id){
      frame.src = `https://streamable.com/e/${id}?autoplay=1&hd=1`;
    }

    function requestFs(){
      const el = document.getElementById('player');
      const rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      if (rfs) { try { rfs.call(el); } catch(e) {} }
    }

    function showPlayer(){
      start.style.display = 'none';
      player.classList.add('show');
    }

    function hideModal(){
      banner.classList.remove('show');
      overlay.classList.remove('show');
    }
    function showModal(){
      overlay.classList.add('show');
      banner.classList.add('show');
    }

    function playPart1(){
      clearTimers();
      hideModal();
      end.classList.remove('show');
      which.textContent = "Deel 1";
      setVideo(VIDEO1_ID);
      showPlayer();
      timers.push(setTimeout(() => showModal(), PART1_LENGTH * 1000));
    }

    function playPart2(){
      clearTimers();
      hideModal();
      end.classList.remove('show');
      which.textContent = "Deel 2";
      setVideo(VIDEO2_ID);
      timers.push(setTimeout(() => end.classList.add('show'), PART2_LENGTH * 1000));
    }

    function burstHearts(){
      // cleanup
      hearts.innerHTML = "";
      const glyphs = ["💛","💥","✨","💛","💛","✨"];
      const count = 26;

      for(let i=0;i<count;i++){
        const s = document.createElement("span");
        s.className = "heart";
        s.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];

        const dx = (Math.random()*2 - 1) * 260;         // -260..260 px
        const dy = -(140 + Math.random()*320);           // -140..-460 px
        const rot = (Math.random()*2 - 1) * 120;         // -120..120 deg
        const dur = 650 + Math.random()*450;             // 650..1100 ms
        const size = 18 + Math.random()*18;              // 18..36 px

        s.style.setProperty("--dx", dx.toFixed(0) + "px");
        s.style.setProperty("--dy", dy.toFixed(0) + "px");
        s.style.setProperty("--rot", rot.toFixed(0) + "deg");
        s.style.setProperty("--dur", dur.toFixed(0) + "ms");
        s.style.fontSize = size.toFixed(0) + "px";

        // spreid startpunten een tikje rond het midden
        const jitterX = (Math.random()*2 - 1) * 18;
        const jitterY = (Math.random()*2 - 1) * 10;
        s.style.left = `calc(50% + ${jitterX.toFixed(0)}px)`;
        s.style.top  = `calc(55% + ${jitterY.toFixed(0)}px)`;

        hearts.appendChild(s);
      }
      // auto cleanup na anim
      setTimeout(() => { hearts.innerHTML = ""; }, 1400);
    }

    async function closeExperience(){
      burstHearts();
      // kleine fade-out feel
      end.classList.remove('show');
      hideModal();
      await sleep(750);

      // stop video en terug naar start
      frame.src = "";
      player.classList.remove('show');
      start.style.display = 'grid';

      // reset envelope anim zodat je opnieuw kunt openen
      env.classList.remove('opening');
    }

    document.getElementById('openGift').addEventListener('click', async () => {
      // envelope open animation + luxe “magie laden”
      env.classList.add('opening');
      loader.classList.add('show');
      await sleep(1100);
      loader.classList.remove('show');

      playPart1();
      requestFs(); // best effort
    });

    document.getElementById('replay1').addEventListener('click', playPart1);
    document.getElementById('play2').addEventListener('click', playPart2);
    document.getElementById('again').addEventListener('click', () => location.reload());
    document.getElementById('closeEnd').addEventListener('click', closeExperience);
    document.getElementById('fsBtn').addEventListener('click', requestFs);

    // klik op overlay sluit de modal niet (bewust) — focus op "Open deel 2"
