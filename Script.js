/* ==========================================
   1. AMBIL NAMA TAMU DARI URL PARAMETER
   ========================================== */
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to');
  if (guestParam) {
    document.getElementById('guest-name').textContent = guestParam;
  }
});

/* ==========================================
   2. COVER & AUDIO CONTROL (Web Audio API Synth)
   ========================================== */
let isPlaying = false;
let audioCtx = null;
let synthInterval = null;

function playSynthMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Melodi Romantis Sederhana
  const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63]; 
  let index = 0;

  synthInterval = setInterval(() => {
    if (!isPlaying) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[index], audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
    
    index = (index + 1) % notes.length;
  }, 800);
}

function openInvitation() {
  // Buka Cover
  document.getElementById('welcome-cover').classList.add('opened');
  
  // Play Music
  isPlaying = true;
  document.getElementById('musicBtn').classList.add('playing');
  playSynthMusic();
}

function toggleMusic() {
  const btn = document.getElementById('musicBtn');
  isPlaying = !isPlaying;
  
  if (isPlaying) {
    btn.classList.add('playing');
    playSynthMusic();
  } else {
    btn.classList.remove('playing');
    if (synthInterval) clearInterval(synthInterval);
  }
}

/* ==========================================
   3. COUNTDOWN TIMER
   ========================================== */
const targetDate = new Date("05-November, 2026 08:00:00").getTime();

const countdown = setInterval(() => {
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff < 0) {
    clearInterval(countdown);
    document.getElementById("countdown").innerHTML = "<p>Acara Telah Berlangsung</p>";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days < 10 ? '0' + days : days;
  document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
  document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
  document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;
}, 1000);

/* ==========================================
   4. LIGHTBOX GALERI
   ========================================== */
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  lightbox.classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

/* ==========================================
   5. RSVP & BUKU TAMU INTERAKTIF
   ========================================== */
function handleRSVP(e) {
  e.preventDefault();
  
  const name = document.getElementById('rsvpName').value;
  const status = document.getElementById('rsvpStatus').value;
  const message = document.getElementById('rsvpMessage').value;

  if(!name || !status || !message) return;

  // Buat Kartu Pesan Baru
  const wishesList = document.getElementById('wishesList');
  const wishCard = document.createElement('div');
  wishCard.className = 'wish-card';
  wishCard.innerHTML = `
    <div class="wish-header">
      <span class="wish-name">${escapeHtml(name)}</span>
      <span class="wish-status">${escapeHtml(status)}</span>
    </div>
    <p style="font-size: 0.9rem; color: #4A5568;">${escapeHtml(message)}</p>
  `;

  // Sisipkan ke Paling Atas
  wishesList.insertBefore(wishCard, wishesList.firstChild);

  // Reset Form
  document.getElementById('rsvpForm').reset();
  showToast("Terima kasih atas doa & konfirmasinya!");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================
   6. COPY TO CLIPBOARD & TOAST
   ========================================== */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Nomor rekening berhasil disalin!");
  }).catch(() => {
    showToast("Gagal menyalin teks.");
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
