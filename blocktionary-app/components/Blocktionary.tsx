'use client';

import React, { useEffect, useState } from 'react';
import { blockchainQuestions, type Question } from '../data/questions';

// Dummy mode: Only change this flag when you add real OnchainKit API key/web3
// Uncomment the next line for real Base integration, leave as false in dummy mode!
// const BASE_ENABLED = !!process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
const BASE_ENABLED = false; // Dummy mode: always false for now!

type SourceType = 'local' | 'gpt';

export default function Blocktionary() {
  const [source, setSource] = useState<SourceType>('local');
  const [questions, setQuestions] = useState<Question[]>(blockchainQuestions);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Fetch AI questions if user selects "gpt"
  useEffect(() => {
    async function loadQuestions() {
      if (source === 'local') {
        setQuestions(blockchainQuestions);
        resetGame();
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('/api/generate-quiz');
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : blockchainQuestions);
        resetGame();
      } catch {
        setQuestions(blockchainQuestions);
        alert('Error fetching AI questions, using curated set.');
        setSource('local');
        resetGame();
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const resetGame = () => {
    setCurrentQuestion(0);
    setUserAnswer('');
    setScore(0);
    setShowHint(false);
    setShowDefinition(false);
    setGameCompleted(false);
  };

  const currentQ = questions[currentQuestion];

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;
    const isCorrect = userAnswer.toLowerCase().trim() === currentQ.term.toLowerCase();
    if (isCorrect) setScore(score + 1);
    setShowDefinition(true);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setShowHint(false);
        setShowDefinition(false);
      } else setGameCompleted(true);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 min-h-screen flex items-center text-white">
        <div className="text-center w-full">
          <div className="animate-spin h-8 w-8 mx-auto border-b-2 border-white rounded-full mb-4"></div>
          <span className="text-lg font-bold">Loading questions…</span>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 min-h-screen text-white flex items-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center w-full">
          <h2 className="text-4xl font-bold mb-4">🎉 Blocktionary Complete!</h2>
          <div className="text-3xl mb-6">
            Final Score: {score}/{questions.length} ({percentage}%)
          </div>
          {/* Blockchain Rewards Section (Dummy for now) */}
          <div className="mt-8">
            {BASE_ENABLED ? (
              // Uncomment and swap in real reward button/component when ready
              <button className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-semibold">
                Claim Blockchain Rewards
              </button>
            ) : (
              <button
                className="bg-gray-400 px-8 py-3 rounded-xl text-white opacity-60 cursor-not-allowed font-semibold"
                disabled
              >
                🚀 Blockchain Features Coming Soon!
              </button>
            )}
          </div>
          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl font-semibold mt-8"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 min-h-screen text-white flex items-center">
      <div className="w-full">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-3">📚 Blocktionary</h1>
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => setSource('local')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all 
                ${source === 'local' ? 'bg-white text-blue-600 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
              disabled={loading || source === 'local'}
            >
              Curated Collection
            </button>
            <button
              onClick={() => setSource('gpt')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all 
                ${source === 'gpt' ? 'bg-white text-blue-600 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
              disabled={loading || source === 'gpt'}
            >
              Live Llama 3
            </button>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            Question {currentQuestion + 1} of {questions.length} | Score: {score}
          </div>
        </header>
        <div className="bg-white/10 rounded-3xl p-8 mb-6">
          <h3 className="text-2xl font-semibold mb-6">What blockchain term matches this description?</h3>
          <div className="bg-white/15 p-6 rounded-xl mb-6">
            <p className="text-lg">{currentQ.definition}</p>
          </div>
          {showHint && (
            <div className="bg-orange-500/20 p-6 rounded-xl mb-6">
              <h4 className="font-semibold mb-3">💡 Real-World Hint:</h4>
              <p className="italic">{currentQ.hint}</p>
            </div>
          )}
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 py-3 px-6 rounded-xl font-semibold mb-6"
            >
              🔍 Show Real-World Hint
            </button>
          )}
          {showDefinition && (
            <div className="bg-green-500/20 p-6 rounded-xl mb-6">
              <h4 className="font-semibold mb-3">✅ Answer: {currentQ.term}</h4>
              <p>
                <strong>Explanation:</strong> {currentQ.hint}
              </p>
            </div>
          )}
        </div>
        {!showDefinition && (
          <div className="flex gap-4">
            <input
              type="text"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="Enter the blockchain term..."
              className="flex-1 p-4 rounded-xl bg-white text-black placeholder-gray-500 text-lg"
              onKeyDown={e => e.key === 'Enter' && userAnswer.trim() && handleSubmitAnswer()}
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim()}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 px-8 py-4 rounded-xl font-semibold"
            >
              Submit
            </button>
          </div>
        )}
        {/* Dummy blockchain/web3 section */}
        <div className="mt-8 text-center">
          {BASE_ENABLED ? (
            // Uncomment and show real wallet connect when ready:
            // <ConnectWallet />
            <button className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-semibold">
              Connect to Base
            </button>
          ) : (
            <button
              className="bg-gray-400 px-8 py-3 rounded-xl text-white opacity-60 cursor-not-allowed font-semibold"
              disabled
            >
              🪐 Blockchain Features Coming Soon!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
