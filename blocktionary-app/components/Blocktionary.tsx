'use client';

import React, { useState } from 'react';
import { blockchainQuestions, type Question } from '../data/questions';

export default function Blocktionary() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<{term: string, userAnswer: string}[]>([]);
  
  const currentQ = blockchainQuestions[currentQuestion];

  const handleSubmitAnswer = () => {
    const isCorrect = userAnswer.toLowerCase().trim() === currentQ.term.toLowerCase();
    
    if (isCorrect) {
      setScore(score + 1);
      setCorrectAnswers([...correctAnswers, currentQ.term]);
    } else {
      setWrongAnswers([...wrongAnswers, { term: currentQ.term, userAnswer }]);
    }

    setShowDefinition(true);
    
    setTimeout(() => {
      if (currentQuestion < blockchainQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setShowHint(false);
        setShowDefinition(false);
      } else {
        setGameCompleted(true);
      }
    }, 3000);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setUserAnswer('');
    setScore(0);
    setShowHint(false);
    setShowDefinition(false);
    setGameCompleted(false);
    setCorrectAnswers([]);
    setWrongAnswers([]);
  };

  if (gameCompleted) {
    const percentage = Math.round((score / blockchainQuestions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 min-h-screen text-white">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">🎉 Blocktionary Complete!</h2>
          <div className="text-3xl mb-6 font-bold">
            Final Score: {score}/{blockchainQuestions.length} ({percentage}%)
          </div>
          
          <div className="mb-6 p-6 bg-white/10 rounded-xl">
            <h4 className="text-xl font-semibold mb-3">Performance Summary:</h4>
            <div className="flex justify-center gap-8">
              <p className="text-green-300 text-lg">✅ Correct: {correctAnswers.length}</p>
              <p className="text-red-300 text-lg">❌ Incorrect: {wrongAnswers.length}</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <button 
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              Play Again
            </button>
            <button 
              onClick={() => {
                const shareText = `I just scored ${score}/${blockchainQuestions.length} (${percentage}%) on Blocktionary! 🎯 Learning blockchain terminology through play. #Blocktionary #BaseMiniApp #Web3Education`;
                if (navigator.share) {
                  navigator.share({ text: shareText });
                } else {
                  navigator.clipboard.writeText(shareText);
                  alert('Score copied to clipboard!');
                }
              }}
              className="bg-purple-500 hover:bg-purple-600 px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              Share Score
            </button>
          </div>

          {wrongAnswers.length > 0 && (
            <div className="text-left p-6 bg-white/10 rounded-xl">
              <h4 className="font-semibold mb-4 text-xl">📚 Review Incorrect Answers:</h4>
              {wrongAnswers.map((item, index) => (
                <div key={index} className="mb-3 p-3 bg-white/10 rounded-lg">
                  <p><strong className="text-green-300">Correct:</strong> {item.term}</p>
                  <p><strong className="text-red-300">Your answer:</strong> {item.userAnswer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 min-h-screen text-white">
      <header className="text-center mb-8">
        <h1 className="text-6xl font-bold mb-3">🧱Blocktionary</h1>
        <p className="text-xl mb-6 opacity-90">Master Blockchain Terminology Through Interactive Learning</p>
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
          <div className="text-lg font-semibold">
            Question {currentQuestion + 1} of {blockchainQuestions.length}
          </div>
          <div className="text-2xl font-bold mt-1">Score: {score}</div>
        </div>
      </header>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-6 shadow-2xl">
        <h3 className="text-2xl font-semibold mb-6 text-center">What blockchain term matches this description?</h3>
        
        <div className="bg-white/15 p-6 rounded-xl mb-6 border-l-4 border-green-400">
          <p className="text-lg leading-relaxed">{currentQ.definition}</p>
        </div>
        
        <div className="flex justify-center mb-6">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold">
            {currentQ.category.toUpperCase()} | {currentQ.difficulty.toUpperCase()}
          </span>
        </div>

        {showHint && (
          <div className="bg-orange-500/20 p-6 rounded-xl mb-6 border-l-4 border-orange-400">
            <h4 className="font-semibold mb-3 text-lg">💡 Real-World Hint:</h4>
            <p className="text-lg italic">{currentQ.hint}</p>
          </div>
        )}

        {!showHint && (
          <button 
            onClick={() => setShowHint(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-3 px-6 rounded-xl font-semibold mb-6 transition-all transform hover:scale-105"
          >
            🔍 Show Real-World Hint
          </button>
        )}

        {showDefinition && (
          <div className="bg-green-500/20 p-6 rounded-xl mb-6 border-l-4 border-green-400">
            <h4 className="font-semibold mb-3 text-xl">✅ Answer: {currentQ.term}</h4>
            <p className="text-lg"><strong>Explanation:</strong> {currentQ.hint}</p>
          </div>
        )}
      </div>

      {!showDefinition && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter the blockchain term..."
              className="flex-1 p-4 rounded-xl bg-white text-black placeholder-gray-500 text-lg font-medium focus:ring-4 focus:ring-blue-300 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && handleSubmitAnswer()}
            />
            <button 
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim()}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
