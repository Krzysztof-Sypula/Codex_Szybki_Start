'use strict';
let size = 9;
let mineCount = 10;
const board = document.querySelector('#board');
const status = document.querySelector('#status');
const flagButton = document.querySelector('#flag-mode');
let cells, started, ended, flagMode;

function neighbors(index) {
  const row = Math.floor(index / size), col = index % size;
  const result = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = row + dr, c = col + dc;
      if ((dr || dc) && r >= 0 && r < size && c >= 0 && c < size) result.push(r * size + c);
    }
  }
  return result;
}

function placeMines(first) {
  const candidates = cells.map((_, i) => i).filter(i => i !== first);
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  candidates.slice(0, mineCount).forEach(i => { cells[i].mine = true; });
  cells.forEach((cell, i) => { cell.count = neighbors(i).filter(n => cells[n].mine).length; });
  started = true;
}

function render(message) {
  cells.forEach((cell, i) => {
    const showMine = ended && cell.mine;
    cell.button.textContent = showMine ? '*' : cell.flag ? '⚑' : cell.open && cell.count ? cell.count : '';
    cell.button.className = `cell${cell.open ? ' open' : ''}${showMine ? ' mine' : ''}${cell.flag ? ' flag' : ''}`;
    const state = showMine ? 'mina' : cell.flag ? 'flaga' : cell.open ? `${cell.count} sąsiednich min` : 'zakryte';
    cell.button.setAttribute('aria-label', `Wiersz ${Math.floor(i / size) + 1}, kolumna ${i % size + 1}: ${state}`);
  });
  flagButton.setAttribute('aria-pressed', String(flagMode));
  flagButton.textContent = `Tryb flagowania: ${flagMode ? 'tak' : 'nie'}`;
  status.textContent = message || `Miny: ${mineCount} · Flagi: ${cells.filter(c => c.flag).length} · ${started ? 'Szukaj bezpiecznych pól.' : 'Pierwsze odkrycie jest bezpieczne.'}`;
}

function toggleFlag(index) {
  if (ended || cells[index].open) return;
  cells[index].flag = !cells[index].flag;
  playSound(450);
  render();
}

function reveal(index) {
  if (ended || cells[index].flag || cells[index].open) return;
  if (!started) placeMines(index);
  if (cells[index].mine) {
    cells[index].open = true;
    ended = true;
    playSound(120, 0.3);
    render('Przegrana. Trafiona mina. Spróbuj nowej gry.');
    return;
  }
  const pending = [index];
  while (pending.length) {
    const i = pending.pop(), cell = cells[i];
    if (cell.open || cell.flag || cell.mine) continue;
    cell.open = true;
    if (cell.count === 0) pending.push(...neighbors(i));
  }
  if (cells.filter(c => c.open).length === size * size - mineCount) {
    ended = true;
    playSound(880, 0.3);
    render('Wygrana! Wszystkie bezpieczne pola odkryte.');
  } else { playSound(600); render(); }
}

function reset() {
  started = ended = flagMode = false;
  board.style.setProperty('--size', size);
  document.querySelector('#summary').textContent = `${size} × ${size} pól · ${mineCount} min. Jeden spokojny ruch naraz.`;
  board.replaceChildren();
  cells = Array.from({ length: size * size }, (_, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.addEventListener('click', () => flagMode ? toggleFlag(i) : reveal(i));
    button.addEventListener('contextmenu', event => { event.preventDefault(); toggleFlag(i); });
    board.append(button);
    return { button, mine: false, open: false, flag: false, count: 0 };
  });
  render();
}
document.querySelector('#restart').addEventListener('click', reset);
flagButton.addEventListener('click', () => {
  if (ended) return;
  flagMode = !flagMode;
  render();
});
const sizeInput = document.querySelector('#size');
const minesInput = document.querySelector('#mines');
function updateLimit() {
  const proposed = Number(sizeInput.value);
  if (!Number.isInteger(proposed) || proposed < 2 || proposed > 30) return;
  const max = Math.floor(proposed * proposed / 2);
  minesInput.max = max;
  if (Number(minesInput.value) > max) minesInput.value = max;
  document.querySelector('#mine-limit').textContent = `Od 0 do ${max} min (${proposed * proposed} pól).`;
}
sizeInput.addEventListener('input', updateLimit);
document.querySelector('#standard').addEventListener('click', () => {
  if (!sizeInput.reportValidity()) return;
  updateLimit();
  minesInput.value = Math.round(Number(sizeInput.value) ** 2 * 10 / 81);
});
document.querySelector('#settings').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  size = Number(sizeInput.value);
  mineCount = Number(minesInput.value);
  reset();
});
document.querySelector('#theme').addEventListener('change', event => {
  document.body.dataset.theme = event.target.value;
});
let audioContext;
let soundEnabled = false;
const soundButton = document.querySelector('#sound');
function playSound(frequency, duration = 0.08) {
  if (!soundEnabled || !audioContext || audioContext.state !== 'running') return;
  const volume = Number(document.querySelector('#volume').value) / 100;
  if (!volume) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume * 0.15, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}
soundButton.addEventListener('click', async () => {
  soundButton.disabled = true;
  try {
    if (!soundEnabled) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error('Audio unavailable');
      audioContext ||= new Audio();
      await audioContext.resume();
      soundEnabled = true;
    } else {
      soundEnabled = false;
      await audioContext.suspend();
    }
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    soundButton.textContent = `Dźwięk: ${soundEnabled ? 'włączony' : 'wyłączony'}`;
    playSound(700);
  } catch {
    soundEnabled = false;
    soundButton.setAttribute('aria-pressed', 'false');
    soundButton.textContent = 'Dźwięk niedostępny — spróbuj ponownie';
  } finally { soundButton.disabled = false; }
});
reset();
