// 치과 용어 학습 웹 JavaScript

// 데이터를 JSON 파일로 불러오기 (치과 용어 목록)
let dentalTerms = [];
fetch('치과용어.json')
    .then(response => response.json())
    .then(data => {
        dentalTerms = data;
    });

// DOM 요소들 참조
const startLearningButton = document.getElementById('start-learning');
const takeQuizButton = document.getElementById('take-quiz');
const wordCardSection = document.getElementById('word-card');
const termElement = document.getElementById('term');
const definitionElement = document.getElementById('definition');
const nextWordButton = document.getElementById('next-word');
const addFavoriteButton = document.getElementById('add-favorite');
const quizSection = document.getElementById('quiz-section');
const quizQuestionElement = document.getElementById('quiz-question');
const quizOptionsElement = document.getElementById('quiz-options');
const nextQuizButton = document.getElementById('next-quiz');
const favoritesSection = document.getElementById('favorites-section');
const favoritesListElement = document.getElementById('favorites-list');
const profileSection = document.getElementById('profile-section');
const learnedWordsElement = document.getElementById('learned-words');
const quizScoreElement = document.getElementById('quiz-score');

// 상태 변수
let currentWordIndex = 0;
let favorites = [];
let quizIndex = 0;
let correctAnswers = 0;
let totalQuestions = 0;

// 이벤트 핸들러 설정
document.addEventListener('DOMContentLoaded', () => {
    // 모든 이벤트 핸들러 및 초기화 코드를 여기로 이동
    startLearningButton.addEventListener('click', startLearning);
    takeQuizButton.addEventListener('click', startQuiz);
    nextWordButton.addEventListener('click', showNextWord);
    addFavoriteButton.addEventListener('click', addToFavorites);
    nextQuizButton.addEventListener('click', nextQuiz);
});

function startLearning() {
    wordCardSection.style.display = 'block';
    quizSection.style.display = 'none';
    favoritesSection.style.display = 'none';
    profileSection.style.display = 'none';
    showNextWord();
}

function showNextWord() {
    if (currentWordIndex >= dentalTerms.length) {
        currentWordIndex = 0; // 다시 처음부터
    }
    const word = dentalTerms[currentWordIndex];
    termElement.textContent = word['용어'];
    definitionElement.textContent = word['정의'];
    currentWordIndex++;
}

function addToFavorites() {
    const currentTerm = termElement.textContent;
    if (!favorites.includes(currentTerm)) {
        favorites.push(currentTerm);
        updateFavoritesList();
    }
}

function updateFavoritesList() {
    favoritesListElement.innerHTML = '';
    favorites.forEach(fav => {
        const li = document.createElement('li');
        li.textContent = fav;
        favoritesListElement.appendChild(li);
    });
}

function startQuiz() {
    wordCardSection.style.display = 'none';
    quizSection.style.display = 'block';
    favoritesSection.style.display = 'none';
    profileSection.style.display = 'none';
    totalQuestions = 0;
    correctAnswers = 0;
    nextQuiz();
}

function nextQuiz() {
    if (quizIndex >= dentalTerms.length) {
        quizIndex = 0;
    }
    const word = dentalTerms[quizIndex];
    quizQuestionElement.textContent = `문제: "${word['정의']}"에 해당하는 용어를 맞춰보세요!`;
    quizOptionsElement.innerHTML = '';
    const options = getQuizOptions(word['용어']);
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('btn');
        button.addEventListener('click', () => checkAnswer(option, word['용어']));
        quizOptionsElement.appendChild(button);
    });
    quizIndex++;
}

function getQuizOptions(correctAnswer) {
    const options = [correctAnswer];
    while (options.length < 4) {
        const randomIndex = Math.floor(Math.random() * dentalTerms.length);
        const randomTerm = dentalTerms[randomIndex]['용어'];
        if (!options.includes(randomTerm)) {
            options.push(randomTerm);
        }
    }
    return shuffleArray(options);
}

function checkAnswer(selected, correct) {
    totalQuestions++;
    if (selected === correct) {
        correctAnswers++;
        alert('정답입니다!');
    } else {
        alert('틀렸습니다. 정답은 ' + correct + '입니다.');
        if (!favorites.includes(correct)) {
            favorites.push(correct);
            updateFavoritesList();
        }
    }
    updateQuizScore();
}

function updateQuizScore() {
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    quizScoreElement.textContent = `${score}%`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
