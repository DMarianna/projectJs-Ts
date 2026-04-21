interface QuizQuestion {
    question: string;
    answers: string[];
}

const quizQuestions: QuizQuestion[] = [
    {
        question: "What is the capital of France?",
        answers: ["Berlin", "Madrid", "Paris", "Rome"]
    }
];

function displayQuestion() {
    const questionText = document.getElementById('question-text');
    const buttons = document.querySelectorAll('.btn');

    // Sprawdzamy czy mamy pytanie w tablicy
    const currentQuestion = quizQuestions[0];

    if (questionText && currentQuestion) {
        questionText.innerText = currentQuestion.question;
    }

    buttons.forEach((btn, index) => {
        if (currentQuestion && currentQuestion.answers[index]) {
            (btn as HTMLButtonElement).innerText = currentQuestion.answers[index];
        }
    });
}

displayQuestion();