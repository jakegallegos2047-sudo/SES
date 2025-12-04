import { supabase, logout } from './auth.js';

const usernameEl = document.getElementById('username');
const quizzesContainer = document.getElementById('quizzes-container');
const gamesContainer = document.getElementById('games-container');
const feedbackEl = document.getElementById('dashboard-feedback');
const logoutBtn = document.getElementById('logout-btn');

async function loadUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) {
    window.location.href = '/login.html';
    return;
  }
  usernameEl.textContent = session.user.email;
}

async function loadQuizzes() {
  const { data: quizzes, error } = await supabase.from('quizzes').select('*');
  if (error) {
    quizzesContainer.innerHTML = `<p>Error loading quizzes: ${error.message}</p>`;
    return;
  }

  if (!quizzes || quizzes.length === 0) {
    quizzesContainer.innerHTML = '<p>No quizzes available.</p>';
    return;
  }

  quizzesContainer.innerHTML = '';
  quizzes.forEach(q => {
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.textContent = q.title;
    btn.addEventListener('click', () => {
      window.location.href = `/quizzes.html?quiz_id=${q.id}`;
    });
    quizzesContainer.appendChild(btn);
  });
}

async function loadGames() {
  const { data: games, error } = await supabase.from('games').select('*');
  if (error) {
    gamesContainer.innerHTML = `<p>Error loading games: ${error.message}</p>`;
    return;
  }

  if (!games || games.length === 0) {
    gamesContainer.innerHTML = '<p>No games available.</p>';
    return;
  }

  gamesContainer.innerHTML = '';
  games.forEach(g => {
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.textContent = g.title;
    btn.addEventListener('click', () => {
      window.location.href = `/games.html?game_id=${g.id}`;
    });
    gamesContainer.appendChild(btn);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await logout();
    window.location.href = '/login.html';
  });
}

const progressBtn = document.getElementById('progress-btn');

if (progressBtn) {
  progressBtn.addEventListener('click', () => {
    window.location.href = '/progress.html';
  });
}


document.addEventListener('DOMContentLoaded', async () => {
  await loadUser();
  await loadQuizzes();
  await loadGames();
});
