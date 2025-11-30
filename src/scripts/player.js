/*  Azure-TTS  –  full UI inside player.js  */
let audioElement;
let audioInitialized = false;
let azureKey, azureRegion, voiceName;   // ← no values here

/* ---------------------------------------------------------
   Public BC API
---------------------------------------------------------- */
async function LoadAudio(text, key, region, voice) {
    if (!text) { console.warn('LoadAudio: no text provided'); return; }
    if (!window.SpeechSDK) { console.error('Azure Speech SDK not loaded'); return; }

    // store the new credentials
    azureKey    = key;
    azureRegion = region;
    voiceName   = voice;

    if (!audioInitialized) buildUI();

    synthesiseToBlob(text, blobUrl => {
        audioElement.src = blobUrl;
        audioElement.load();
        document.getElementById('status-message').textContent = 'Audio ready';
    });
}


function Play()  { if (audioElement) audioElement.play(); }
function Pause() { if (audioElement) audioElement.pause(); }
function SetVolume(vol) {
    if (audioElement) audioElement.volume = vol;
    const slider = document.getElementById('volume-control');
    if (slider) slider.value = vol;
}

/* ---------------------------------------------------------
   Azure synthesis → blob URL
---------------------------------------------------------- */
function synthesiseToBlob(text, callback) {
    const cfg = SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
    cfg.speechSynthesisVoiceName = voiceName;
    const synth = new SpeechSDK.SpeechSynthesizer(cfg, null);

    synth.speakTextAsync(
        text,
        result => {
            if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                const blob = new Blob([result.audioData], {type: 'audio/mp3'});
                callback(URL.createObjectURL(blob));
            } else {
                console.error("Azure synthesis failed:", result.errorDetails);
            }
            synth.close();
        },
        err => { console.error("Azure error:", err); synth.close(); }
    );
}

/* ---------------------------------------------------------
   Build the HTML body for the player
---------------------------------------------------------- */
function buildUI() {
    const d365 = {
        primary: '#00B7C3', secondary: '#505C6D', standard: '#212121', white: '#FFFFFF',
        subordinate: '#A7ADB6', borderColor: '#E5E5E5', unfavorable: '#EB6965'
    };
    const typo = { baseFontSize: '14px', smallFontSize: '12px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' };
    const layout = { baseSpacing: '8px', borderRadius: '2px', controlHeight: '32px' };

    document.body.innerHTML = `
    <div style="width:100%;box-sizing:border-box;padding:${layout.baseSpacing};background:${d365.white};font-family:${typo.fontFamily};color:${d365.standard};">
      <audio id="bc-audio-element" style="display:none;"></audio>

      <!-- title / time -->
      <div style="margin-bottom:${layout.baseSpacing};display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;">
          <svg width="16" height="16" fill="${d365.primary}" viewBox="0 0 16 16"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"/><path d="M6.5 5.5a1 1 0 112 0v5a1 1 0 11-2 0v-5zM9.5 5.5a1 1 0 112 0v5a1 1 0 11-2 0v-5z"/></svg>
          <span style="font-size:${typo.baseFontSize};margin-left:4px;">Audio Player</span>
        </div>
        <div id="time-display" style="font-size:${typo.smallFontSize};color:${d365.subordinate};">0:00 / 0:00</div>
      </div>

      <!-- progress bar -->
      <div id="progress-container" style="width:100%;height:4px;background:${d365.borderColor};border-radius:${layout.borderRadius};margin-bottom:${layout.baseSpacing};cursor:pointer;">
        <div id="progress-bar" style="width:0%;height:100%;background:${d365.primary};border-radius:${layout.borderRadius}"></div>
      </div>

      <!-- controls -->
      <div style="display:flex;gap:${layout.baseSpacing};margin-bottom:${layout.baseSpacing};">
        <button id="play-btn"  style="flex:1;height:${layout.controlHeight};background:${d365.primary};color:${d365.white};border:none;border-radius:${layout.borderRadius};font-size:${typo.baseFontSize};cursor:pointer;">▶ Play</button>
        <button id="pause-btn" style="display:none;flex:1;height:${layout.controlHeight};background:${d365.primary};color:${d365.white};border:none;border-radius:${layout.borderRadius};font-size:${typo.baseFontSize};cursor:pointer;">⏸ Pause</button>
        <button id="stop-btn"  style="flex:1;height:${layout.controlHeight};background:${d365.secondary};color:${d365.white};border:none;border-radius:${layout.borderRadius};font-size:${typo.baseFontSize};cursor:pointer;">⏹ Stop</button>
      </div>

      <!-- volume -->
      <div style="margin-bottom:${layout.baseSpacing};">
        <label style="font-size:${typo.smallFontSize};color:${d365.subordinate};">Volume</label>
        <input type="range" id="volume-control" min="0" max="1" step="0.05" value="1" style="width:100%;">
      </div>

      <!-- status -->
      <div id="status-message" style="font-size:${typo.smallFontSize};color:${d365.subordinate};height:16px;">Waiting for audio</div>
    </div>`;

    /* ---- wire events ---- */
    audioElement = document.getElementById('bc-audio-element');
    const playBtn  = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn  = document.getElementById('stop-btn');
    const volSlider= document.getElementById('volume-control');
    const progress = document.getElementById('progress-bar');
    const progContainer = document.getElementById('progress-container');
    const timeDisp= document.getElementById('time-display');
    const status  = document.getElementById('status-message');

    function fmt(t) { const m=Math.floor(t/60),s=Math.floor(t%60); return `${m}:${s<10?'0':''}${s}`; }
    function togglePlayPause(showPlay) {
        playBtn.style.display  = showPlay ? 'block' : 'none';
        pauseBtn.style.display = showPlay ? 'none' : 'block';
        status.textContent = showPlay ? 'Paused' : 'Now playing';
    }
    audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
            progress.style.width = (audioElement.currentTime/audioElement.duration*100) + '%';
            timeDisp.textContent = `${fmt(audioElement.currentTime)} / ${fmt(audioElement.duration)}`;
        }
    });
    audioElement.addEventListener('ended', () => {
        togglePlayPause(true); status.textContent='Playback ended';
        try{Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('PlaybackEnded',[]);}catch(e){}
    });
    playBtn.onclick  = () => { audioElement.play(); togglePlayPause(false); };
    pauseBtn.onclick = () => { audioElement.pause(); togglePlayPause(true); };
    stopBtn.onclick  = () => { audioElement.pause(); audioElement.currentTime=0; togglePlayPause(true); status.textContent='Stopped'; };
    volSlider.oninput= () => { audioElement.volume=volSlider.value; status.textContent='Volume: '+Math.round(volSlider.value*100)+'%'; };
    progContainer.onclick = e => {
        const r = progContainer.getBoundingClientRect();
        audioElement.currentTime = ((e.clientX - r.left)/r.width) * audioElement.duration;
    };

    audioInitialized = true;
    try{Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('ControlReady',[]);}catch(e){}
}

/* -------------------- bootstrap ------------------------- */
window.addEventListener('load', buildUI);