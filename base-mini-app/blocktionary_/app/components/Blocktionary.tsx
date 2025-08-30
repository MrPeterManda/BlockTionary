'use client';

import React, { useState, useEffect } from 'react';
import { blockchainQuestions, type Question } from '../../data/questions';
import { CONTRACT_ADDRESSES, NFT_METADATA, TIP_AMOUNTS } from '../config/contracts';
import { useAccount, useConnect, useWriteContract } from 'wagmi';

// This flag checks for the API key; Base/web3 features are "off" in dummy mode.
const BASE_ENABLED = !!process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

type QuizMode = 'curated' | 'llama3';

export default function Blocktionary() {
  const [quizMode, setQuizMode] = useState<QuizMode>('curated');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [grokQuestions, setGrokQuestions] = useState<Question[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<{ term: string; userAnswer: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const currentQ = quizMode === 'llama3' && grokQuestions.length > 0 
    ? grokQuestions[currentQuestion] 
    : blockchainQuestions[currentQuestion];

  const { writeContract: mintNFT, status: mintStatus, error: mintError } = useWriteContract();
  const { writeContract: recordScore, status: scoreStatus, error: scoreError } = useWriteContract();
  
  const mintAchievementNFT = async (nftType: 'beginner' | 'expert') => {
    if (!address) return;
    mintNFT({
      address: CONTRACT_ADDRESSES.base.nftRewards,
      abi: [
        {
          inputs: [{ name: "to", type: "address" }, { name: "tokenId", type: "uint256" }],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ],
      functionName: 'mint',
      args: [address, nftType === 'beginner' ? BigInt(1) : BigInt(2)]
    });
  };

  const recordScoreOnChain = async (score: number) => {
    if (!address) return;
    try {
      await recordScore({
        address: CONTRACT_ADDRESSES.base.scoring,
        abi: [
          {
            inputs: [{ name: "score", type: "uint256" }],
            name: "recordScore",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
          }
        ],
        functionName: 'recordScore',
        args: [BigInt(score)]
      });
    } catch (error) {
      console.error('Error recording score:', error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const isCorrect = userAnswer.toLowerCase().trim() === currentQ.term.toLowerCase();

      if (isCorrect) {
        setScore(score + 1);
        setCorrectAnswers([...correctAnswers, currentQ.term]);
      } else {
        setWrongAnswers([...wrongAnswers, { term: currentQ.term, userAnswer }]);
      }

      setShowDefinition(true);

      setTimeout(() => {
        const questionsLength = quizMode === 'llama3' && grokQuestions.length > 0 
          ? grokQuestions.length 
          : blockchainQuestions.length;
        
        if (currentQuestion < questionsLength - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setUserAnswer('');
          setShowHint(false);
          setShowDefinition(false);
        } else {
          setGameCompleted(true);
        }
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Error handling answer:', error);
      setIsLoading(false);
    }
  };

  const handleQuizModeChange = async (mode: QuizMode) => {
    if (isLoading) return;
    setQuizMode(mode);
    resetGame();
    
    if (mode === 'llama3') {
      if (!process.env.NEXT_PUBLIC_GROK_API_KEY) {
        console.error('GROK API key is missing');
        alert('GROK API key is not configured. Please check your environment variables.');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        console.log('Making GROK API request with key:', process.env.NEXT_PUBLIC_GROK_API_KEY ? 'key present' : 'key missing');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROK_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama3-70b-8192',
            messages: [{
              role: 'user',
              content: 'Generate 10 random blockchain terms with definitions and hints. Format as JSON array with term, definition and hint fields.'
            }],
            temperature: 0.7
          })
        });
        console.log('GROK API response status:', response.status);
        
        if (response.status === 404) {
          throw new Error('API endpoint not found. Please verify the GROK API URL is correct.');
        }
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format from GROK API');
        }
        
        try {
          let content = data.choices[0].message.content;
          // Handle case where response starts with text before JSON
          if (content.trim().startsWith('Here are') || content.trim().startsWith('Here is')) {
            const jsonStart = content.indexOf('[');
            if (jsonStart > 0) {
              content = content.slice(jsonStart);
            }
          }
          // Handle trailing content after JSON
          const jsonEnd = content.lastIndexOf(']') + 1;
          if (jsonEnd > 0 && jsonEnd < content.length) {
            content = content.slice(0, jsonEnd);
          }
          const questions = JSON.parse(content);
          if (!Array.isArray(questions)) {
            throw new Error('Expected array of questions');
          }
          if (questions.length === 0) {
            throw new Error('Received empty questions array from GROK API');
          }
          setGrokQuestions(questions);
        } catch (parseError) {
          console.error('Error parsing GROK response:', parseError);
          console.log('Raw response content:', data.choices[0].message.content);
          throw new Error(`Failed to parse GROK response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
        }
      } catch (error) {
        console.error('Error fetching questions from GROK:', error);
        alert(`Failed to fetch questions from GROK: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
      }
    }
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
    const questionsLength = quizMode === 'llama3' && grokQuestions.length > 0 
      ? grokQuestions.length 
      : blockchainQuestions.length;
    const percentage = Math.round((score / questionsLength) * 100);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 min-h-screen text-white">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
          <h2 className="text-4xl font-bold mb-4">🎉 Blocktionary Complete!</h2>
          <div className="text-3xl mb-6">
            Final Score: {score}/{blockchainQuestions.length} ({percentage}%)
          </div>

          {/* --- Blockchain Rewards Section --- */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {!address && (
              <button 
                className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl font-semibold"
                onClick={async () => {
                  try {
                    await connect({ connector: connectors[0] });
                  } catch (error) {
                    console.error('Connection failed:', error);
                  }
                }}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 
                  isConnected ? `Connected to ${connector?.name}` : 'Connect Wallet'}
              </button>
            )}
            {BASE_ENABLED && address && (
              <button 
                className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-semibold"
                onClick={async () => {
                  if (isLoading) return;
                  try {
                    setIsLoading(true);
                    await recordScoreOnChain(percentage);
                    await mintAchievementNFT(percentage >= 90 ? 'expert' : 'beginner');
                  } catch (error) {
                    console.error('Transaction failed:', error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={mintStatus === 'pending' || scoreStatus === 'pending' || isLoading}
              >
                {mintStatus === 'pending' || scoreStatus === 'pending' ? 'Processing...' : 'Claim Blockchain Rewards'}
              </button>
            )}
            {!BASE_ENABLED && (
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
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => handleQuizModeChange('curated')} 
            className={`px-6 py-2 rounded-l-xl font-semibold ${quizMode === 'curated' ? 'bg-white text-indigo-800' : 'bg-white/20'}`}
          >
            Curated Quiz
          </button>
          <button 
            onClick={() => handleQuizModeChange('llama3')} 
            className={`px-6 py-2 rounded-r-xl font-semibold ${quizMode === 'llama3' ? 'bg-white text-indigo-800' : 'bg-white/20'}`}
            disabled={!process.env.NEXT_PUBLIC_GROK_API_KEY || isLoading}
            title={!process.env.NEXT_PUBLIC_GROK_API_KEY ? 'GROK API key required' : ''}
          >
            {isLoading && quizMode === 'llama3' ? 'Loading...' : 'GROK AI Generated'}
          </button>
        </div>
        <div className="bg-white/20 p-4 rounded-xl">
          Question {currentQuestion + 1} of 
          {quizMode === 'llama3' && grokQuestions.length > 0 
            ? grokQuestions.length 
            : blockchainQuestions.length} 
          | Score: {score}
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
            onClick={() => {
              try {
                setShowHint(true);
              } catch (error) {
                console.error('Error showing hint:', error);
              }
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 py-3 px-6 rounded-xl font-semibold mb-6"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : '🔍 Show Real-World Hint'}
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
            onClick={() => {
              try {
                handleSubmitAnswer();
              } catch (error) {
                console.error('Error submitting answer:', error);
              }
            }}
            disabled={!userAnswer.trim() || isLoading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 px-8 py-4 rounded-xl font-semibold"
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      )}

      {/* --- Blockchain Connect Section --- */}
      <div className="mt-8 text-center">
        {BASE_ENABLED ? (
          address ? (
            <div className="bg-green-500/20 px-4 py-2 rounded-xl">
              Connected: {address.substring(0, 6)}...{address.substring(38)}
            </div>
          ) : (
            <button 
              className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl font-semibold"
              onClick={() => connect({ connector: connectors[0] })}
            >
              Connect to Base
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