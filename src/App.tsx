// 1. IMPORTY I INTERFEJSY
import { useState, useMemo } from 'react';
import './index.css';
import CategoryButton from './components/CategoryButton';
import { allQuestions, type QuizQuestion } from './questions';

interface PlayerRecords {
  [playerName: string]: {
    [category: string]: { score: number; total: number };
  };
}

export default function App() {
  // 2. STANY APLIKACJI
  const [currentScreen, setCurrentScreen] = useState<'home' | 'categories' | 'quiz' | 'records' | 'end'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  
  const [playerName, setPlayerName] = useState('');
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [loadedRecords, setLoadedRecords] = useState<PlayerRecords>({});

  // 3. INICJALIZACJA QUIZU
  const startQuiz = () => {
    let questionsForQuiz = [];
    if (selectedCategory === "Random") {
        questionsForQuiz = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);
    } else {
        questionsForQuiz = allQuestions.filter(q => q.category === selectedCategory).slice(0, 5);
    }
    
    setCurrentQuestions(questionsForQuiz);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(questionsForQuiz.length).fill(-1));
    setCurrentScreen('quiz');
  };

  // 4. OBSŁUGA ODPOWIEDZI
  const handleSelectAnswer = (answerIndex: number) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answerIndex;
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentScreen('end');
    }
  };

  // 5. OBLICZANIE WYNIKU I WIADOMOŚCI
  const calculateFinalScore = () => {
    let finalScore = 0;
    currentQuestions.forEach((q, i) => { if (userAnswers[i] === q.correctAnswerIndex) finalScore++; });
    return finalScore;
  };
  
  const finalScore = calculateFinalScore();
  
  const getMotivationalMessage = () => {
    const percentage = currentQuestions.length > 0 ? (finalScore / currentQuestions.length) * 100 : 0;
    if (percentage === 100) return "Perfect! You're a genius! 🌟";
    if (percentage >= 80) return "Awesome job! Almost perfect! 🔥";
    if (percentage >= 50) return "Good effort! Keep practicing! 👍";
    return "Don't give up! Try again! 💪";
  };

  // 6. ZAPIS WYNIKÓW
  const handleSaveResult = () => {
    if (!playerName.trim()) return; 

    const formattedName = playerName.trim();
    const records: PlayerRecords = JSON.parse(localStorage.getItem('quizManiaGroupRecords') || '{}');
    
    if (!records[formattedName]) records[formattedName] = {};
    
    records[formattedName][selectedCategory] = {
      score: finalScore,
      total: currentQuestions.length
    };

    // 7. FINALIZACJA ZAPISU
    localStorage.setItem('quizManiaGroupRecords', JSON.stringify(records));
    setPlayerName('');
    setSelectedCategory('');
    setCurrentScreen('home');
  };

  const loadRecordsScreen = () => {
    const records: PlayerRecords = JSON.parse(localStorage.getItem('quizManiaGroupRecords') || '{}');
    setLoadedRecords(records);
    setCurrentScreen('records');
  };

  // 8. OBLICZANIE LEADERBOARDU
  const sortedLeaderboard = useMemo(() => {
    const players = Object.keys(loadedRecords).map(name => {
      const categories = loadedRecords[name];
      let totalPoints = 0;
      Object.values(categories).forEach(cat => totalPoints += cat.score);
      return { name, categories, totalPoints };
    });
    return players.sort((a, b) => b.totalPoints - a.totalPoints);
  }, [loadedRecords]);

  // 9. EKRAN DOMOWY
  return (
    <div className="quiz-container">
      
      {currentScreen === 'home' && (
        <div className="screen active">
          <h2 className="screen-title">Welcome to Quiz Mania</h2>
          <div className="btn-grid-col">
            <button className="btn btn-primary" onClick={() => setCurrentScreen('categories')}>Start</button>
            <button className="btn btn-secondary" onClick={loadRecordsScreen}>Leaderboard</button>
          </div>
        </div>
      )}

      {/* 10. EKRAN KATEGORII */}
      {currentScreen === 'categories' && (
        <div className="screen active">
          <h2 className="screen-title">Choose a category</h2>
          <button className="btn btn-primary top-start-btn" disabled={!selectedCategory} onClick={startQuiz}>
            Start
          </button>
          
          <div className="category-grid">
            {["Sport", "Animals", "Music", "History"].map(cat => (
              <CategoryButton 
                key={cat} categoryName={cat} isSelected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)} 
              />
            ))}
            <CategoryButton 
                categoryName="Random" isSelected={selectedCategory === "Random"} isRandom={true}
                onClick={() => setSelectedCategory("Random")} 
            />
          </div>
        </div>
      )}

      {/* 11. EKRAN QUIZU */}
      {currentScreen === 'quiz' && currentQuestions.length > 0 && (
         <div className="screen active">
            <h2 className="screen-title" style={{ marginBottom: '30px' }}>{selectedCategory} Quiz</h2>
            <p id="question-text">{currentQuestions[currentQuestionIndex].question}</p>
            
            {/* 12. GENEROWANIE ODPOWIEDZI */}
            <div id="answer-buttons" className="btn-grid">
              {currentQuestions[currentQuestionIndex].answers.map((answer, index) => {
                const isSelected = userAnswers[currentQuestionIndex] === index;
                return (
                  <button 
                    key={index} 
                    className={`btn btn-primary answer-btn ${isSelected ? 'selected' : ''}`}
                    style={isSelected ? { backgroundColor: 'var(--accent)' } : {}}
                    onClick={() => handleSelectAnswer(index)}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>

            {/* 13. DOLNA BELKA: LICZNIK I PRZYCISK NEXT */}
            <div className="next-btn-container">
              <span className="quiz-counter">
                Question {currentQuestionIndex + 1} / {currentQuestions.length}
              </span>
              
              {userAnswers[currentQuestionIndex] !== -1 && (
                <button className="btn-next-blue" onClick={handleNextQuestion}>
                  {currentQuestionIndex === currentQuestions.length - 1 ? "Finish" : "Next"}
                </button>
              )}
            </div>
         </div>
      )}

      {/* 14. EKRAN KOŃCOWY */}
      {currentScreen === 'end' && (
        <div className="screen active">
          <h2 className="screen-title">Quiz Finished! 🏆</h2>
          
          <p style={{ fontSize: '24px', margin: '10px 0', color: 'var(--primary)' }}>
            Your score: <strong>{finalScore} / {currentQuestions.length}</strong>
          </p>
          <p className="motivational-text">{getMotivationalMessage()}</p>

          <p style={{ margin: '10px 0 5px 0', fontSize: '0.95rem' }}>Enter your name to save the record:</p>
          <input 
            type="text" className="input-name" placeholder="Your name..." 
            value={playerName} onChange={(e) => setPlayerName(e.target.value)}
          />

          {/* 15. PRZYCISKI ZAPISU / POMINIĘCIA */}
          <div className="btn-grid-col" style={{ width: '70%', gap: '10px', marginTop: '10px' }}>
            <button className="btn btn-primary" disabled={!playerName.trim()} onClick={handleSaveResult}>Save Result</button>
            <button className="btn btn-secondary" onClick={() => {
              setCurrentScreen('home'); setSelectedCategory(''); setPlayerName('');
            }}>Skip & Return</button>
          </div>
        </div>
      )}

      {/* 16. EKRAN REKORDÓW - LEADERBOARD */}
      {currentScreen === 'records' && (
        <div className="screen active">
           <h2 className="screen-title" style={{ marginBottom: '30px' }}>Global Leaderboard</h2>
           
           <div className="records-container" style={{ maxHeight: '300px', overflowY: 'auto', width: '90%', padding: '5px' }}>
              {sortedLeaderboard.length === 0 ? (
                <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>No records yet!</p>
              ) : (
                sortedLeaderboard.map((playerData, index) => {
                  const isExpanded = expandedPlayer === playerData.name;
                  let badge = `${index + 1}.`;
                  if (index === 0) badge = "🥇";
                  if (index === 1) badge = "🥈";
                  if (index === 2) badge = "🥉";

                  return (
                    <div key={playerData.name} className="player-record-box">
                      <div className="player-header" onClick={() => setExpandedPlayer(isExpanded ? null : playerData.name)}>
                        <div>
                          <span className="rank-badge">{badge}</span>
                          <span>{playerData.name}</span>
                        </div>
                        <span className="player-total-score">{playerData.totalPoints} pts</span>
                      </div>
                      
                      {isExpanded && (
                        <div className="player-scores-list">
                          {Object.keys(playerData.categories).map(cat => (
                            <div key={cat} className="category-score-row">
                              <span>{cat}</span>
                              <span>{playerData.categories[cat].score} / {playerData.categories[cat].total}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
           </div>
           
           <button className="btn btn-primary mt-20" onClick={() => { setCurrentScreen('home'); setExpandedPlayer(null); }}>Return</button>
        </div>
      )}

    </div>
  );
}