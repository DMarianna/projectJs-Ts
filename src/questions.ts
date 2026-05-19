export interface QuizQuestion {
  category: string;
  question: string;
  answers: string[];
  correctAnswerIndex: number;
}

const createQuestionFor = (category: string) => {
  return (question: string, answers: string[], correctAnswerIndex: number): QuizQuestion => {
      return { category, question, answers, correctAnswerIndex };
  };
};

const sportQ = createQuestionFor("Sport");
const musicQ = createQuestionFor("Music");
const animalQ = createQuestionFor("Animals");
const historyQ = createQuestionFor("History");

export const allQuestions: QuizQuestion[] = [
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