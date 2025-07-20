let questions = [];
let currentQuestionIndex = 0;
let selectedQuestions = [];
let userAnswers = [];
let wrongQuestions = [];
let reviewMode = false;

async function loadQuestions() {
  const res = await fetch('questions_with_choice_ids.json');
  questions = await res.json();
}

function showTop() {
  document.getElementById('top-screen').classList.remove('hidden');
  document.getElementById('question-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.add('hidden');
  currentQuestionIndex = 0;
  selectedQuestions = [];
  userAnswers = [];
  wrongQuestions = [];
  reviewMode = false;
}

function startQuiz(count) {
  selectedQuestions = shuffle([...questions]);
  if (count !== 'all') selectedQuestions = selectedQuestions.slice(0, count);
  currentQuestionIndex = 0;
  userAnswers = [];
  wrongQuestions = [];
  document.getElementById('top-screen').classList.add('hidden');
  document.getElementById('question-screen').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  const q = selectedQuestions[currentQuestionIndex];
  document.getElementById('question-number').textContent = `問題 ${currentQuestionIndex + 1} / ${selectedQuestions.length}`;
  document.getElementById('question-text').textContent = q.question;
  const choicesList = document.getElementById('choices-list');
  choicesList.innerHTML = '';
  const shuffledChoices = shuffle([...q.choices]);
  shuffledChoices.forEach(choice => {
    const li = document.createElement('li');
    li.textContent = choice.text;
    li.onclick = () => selectAnswer(li, choice.id);
    li.dataset.id = choice.id;
    choicesList.appendChild(li);
  });
  document.getElementById('explanation-box').classList.add('hidden');
}

function selectAnswer(element, selectedId) {
  const q = selectedQuestions[currentQuestionIndex];
  const choiceItems = document.querySelectorAll('#choices-list li');
  choiceItems.forEach(item => item.onclick = null);

  if (selectedId === q.answer) {
    element.classList.add('correct');
  } else {
    element.classList.add('incorrect');
    const correctItem = Array.from(choiceItems).find(i => i.dataset.id === q.answer);
    if (correctItem) correctItem.classList.add('correct');
    wrongQuestions.push(q);
  }

  userAnswers.push({ questionId: q.id, selectedId });
  document.getElementById('explanation-text').textContent = q.explanation;
  document.getElementById('explanation-box').classList.remove('hidden');
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < selectedQuestions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById('question-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');
  const correctCount = selectedQuestions.length - wrongQuestions.length;
  document.getElementById('score-text').textContent = `${correctCount} / ${selectedQuestions.length} 正解`;
}

function startReview() {
  if (wrongQuestions.length === 0) return showTop();
  selectedQuestions = [...wrongQuestions];
  currentQuestionIndex = 0;
  wrongQuestions = [];
  document.getElementById('result-screen').classList.add('hidden');
  document.getElementById('question-screen').classList.remove('hidden');
  reviewMode = true;
  showQuestion();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

loadQuestions();
