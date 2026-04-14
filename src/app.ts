const questionElement = document.getElementById('question-text') as HTMLParagraphElement;

function startQuiz(): void {
    questionElement.innerText = "What is the capital of France?";
}

startQuiz();