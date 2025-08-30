'use client';

import React, { useState } from 'react';
import { blockchainQuestions, type Question } from '../../data/questions';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

// This flag checks for the API key; Base/web3 features are "off" in dummy mode.
const BASE_ENABLED = !!process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

export default function Blocktionary() {
  const { connect } = useConnect();
  const { isConnected } = useAccount();
  
  const handleClaimRewards = () => {
    // Implement reward claiming logic here
    console.log('Claiming blockchain rewards');
  };
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<{ term: string; userAnswer: string }[]>([]);

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
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
          <h2 className="text-4xl font-bold mb-4">🎉 Blocktionary Complete!</h2>
          <div className="text-3xl mb-6">
            Final Score: {score}/{blockchainQuestions.length} ({percentage}%)
          </div>

          {/* --- Blockchain Rewards Section (Dummy/Demo Mode) --- */}
          <div className="mt-8">
            {BASE_ENABLED ? (
              <button 
                className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-semibold"
                onClick={() => connect({ connector: injected({ target: 'metaMask' }) })}
              >
                {isConnected ? 'Claim Blockchain Rewards' : 'Connect MetaMask'}
              </button>
            ) : (
              <button
                className="bg-gray-400 px-8 py-3 rounded-xl text-white opacity-60 cursor-not-allowed font-semibold"
                disabled
                title="Connect to Base to claim rewards!"
              >
                🚀 Base Rewards Coming Soon!
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
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 min-h-screen text-white">
      <header className="text-center mb-8">
        <h1 className="text-6xl font-bold mb-3">📚 Blocktionary</h1>
        <div className="bg-white/20 p-4 rounded-xl">
          Question {currentQuestion + 1} of {blockchainQuestions.length} | Score: {score}
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
            onKeyPress={e => e.key === 'Enter' && userAnswer.trim() && handleSubmitAnswer()}
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

      {/* Wallet connection section - Always shown below input */}
      <div className="mt-4 text-center">
        {BASE_ENABLED ? (
          isConnected ? (
            <div>
              <p className="mb-2">Wallet Connected</p>
              {score >= blockchainQuestions.length / 2 && (
                <button 
                  className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-semibold"
                  onClick={handleClaimRewards}
                >
                  Claim Blockchain Rewards
                </button>
              )}
            </div>
          ) : (
            <button 
              className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-semibold"
              onClick={() => connect({ connector: injected({ target: 'metaMask' }) })}
            >
              Connect Wallet
            </button>
          )
        ) : (
          <button
            className="bg-gray-400 px-8 py-3 rounded-xl text-white opacity-60 cursor-not-allowed font-semibold"
            disabled
            title="Base integration coming soon"
          >
            🪐 Blockchain Features Coming Soon!
          </button>
        )}
      </div>
    </div>
  );
}