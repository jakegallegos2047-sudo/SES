import { supabase } from './auth.js';

const quizProgressContainer = document.getElementById('quiz-progress');
const gameProgressContainer = document.getElementById('game-progress');

async function loadProgress() {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.user) {
      window.location.href = '/login.html';
      return;
    }

    const userId = session.user.id;

    const { data: quizProgress, error: quizError } = await supabase
      .from('user_progress')
      .select('quiz_id, score, completed, completed_at, quizzes(title)')
      .eq('user_id', userId)
      .not('quiz_id', 'is', null)
      .order('completed_at', { ascending: false });

    if (quizError) throw quizError;

    quizProgressContainer.innerHTML = '';
    if (!quizProgress || quizProgress.length === 0) {
      quizProgressContainer.innerHTML = '<p>No quiz progress yet.</p>';
    } else {
      quizProgress.forEach(q => {
        const div = document.createElement('div');
        div.classList.add('progress-item');
        const completedDate = q.completed_at ? new Date(q.completed_at).toLocaleString() : 'N/A';
        div.innerHTML = `<strong style=\"color:gold;\">${q.quizzes.title}</strong> - Score: ${q.score}${q.score === 5 ? ' <img src=\"/assets/images/perfect-score.png\" alt=\"Perfect Score!\" style=\"width:24px;height:24px;margin-left:6px;\">' : ''} - Completed: ${completedDate}`;
        quizProgressContainer.appendChild(div);
      });
    }

    const { data: gameProgress, error: gameError } = await supabase
      .from('user_progress')
      .select('game_id, score, completed, completed_at, games(title)')
      .eq('user_id', userId)
      .not('game_id', 'is', null)
      .order('completed_at', { ascending: false });

    if (gameError) throw gameError;

    gameProgressContainer.innerHTML = '';
    if (!gameProgress || gameProgress.length === 0) {
      gameProgressContainer.innerHTML = '<p>No game progress yet.</p>';
    } else {
      gameProgress.forEach(g => {
        const div = document.createElement('div');
        div.classList.add('progress-item');
        const completedDate = g.completed_at ? new Date(g.completed_at).toLocaleString() : 'N/A';
        div.innerHTML = `<strong style=\"color:gold;\">${g.games.title}</strong> - Score: ${g.score}${g.score === 100 ? ' <img src=\"/assets/images/perfect-score.png\" alt=\"Perfect Score!\" style=\"width:24px;height:24px;margin-left:6px;\">' : ''} - Completed: ${completedDate}`;
        gameProgressContainer.appendChild(div);
      });
    }

  } catch (err) {
    quizProgressContainer.innerHTML = `<p>Error loading quiz progress: ${err.message}</p>`;
    gameProgressContainer.innerHTML = `<p>Error loading game progress: ${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadProgress);