import { supabase } from './auth.js';

const quizContainer = document.getElementById('quiz-container');
const feedback = document.getElementById('quiz-feedback');

let currentQuestionIndex = 0;
let userScore = 0;
let questions = [];
let quizId;

async function loadQuiz() {
  const params = new URLSearchParams(window.location.search);
  quizId = params.get('quiz_id');

  if (!quizId) {
    feedback.textContent = 'No quiz selected.';
    return;
  }

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId);

    if (error) throw error;
    if (!data || data.length === 0) {
      feedback.textContent = 'No questions available for this quiz.';
      return;
    }

    questions = data;
    renderQuestion();
  } catch (err) {
    feedback.textContent = `Error loading quiz: ${err.message}`;
  }
}

function renderQuestion() {
  quizContainer.innerHTML = '';

  if (currentQuestionIndex >= questions.length) {
    saveProgress();
    quizContainer.innerHTML = `<p>Quiz completed! Your score: ${userScore} / ${questions.length}</p>`;
    return;
  }

  const q = questions[currentQuestionIndex];
  const qDiv = document.createElement('div');
  qDiv.classList.add('quiz-question');

  const questionEl = document.createElement('p');
  questionEl.textContent = `${currentQuestionIndex + 1}. ${q.question_text}`;
  qDiv.appendChild(questionEl);

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'quiz-option');
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(opt, q.correct_option, btn));
    qDiv.appendChild(btn);
  });

  quizContainer.appendChild(qDiv);
}

function selectAnswer(selected, correct, btnEl) {
  const allBtns = btnEl.parentElement.querySelectorAll('button');
  allBtns.forEach(b => b.classList.remove('selected'));
  btnEl.classList.add('selected');

  setTimeout(() => {
    if (selected === correct) userScore++;
    currentQuestionIndex++;
    renderQuestion();
  }, 300);
}

async function saveProgress() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) {
    feedback.textContent = 'User not logged in. Progress not saved.';
    return;
  }

  await supabase.from('user_progress').upsert({
    user_id: session.user.id,
    quiz_id: quizId,
    score: userScore,
    completed: true,
    completed_at: new Date().toISOString()
  });

  feedback.textContent = `Progress saved! Score: ${userScore}`;
}

document.addEventListener('DOMContentLoaded', loadQuiz);
