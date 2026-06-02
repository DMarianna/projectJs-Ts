// 1. IMPORTY I INTERFEJSY
import { useState, useMemo, useEffect } from 'react';
import './index.css';
import { allQuestions as initialQuestions, type QuizQuestion } from './questions';
import CategoryButton from './components/CategoryButton';

import footballIcon from './assets/football.png';
import lionIcon from './assets/lion.png';
import musicIcon from './assets/music-note.png';
import templeIcon from './assets/temple.png';
import diceIcon from './assets/dice.png';

interface PlayerRecords {
  [playerName: string]: {
    [category: string]: { score: number; total: number; hintsUsed?: number };
  };
}

export default function App() {
  // 2. STANY APLIKACJI
  const [currentScreen, setCurrentScreen] = useState<'home' | 'categories' | 'quiz' | 'records' | 'end' | 'review' | 'import'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [loadedRecords, setLoadedRecords] = useState<PlayerRecords>({});
 
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [isHintVisible, setIsHintVisible] = useState(false);

  const [questionsList, setQuestionsList] = useState<QuizQuestion[]>(initialQuestions);
  const [jsonInput, setJsonInput] = useState<string>('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | '', message: string }>({ type: '', message: '' });

  const dynamicCategories = useMemo(() => {
    const base = [
      { name: 'Sport', src: footballIcon },
      { name: 'Animals', src: lionIcon },
      { name: 'Music', src: musicIcon },
      { name: 'History', src: templeIcon }
    ];
   
    const baseNames = base.map(b => b.name);
    const uniqueCustom = Array.from(new Set(questionsList.map(q => q.category)))
      .filter(name => !baseNames.includes(name));

    const customMapped = uniqueCustom.map(name => ({ name, src: diceIcon }));
    return [...base, ...customMapped];
  }, [questionsList]);

  useEffect(() => {
    if (currentScreen !== 'quiz') return;
    if (timeLeft <= 0) {
      setIsTimeOut(true);
      setCurrentScreen('end');
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentScreen]);

  // 3. INICJALIZACJA QUIZU
  const startQuiz = () => {
    let questionsForQuiz = [];
    if (selectedCategory === "Random") {
      questionsForQuiz = [...questionsList].sort(() => 0.5 - Math.random()).slice(0, 5);
    } else {
      questionsForQuiz = questionsList.filter(q => q.category === selectedCategory).slice(0, 5);
    }
    setCurrentQuestions(questionsForQuiz);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(questionsForQuiz.length).fill(-1));
    setTimeLeft(30);
    setIsTimeOut(false);
    setHintsUsedCount(0);
    setIsHintVisible(false);
    setCurrentScreen('quiz');
  };

  // 4. OBSŁUGA ODPOWIEDZI I PODPOWIEDZI
  const handleSelectAnswer = (answerIndex: number) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answerIndex;
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    setIsHintVisible(false);
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsTimeOut(false);
      setCurrentScreen('end');
    }
  };

  const handleHintClick = () => {
    if (!isHintVisible) {
      setIsHintVisible(true);
      setHintsUsedCount(prev => prev + 1);
    }
  };

  // 5. OBLICZANIE WYNIKÓW
  const rawScore = useMemo(() => {
    let score = 0;
    currentQuestions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswerIndex) score++;
    });
    return score;
  }, [currentQuestions, userAnswers]);

  const finalScore = useMemo(() => {
    return Math.max(0, rawScore - (hintsUsedCount * 0.5));
  }, [rawScore, hintsUsedCount]);

  // 6. ZAPIS WYNIKÓW I LEADERBOARD
  const handleSaveResult = () => {
    if (!playerName.trim()) return;
    const formattedName = playerName.trim();
    const records: PlayerRecords = JSON.parse(localStorage.getItem('quizManiaGroupRecords') || '{}');
    if (!records[formattedName]) records[formattedName] = {};
    records[formattedName][selectedCategory] = {
      score: finalScore,
      total: currentQuestions.length,
      hintsUsed: hintsUsedCount
    };
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

  const sortedLeaderboard = useMemo(() => {
    const players = Object.keys(loadedRecords).map(name => {
      const categories = loadedRecords[name];
      let totalPoints = 0;
      Object.values(categories).forEach(cat => totalPoints += cat.score);
      return { name, categories, totalPoints };
    });
    return players.sort((a, b) => b.totalPoints - a.totalPoints);
  }, [loadedRecords]);

  // 7. METODY POMOCNICZE I IMPORT JSON
  const progressPercent = currentQuestions.length > 0
    ? ((currentQuestionIndex + 1) / currentQuestions.length) * 100
    : 0;

  const getCurrentIcon = () => {
    if (selectedCategory === 'Random') return diceIcon;
    return dynamicCategories.find(c => c.name === selectedCategory)?.src || diceIcon;
  };

  const loadJsonTemplate = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const template = [
      {
        "category": "Gaming",
        "question": "Which game features a blocky open world?",
        "answers": ["Terraria", "Minecraft", "Roblox", "Fortnite"],
        "correctAnswerIndex": 1,
        "hint": "Created by Notch."
      }
    ];
    setJsonInput(JSON.stringify(template, null, 2));
    setImportStatus({ type: 'success', message: 'Template loaded! Edit it now.' });
  };

  const handleImportJson = async () => {
    if (!jsonInput.trim()) {
      setImportStatus({ type: 'error', message: 'Please paste JSON string first.' });
      return;
    }
    try {
      const parsedData = await new Promise<any>((resolve, reject) => {
        try {
          const res = JSON.parse(jsonInput);
          resolve(res);
        } catch (e) {
          reject(new Error('Invalid JSON format. Check commas!'));
        }
      });
      const questionsArray = Array.isArray(parsedData) ? parsedData : [parsedData];
     
      for (const q of questionsArray) {
        if (!q.category || !q.question || !Array.isArray(q.answers) || typeof q.correctAnswerIndex !== 'number') {
          throw new Error('Missing fields! Needs: category, question, answers[], correctAnswerIndex.');
        }
      }

      setQuestionsList(prev => [...prev, ...questionsArray]);
      setImportStatus({ type: 'success', message: `Successfully imported ${questionsArray.length} question(s)!` });
      setJsonInput('');
    } catch (err: any) {
      setImportStatus({ type: 'error', message: err.message || 'Import failed.' });
    }
  };

  // 8. EKRAN DOMOWY
  return (
    <div className="quiz-container">
     
      {currentScreen === 'home' && (
        <div className="screen active">
          <h2 className="screen-title" style={{marginTop: '60px'}}>Welcome to Quiz Mania</h2>
          <div className="btn-grid-col" style={{marginTop: 'auto', marginBottom: '25%', width: '60%'}}>
            <button className="btn btn-primary btn-home-start" onClick={() => setCurrentScreen('categories')}>Start</button>
            <button className="btn btn-accent btn-home-leaderboard" onClick={loadRecordsScreen}>Leaderboard</button>
          </div>
        </div>
      )}

      {/* 9. EKRAN KATEGORII */}
      {currentScreen === 'categories' && (
        <div className="screen active">
          <h2 className="screen-title">Choose a category</h2>
         
          <div className="category-grid" style={{marginTop: '5%'}}>
            {dynamicCategories.map(cat => (
              <CategoryButton
                key={cat.name}
                categoryName={cat.name}
                isSelected={selectedCategory === cat.name}
                iconSrc={cat.src}
                onClick={() => setSelectedCategory(cat.name)}
              />
            ))}
          </div>
          <button
            className={`dice-btn ${selectedCategory === 'Random' ? 'selected' : ''}`}
            onClick={() => setSelectedCategory('Random')}
          >
            <img src={diceIcon} alt="Random" className="dice-icon" />
            <span>Random</span>
          </button>
         
          <div style={{ display: 'flex', width: '100%', gap: '10px', marginTop: 'auto', marginBottom: '10px' }}>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem' }} onClick={() => { setImportStatus({type:'', message:''}); setCurrentScreen('import'); }}>
              ⚙️ Create your own questions
            </button>
            <button className="btn btn-primary" style={{ flex: 1.4 }} disabled={!selectedCategory} onClick={startQuiz}>
              Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* 10. EKRAN QUIZU */}
      {currentScreen === 'quiz' && currentQuestions.length > 0 && (
         <div className="screen active">
            <div className="hint-wrapper">
              <button className="hint-btn" disabled={isHintVisible} onClick={handleHintClick}>💡 Hint</button>
              {isHintVisible && (
                <div className="hint-tooltip">
                  {currentQuestions[currentQuestionIndex].hint || 'No hint available for this question.'}
                </div>
              )}
            </div>

            <span className={`quiz-timer ${timeLeft <= 10 ? 'danger' : ''}`}>⏳ {timeLeft} s</span>

            <h2 className="screen-title">{selectedCategory} Quiz</h2>
            <p id="question-text">{currentQuestions[currentQuestionIndex].question}</p>
           
            {/* 11. GENEROWANIE ODPOWIEDZI */}
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

            {/* 12. DOLNA BELKA: LICZNIK I PRZYCISK NEXT */}
            {currentQuestionIndex < currentQuestions.length - 1 ? (
              <div className="next-btn-container">
                <span className="quiz-counter">Question {currentQuestionIndex + 1} / {currentQuestions.length}</span>
                {userAnswers[currentQuestionIndex] !== -1 && (
                  <button className="btn-next-blue" onClick={handleNextQuestion}>Next</button>
                )}
              </div>
            ) : (
              userAnswers[currentQuestionIndex] !== -1 && (
                <button className="btn btn-accent btn-finish-large" onClick={handleNextQuestion}>Finish</button>
              )
            )}

            <div className="progress-container">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                <img src={getCurrentIcon()} alt="progress" className="progress-bar-icon-img" style={{ left: `${progressPercent}%` }}/>
              </div>
            </div>
         </div>
      )}

      {/* 13. EKRAN KOŃCOWY */}
      {currentScreen === 'end' && (
        <div className="screen active setup-end-screen">
          <h2 className="end-title">{isTimeOut ? "Time's Up!" : "Quiz Finished!"}</h2>

          <div className="score-box-layout">
            {hintsUsedCount > 0 && (
              <p className="correct-answers-label">
                Correct answers: {rawScore} / {currentQuestions.length}
              </p>
            )}
           
            <p className="final-score-display">
              Final score: {finalScore} pts
            </p>
           
            {hintsUsedCount > 0 && (
              <p className="hints-deduction-label">
                (-{hintsUsedCount * 0.5} pts for using {hintsUsedCount} {hintsUsedCount === 1 ? 'hint' : 'hints'})
              </p>
            )}
          </div>
         
          <input
            type="text"
            className="input-name-modern"
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          {/* 14. PRZYCISKI ZAPISU / POMINIĘCIA */}
          <div className="end-actions-layout">
            <button className="btn-modern-skip" onClick={() => {
              setCurrentScreen('home'); setSelectedCategory(''); setPlayerName(''); setIsTimeOut(false);
            }}>Skip</button>
            <button className="btn-modern-save" disabled={!playerName.trim()} onClick={handleSaveResult}>Save Result</button>
          </div>

          <button
            className="btn-modern-review"
            onClick={() => setCurrentScreen('review')}
          >
            See correct answers
          </button>
        </div>
      )}

      {/* 15. EKRAN IMPORTU PYTAŃ */}
      {currentScreen === 'import' && (
        <div className="screen active">
          <h2 className="screen-title" style={{ marginBottom: '15px' }}>Add Questions</h2>
         
          {importStatus.message && (
            <div className={`import-status ${importStatus.type}`}>{importStatus.message}</div>
          )}

          <div className="import-box" style={{ flex: 1, justifyContent: 'center' }}>
            <label className="import-label">Paste JSON Format:</label>
            <textarea
              className="input-textarea"
              placeholder='[{"category":"Custom", "question":"...", "answers":["..."], "correctAnswerIndex":0}]'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <button className="btn-small-outline" onClick={loadJsonTemplate}>💡 Load Example Template</button>
           
            <button className="btn-import-purple" onClick={handleImportJson}>
              Import JSON
            </button>
          </div>

          <div className="import-footer-actions">
            <button className="btn-back-lavender" onClick={() => setCurrentScreen('categories')}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* 16. EKRAN PRZEGLĄDU ODPOWIEDZI */}
      {currentScreen === 'review' && (
        <div className="screen active">
          <h2 className="screen-title">Answers Review</h2>
          <div className="review-container">
            {currentQuestions.map((q, i) => {
              const userAnswerIndex = userAnswers[i];
              const isCorrect = userAnswerIndex === q.correctAnswerIndex;
              return (
                <div key={i} className="review-item">
                  <p className="review-question">{i + 1}. {q.question}</p>
                  {userAnswerIndex !== -1 ? (
                    <p className={`review-answer ${isCorrect ? 'correct' : 'incorrect'}`}>
                      <strong>Your answer:</strong> {q.answers[userAnswerIndex]} {isCorrect && ' ✓'}
                    </p>
                  ) : (
                    <p className="review-answer incorrect"><strong>Your answer:</strong> Out of time (None)</p>
                  )}
                  {!isCorrect && (
                    <p className="review-answer correct">
                      <strong>Correct answer:</strong> {q.answers[q.correctAnswerIndex]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <button className="btn btn-primary" style={{width: '60%', marginTop: 'auto', marginBottom: '20px'}} onClick={() => setCurrentScreen('end')}>
            Back to Results
          </button>
        </div>
      )}

      {/* 17. EKRAN REKORDÓW - LEADERBOARD */}
      {currentScreen === 'records' && (
        <div className="screen active">
           <h2 className="screen-title">Global Leaderboard</h2>
           <div className="records-container">
              {sortedLeaderboard.length === 0 ? (
                <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>No records yet!</p>
              ) : (
                sortedLeaderboard.map((playerData, index) => {
                  const isExpanded = expandedPlayer === playerData.name;
                  return (
                    <div key={playerData.name} className="player-record-box">
                      <div className="player-header" onClick={() => setExpandedPlayer(isExpanded ? null : playerData.name)}>
                        <span>{index + 1}. {playerData.name}</span>
                        <span className="player-total-score">{playerData.totalPoints} pts</span>
                      </div>
                      {isExpanded && (
                        <div className="player-scores-list" style={{ padding: '0 14px 10px' }}>
                          {Object.keys(playerData.categories).map(cat => (
                            <div key={cat} className="category-score-row">
                              <span>
                                {cat}
                                {playerData.categories[cat].hintsUsed ? (
                                  <span style={{fontSize: '0.75rem', color: '#fbcfe8', marginLeft: '6px', fontStyle: 'italic'}}>(hints used)</span>
                                ) : null}
                              </span>
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
           <button className="btn btn-primary" style={{width: '200px', marginTop: 'auto', marginBottom: '10px'}} onClick={() => { setCurrentScreen('home'); setExpandedPlayer(null); }}>Return</button>
        </div>
      )}

    </div>
  );
}