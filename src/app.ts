interface QuizQuestion {
    question: string;
    answers: string[];
    correctAnswerIndex: number;
}

const quizQuestions: QuizQuestion[] = [
    {
        question: "What is the capital of France?",
        answers: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswerIndex: 2
    }
];

let score = 0; 

function displayQuestion() {
    const questionText = document.getElementById('question-text');
    const buttons = document.querySelectorAll('.btn');
    
    const currentQuestion = quizQuestions[0];

    if (questionText && currentQuestion) {
        questionText.innerText = currentQuestion.question;
    }

    buttons.forEach((btn, index) => {
        const buttonElement = btn as HTMLButtonElement;
        
        if (currentQuestion && currentQuestion.answers[index]) {
            buttonElement.innerText = currentQuestion.answers[index];
            
            buttonElement.onclick = () => {
                checkAnswer(index, currentQuestion.correctAnswerIndex);
            };
        }
    });
}

function checkAnswer(selectedIndex: number, correctIndex: number) {
    const feedbackText = document.getElementById('feedback-text');
    const scoreText = document.getElementById('score-text');

    if (selectedIndex === correctIndex) {
        score++;
        if (feedbackText) {
            feedbackText.innerText = "Correct! 🎉";
            feedbackText.style.color = "green";
        }
    } else {
        if (feedbackText) {
            feedbackText.innerText = "Wrong! 😔";
            feedbackText.style.color = "red";
        }
    }
    if (scoreText) {
        scoreText.innerText = `Score: ${score}`;
    }
}

displayQuestion();