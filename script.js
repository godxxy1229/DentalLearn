// HTML 요소 가져오기
const questionContainer = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const feedbackContainer = document.getElementById('feedback');
const nextButton = document.getElementById('next');
const saveProgressButton = document.getElementById('save-progress');
const loadProgressButton = document.getElementById('load-progress');
const difficultySelect = document.getElementById('difficulty');
const strictnessSelect = document.getElementById('strictness');
const encodedAPIKey = "QUl6YVN5RERHMDdNSk5vdW56YlVsQ1JuYnlhcHdfYnZaeTlvQV93";

// 학습할 단어 목록
let words = [];
let currentWord = {};

// 초기화 함수 - JSON 파일에서 단어 데이터를 불러오고, 첫 문제를 표시
fetch('words.json')
  .then(response => response.json())
  .then(data => {
    words = data;
    loadNewWord();
  })
  .catch(error => console.error('단어 데이터를 불러오는 중 오류 발생:', error));

// 새로운 문제를 로드
function loadNewWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex];

  // 난이도에 따른 설명 수준 조정
  let description = currentWord.definition;
  if (difficultySelect.value === 'medium' && currentWord.additional_info) {
    description += ' ' + currentWord.additional_info;
  } else if (difficultySelect.value === 'hard') {
    description = '전문적인 설명: ' + currentWord.definition;
  }

  // 문제 표시 및 입력 필드 초기화
  questionContainer.innerText = description;
  answerInput.value = '';
  feedbackContainer.innerText = '';
}

// 사용자의 답을 Gemini API를 사용해 평가
function evaluateAnswer(answer) {
  const apiKey = atob(encodedAPIKey);
  const model = 'gemini-1.5-flash';
  const strictness = strictnessSelect.value;

  // 평가 프롬프트 설정
  const prompt = `
    다음 설명에 해당하는 용어는 무엇입니까?
    설명: ${currentWord.definition}
    사용자 답변: ${answer}
    ${strictness === 'lenient' ? '비슷한 답변도 인정해주세요.' : '정확한 답변만 정답으로 인정해주세요.'}
  `;

  // Gemini API 요청
  fetch(https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      temperature: 0.7,
      maxOutputTokens: 50
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`API 요청 오류: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].output) {
        feedbackContainer.innerText = data.candidates[0].output;
      } else {
        feedbackContainer.innerText = 'API에서 유효한 응답을 받지 못했습니다.';
      }
    })
    .catch(error => {
      console.error('API 요청 중 오류 발생:', error);
      feedbackContainer.innerText = '오류가 발생했습니다. 다시 시도해주세요.';
    });
}

// 제출 버튼 이벤트 설정
submitButton.addEventListener('click', () => {
  const userAnswer = answerInput.value.trim();
  evaluateAnswer(userAnswer);
});

// 다음 문제 버튼 이벤트 설정
nextButton.addEventListener('click', loadNewWord);

// 진행 상황 저장
saveProgressButton.addEventListener('click', () => {
  const progress = {
    currentWordIndex: words.indexOf(currentWord),
    difficulty: difficultySelect.value,
    strictness: strictnessSelect.value,
  };
  localStorage.setItem('studyProgress', JSON.stringify(progress));
  feedbackContainer.innerText = '진행 상황이 저장되었습니다!';
});

// 진행 상황 불러오기
loadProgressButton.addEventListener('click', () => {
  const savedProgress = JSON.parse(localStorage.getItem('studyProgress'));
  if (savedProgress) {
    currentWord = words[savedProgress.currentWordIndex];
    difficultySelect.value = savedProgress.difficulty;
    strictnessSelect.value = savedProgress.strictness;
    loadNewWord();
    feedbackContainer.innerText = '저장된 진행 상황이 불러와졌습니다!';
  } else {
    feedbackContainer.innerText = '저장된 진행 상황이 없습니다.';
  }
});
