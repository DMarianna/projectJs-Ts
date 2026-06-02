export interface QuizQuestion {
  category: string;
  question: string;
  answers: string[];
  correctAnswerIndex: number;
  hint?: string; // Dodane opcjonalne pole na podpowiedź
}

// Zaktualizowana funkcja pomocnicza przyjmująca 4 argumenty (ostatni to hint)
const createQuestionFor = (category: string) => {
  return (question: string, answers: string[], correctAnswerIndex: number, hint?: string): QuizQuestion => {
      return { category, question, answers, correctAnswerIndex, hint };
  };
};

const sportQ = createQuestionFor("Sport");
const musicQ = createQuestionFor("Music");
const animalQ = createQuestionFor("Animals");
const historyQ = createQuestionFor("History");

export const allQuestions: QuizQuestion[] = [
  // --- SPORT ---
  sportQ("Which sport is known as the 'beautiful game'?", ["Basketball", "Tennis", "Football", "Golf"], 2, "Pele loved this game."),
  sportQ("How many players are on a basketball team on the court?", ["5", "6", "7", "11"], 0, "Exactly half of 10."),
  sportQ("In which city were the first modern Olympics held?", ["Paris", "London", "Athens", "Berlin"], 2, "Capital of Greece."),
  sportQ("How many rings are on the Olympic flag?", ["4", "5", "6", "7"], 1, "One for each major continent."),
  sportQ("Which tennis tournament is played on grass?", ["French Open", "US Open", "Wimbledon", "Australian Open"], 2, "Think of London."),
  
  // --- MUSIC ---
  musicQ("Who is known as the King of Pop?", ["Elvis Presley", "Michael Jackson", "Prince", "Freddie Mercury"], 1, "Initials M.J."),
  musicQ("Which band recorded the album 'Abbey Road'?", ["The Rolling Stones", "The Beatles", "Pink Floyd", "Queen"], 1, "John, Paul, George, Ringo."),
  musicQ("How many strings does a standard violin have?", ["3", "4", "5", "6"], 1, "Less than 5."),
  musicQ("Who wrote the famous 'Moonlight Sonata'?", ["Mozart", "Chopin", "Beethoven", "Bach"], 2, "He went deaf later in life."),
  musicQ("Which instrument is often associated with Jazz?", ["Flute", "Saxophone", "Cello", "Harp"], 1, "Lisa Simpson plays it."),

  // --- ANIMALS ---
  animalQ("What is the fastest land animal?", ["Cheetah", "Lion", "Horse", "Eagle"], 0, "A big cat with spots."),
  animalQ("Which mammal can truly fly?", ["Flying Squirrel", "Bat", "Lemur", "Sugar Glider"], 1, "They sleep upside down."),
  animalQ("What is the largest animal in the world?", ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"], 1, "It lives in the ocean."),
  animalQ("Which animal is known as the 'Ship of the Desert'?", ["Horse", "Camel", "Donkey", "Elephant"], 1, "It has humps."),
  animalQ("How many legs does a spider have?", ["6", "8", "10", "12"], 1, "More than an insect (8)."),

  // --- HISTORY ---
  historyQ("In which year did World War II end?", ["1940", "1945", "1918", "1939"], 1, "Mid-1940s."),
  historyQ("Who was the first President of the United States?", ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], 2, "He is on the $1 bill."),
  historyQ("Which country gifted the Statue of Liberty to the USA?", ["Germany", "France", "Italy", "Spain"], 1, "They built the Eiffel Tower."),
  historyQ("What was the capital of the Roman Empire?", ["Athens", "Carthage", "Rome", "Alexandria"], 2, "All roads lead to..."),
  historyQ("In which year did the moon landing happen?", ["1969", "1972", "1959", "1961"], 0, "End of the 60s.")
];