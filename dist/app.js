// Zadanie: Przechowywanie danych w tablicy obiektów
const quizQuestions = [
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
        // Dodajemy sprawdzenie, czy odpowiedź dla tego przycisku istnieje
        if (currentQuestion && currentQuestion.answers[index]) {
            btn.innerText = currentQuestion.answers[index];
        }
    });
}
displayQuestion();
export {};
//# sourceMappingURL=app.js.map