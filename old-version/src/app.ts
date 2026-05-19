interface QuizQuestion {
    category: string;
    question: string;
    answers: string[];
    correctAnswerIndex: number;
}

const createQuestionFor = (category: string) => {
    return (question: string, answers: string[], correctAnswerIndex: number): QuizQuestion => {
        return {
            category: category, // Tutaj domknięcie (closure) pamięta kategorię!
            question: question,
            answers: answers,
            correctAnswerIndex: correctAnswerIndex
        };
    };
};

const sportQ = createQuestionFor("Sport");
const musicQ = createQuestionFor("Music");
const animalQ = createQuestionFor("Animals");
const historyQ = createQuestionFor("History");

const allQuestions: QuizQuestion[] = [
    sportQ("Which sport is known as the 'beautiful game'?", ["Basketball", "Tennis", "Football", "Golf"], 2),
    sportQ("How many players are on a basketball team on the court?", ["5", "6", "7", "11"], 0),
    sportQ("In which city were the first modern Olympics held?", ["Paris", "London", "Athens", "Berlin"], 2),
    sportQ("How many rings are on the Olympic flag?", ["4", "5", "6", "7"], 1),
    sportQ("Which tennis tournament is played on grass?", ["French Open", "US Open", "Wimbledon", "Australian Open"], 2),
    
    musicQ("Who is known as the King of Pop?", ["Elvis Presley", "Michael Jackson", "Prince", "Freddie Mercury"], 1),
    musicQ("Which band recorded the album 'Abbey Road'?", ["The Rolling Stones", "The Beatles", "Pink Floyd", "Queen"], 1),
    musicQ("How many strings does a standard violin have?", ["3", "4", "5", "6"], 1),
    musicQ("Who wrote the famous 'Moonlight Sonata'?", ["Mozart", "Chopin", "Beethoven", "Bach"], 2),
    musicQ("Which instrument is often associated with Jazz?", ["Flute", "Saxophone", "Cello", "Harp"], 1),

    animalQ("What is the fastest land animal?", ["Cheetah", "Lion", "Horse", "Eagle"], 0),
    animalQ("Which mammal can truly fly?", ["Flying Squirrel", "Bat", "Lemur", "Sugar Glider"], 1),
    animalQ("What is the largest animal in the world?", ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"], 1),
    animalQ("Which animal is known as the 'Ship of the Desert'?", ["Horse", "Camel", "Donkey", "Elephant"], 1),
    animalQ("How many legs does a spider have?", ["6", "8", "10", "12"], 1),

    historyQ("In which year did World War II end?", ["1940", "1945", "1918", "1939"], 1),
    historyQ("Who was the first President of the United States?", ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], 2),
    historyQ("Which country gifted the Statue of Liberty to the USA?", ["Germany", "France", "Italy", "Spain"], 1),
    historyQ("What was the capital of the Roman Empire?", ["Athens", "Carthage", "Rome", "Alexandria"], 2),
    historyQ("In which year did the moon landing happen?", ["1969", "1972", "1959", "1961"], 0)
];

let currentCategory = "";
let currentQuestions: QuizQuestion[] = [];
let currentQuestionIndex = 0;
let score = 0;

const screenHome = document.getElementById('screen-home');
const screenCategories = document.getElementById('screen-categories');
const screenRecords = document.getElementById('screen-records');
const screenQuiz = document.getElementById('screen-quiz');
const screenEnd = document.getElementById('screen-end');

function showScreen(screenElement: HTMLElement | null) {
    screenHome?.classList.remove('active');
    screenCategories?.classList.remove('active');
    screenRecords?.classList.remove('active');
    screenQuiz?.classList.remove('active');
    screenEnd?.classList.remove('active');
    screenElement?.classList.add('active');
}

function saveRecord(category: string, score: number, total: number): string {
    const savedRecords = JSON.parse(localStorage.getItem('quizManiaRecords') || '{}');
    let message = "";

    if (savedRecords[category]) {
        const oldScore = savedRecords[category].score;
        if (score > oldScore) {
            message = "Wow, you're getting there! Better than last time! 🚀";
        } else if (score === oldScore && score !== 0) {
            message = "Consistent! You matched your best score.";
        }
    } else if (score > 0) {
        message = "First time playing this category? Great start!";
    }

    savedRecords[category] = { score: score, total: total };
    localStorage.setItem('quizManiaRecords', JSON.stringify(savedRecords));
    
    return message;
}

function loadAndDisplayRecords() {
    const recordsContainer = document.getElementById('records-list');
    if (!recordsContainer) return;
    recordsContainer.innerHTML = '';
    
    const savedRecords = JSON.parse(localStorage.getItem('quizManiaRecords') || '{}');
    const categories = Object.keys(savedRecords);
    
    if (categories.length === 0) {
        recordsContainer.innerHTML = '<p style="color: var(--primary); font-weight: bold;">No records yet!</p>';
        return;
    }
    
    categories.forEach((cat, index) => {
        const data = savedRecords[cat];
        const div = document.createElement('div');
        div.className = 'record-item';
        div.innerHTML = `${cat} <br> ${data.score}/${data.total}`;
        div.style.animationDelay = `${(index + 1) * 0.2}s`;
        recordsContainer.appendChild(div);
    });
}

document.getElementById('btn-home-start')?.addEventListener('click', () => {
    resetCategorySelection();
    showScreen(screenCategories);
});

document.getElementById('btn-view-records')?.addEventListener('click', () => {
    loadAndDisplayRecords();
    showScreen(screenRecords);
});

document.getElementById('btn-return-home')?.addEventListener('click', () => showScreen(screenHome));
document.getElementById('btn-end-return')?.addEventListener('click', () => showScreen(screenHome));

const categoryButtons = document.querySelectorAll('.btn-category');
const btnCategoryStart = document.getElementById('btn-category-start') as HTMLButtonElement;

function resetCategorySelection() {
    categoryButtons.forEach(b => b.classList.remove('selected'));
    currentCategory = "";
    if (btnCategoryStart) btnCategoryStart.disabled = true;
}

categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        categoryButtons.forEach(b => b.classList.remove('selected'));
        const clickedBtn = e.target as HTMLButtonElement;
        clickedBtn.classList.add('selected');
        currentCategory = clickedBtn.getAttribute('data-category') || "";
        if (btnCategoryStart) btnCategoryStart.disabled = false;
    });
});

btnCategoryStart?.addEventListener('click', () => startQuiz(currentCategory));

function startQuiz(category: string) {
    score = 0;
    currentQuestionIndex = 0;
    
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle) categoryTitle.innerText = category + " Quiz";

    if (category === "Random") {
        currentQuestions = [...allQuestions]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
    } else {
        currentQuestions = allQuestions.filter(q => q.category === category).slice(0, 5);
    }

    showScreen(screenQuiz);
    displayQuestion();
}

function displayQuestion() {
    const questionText = document.getElementById('question-text');
    const answerButtonsContainer = document.getElementById('answer-buttons');
    const feedbackText = document.getElementById('feedback-text');
    const nextBtn = document.getElementById('btn-next') as HTMLButtonElement;
    const scoreText = document.getElementById('score-text');

    if (feedbackText) feedbackText.innerText = "";
    if (nextBtn) nextBtn.style.display = "none";
    if (scoreText) scoreText.innerText = `Score: ${score}`;

    const currentQuestion = currentQuestions[currentQuestionIndex];

    if (questionText && currentQuestion) {
        questionText.innerText = currentQuestion.question;
    }

    if (answerButtonsContainer && currentQuestion) {
        answerButtonsContainer.innerHTML = ''; 
        currentQuestion.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.classList.add('btn', 'btn-primary', 'answer-btn');
            btn.innerText = answer;
            btn.onclick = () => checkAnswer(index, currentQuestion.correctAnswerIndex, btn);
            answerButtonsContainer.appendChild(btn);
        });
    }
}

function checkAnswer(selectedIndex: number, correctIndex: number, clickedBtn: HTMLButtonElement) {
    const feedbackText = document.getElementById('feedback-text');
    const scoreText = document.getElementById('score-text');
    const nextBtn = document.getElementById('btn-next') as HTMLButtonElement;
    const allAnswerBtns = document.querySelectorAll('.answer-btn');

    allAnswerBtns.forEach(btn => (btn as HTMLButtonElement).disabled = true);

    if (selectedIndex === correctIndex) {
        score++;
        if (feedbackText) {
            feedbackText.innerText = "Correct! 🎉";
            feedbackText.style.color = "green";
        }
        clickedBtn.style.backgroundColor = "green";
    } else {
        if (feedbackText) {
            feedbackText.innerText = "Wrong! 😔";
            feedbackText.style.color = "red";
        }
        clickedBtn.style.backgroundColor = "red";
        const correctBtn = allAnswerBtns[correctIndex] as HTMLButtonElement;
        if (correctBtn) correctBtn.style.backgroundColor = "green";
    }

    if (scoreText) scoreText.innerText = `Score: ${score}`;
    if (nextBtn) {
        nextBtn.style.display = "block";
        nextBtn.innerText = currentQuestionIndex === currentQuestions.length - 1 ? "Finish Quiz" : "Next Question";
    }
}

document.getElementById('btn-next')?.addEventListener('click', () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        showFinalScore();
    }
});

function showFinalScore() {
    showScreen(screenEnd);
    
    let progressMsg = saveRecord(currentCategory, score, currentQuestions.length);
    
    let performanceMsg = "";
    
    if (score === currentQuestions.length) {
        performanceMsg = "Congratulations, you nailed it! 🏆";
        progressMsg = "";
    } else if (score <= 2) {
        performanceMsg = "You can do better... 😕";
    } else {
        performanceMsg = "Nice job! 🌟";
    }
    
    const finalScoreText = document.getElementById('final-score-text');
    if (finalScoreText) {
        finalScoreText.innerHTML = `
            <p style="font-size: 22px; font-weight: bold; margin-bottom: 10px; color: #333;">${performanceMsg}</p>
            <p style="font-size: 28px; margin: 15px 0; color: var(--primary);"><strong>${score} / ${currentQuestions.length}</strong></p>
            <p style="color: var(--secondary); font-style: italic; min-height: 24px;">${progressMsg}</p>
        `;
    }
}

showScreen(screenHome);