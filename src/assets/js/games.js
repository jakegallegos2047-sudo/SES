import { supabase } from './auth.js';

const gameContainer = document.getElementById('game-container');
const feedback = document.getElementById('game-feedback');
const gameTitleEl = document.getElementById('game-title');

let gameId;
let userScore = 0;

async function loadGame() {
  const params = new URLSearchParams(window.location.search);
  gameId = params.get('game_id');

  if (!gameId) {
    feedback.textContent = 'No game selected.';
    return;
  }

  gameContainer.innerHTML = '';
  userScore = 0;

  try {
    const { data: game, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (error || !game) throw new Error(error?.message || 'Game not found');

    gameTitleEl.textContent = game.title;

    if (game.type === 'phishing') startPhishingGame();
    else if (game.type === 'password') startPasswordGame();
    else {
      gameContainer.innerHTML = '<p>Mini-game not implemented yet.</p>';
      styleContainer(gameContainer);
    }

  } catch (err) {
    feedback.textContent = `Error loading game: ${err.message}`;
  }
}

function startPhishingGame() {
  gameContainer.innerHTML = '';
  styleContainer(gameContainer);

  const question = document.createElement('p');
  question.textContent = 'You received an email asking for your password. What do you do?';
  question.style.color = '#cfd2d9';
  question.style.marginBottom = '20px';
  gameContainer.appendChild(question);

  ['Click the link', 'Report as phishing', 'Ignore'].forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    styleButton(btn, 'quiz-option');
    btn.addEventListener('click', () => {
      userScore = option === 'Report as phishing' ? 100 : 50;
      finishGame(userScore);
    });
    gameContainer.appendChild(btn);
  });
}

function startPasswordGame() {
  gameContainer.innerHTML = '';
  styleContainer(gameContainer);

  const prompt = document.createElement('p');
  prompt.textContent = 'Enter a strong password (at least 8 characters):';
  prompt.style.color = '#cfd2d9';
  prompt.style.marginBottom = '15px';
  gameContainer.appendChild(prompt);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Password';
  styleInput(input);
  gameContainer.appendChild(input);

  const btn = document.createElement('button');
  btn.textContent = 'Submit';
  styleButton(btn);
  btn.addEventListener('click', () => {
    userScore = input.value.length >= 8 ? 100 : 50;
    finishGame(userScore);
  });
  gameContainer.appendChild(btn);
}

async function finishGame(score) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      feedback.textContent = 'User not logged in.';
      return;
    }

    await supabase.from('user_progress').upsert({
      user_id: session.user.id,
      game_id: gameId,
      score,
      completed: true,
      completed_at: new Date().toISOString()
    });

    gameContainer.innerHTML = `<p style="color:#70ff70;font-weight:bold;">Game completed! Your score: ${score}</p>`;
  } catch (err) {
    feedback.textContent = `Error saving progress: ${err.message}`;
  }
}

function styleContainer(container) {
  container.style.background = '#1b1f29';
  container.style.padding = '30px';
  container.style.borderRadius = '14px';
  container.style.boxShadow = '0 4px 16px rgba(0,0,0,0.5)';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.gap = '15px';
}

function styleButton(btn, extraClass = '') {
  if (extraClass) btn.classList.add(extraClass); 
  btn.style.width = '100%';
  btn.style.padding = '12px';
  btn.style.border = 'none';
  btn.style.borderRadius = '12px';
  btn.style.background = '#3d6ddf';
  btn.style.color = '#fff';
  btn.style.fontWeight = '600';
  btn.style.cursor = 'pointer';
  btn.style.transition = '0.2s';
  btn.addEventListener('mouseover', () => btn.style.background = '#5a87ff');
  btn.addEventListener('mouseout', () => btn.style.background = '#3d6ddf');
}

function styleInput(input) {
  input.style.width = '100%';
  input.style.padding = '12px';
  input.style.borderRadius = '12px';
  input.style.border = '1px solid #262a35';
  input.style.background = '#14161d';
  input.style.color = '#e1e3e8';
  input.style.marginBottom = '15px';
  input.addEventListener('focus', () => input.style.borderColor = '#3d6ddf');
  input.addEventListener('blur', () => input.style.borderColor = '#262a35');
}

document.addEventListener('DOMContentLoaded', loadGame);