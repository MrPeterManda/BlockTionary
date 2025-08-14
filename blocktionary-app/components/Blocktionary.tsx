'use client'

import React, { useEffect, useState } from 'react'
import { blockchainQuestions as localQuestions } from '../data/questions'

type Question = { term: string; definition: string; hint: string; difficulty: string; category: string }

export default function Blocktionary() {
  const [questions, setQuestions] = useState<Question[]>(localQuestions)
  const [source, setSource] = useState<'local' | 'gpt'>('local')
  const [loading, setLoading] = useState(false)
  const [idx, setIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showAns, setShowAns] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setDone(false)
      setIdx(0); setAnswer(''); setScore(0); setShowHint(false); setShowAns(false)
      if (source === 'local') {
        setQuestions(localQuestions)
      } else {
        try {
          const res = await fetch('/api/generate-quiz')
          const data = await res.json()
          if (Array.isArray(data)) setQuestions(data)
          else throw new Error('Invalid JSON')
        } catch {
          alert('Error loading GPT questions – using local defaults.')
          setQuestions(localQuestions)
          setSource('local')
        }
      }
      setLoading(false)
    }
    load()
  }, [source])

  const q = questions[idx]!
  const submit = () => {
    if (!answer.trim()) return
    if (answer.trim().toLowerCase() === q.term.toLowerCase()) setScore(s => s + 1)
    setShowAns(true)
    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx(i => i + 1); setAnswer(''); setShowHint(false); setShowAns(false)
      } else setDone(true)
    }, 2000)
  }

  if (loading) return <p className="text-center mt-20">Loading…</p>

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-sm w-full">
          <h2 className="text-3xl font-bold mb-4">🎉 Complete!</h2>
          <p className="text-2xl mb-6">Score: {score}/{questions.length} ({pct}%)</p>
          <button onClick={() => setSource('local')} className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold">Restart Local</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setSource('local')} className={`${source==='local'?'underline font-bold':''}`}>Curated Quiz</button>
          <button onClick={() => setSource('gpt')} className={`${source==='gpt'?'underline font-bold':''}`}>Live Llama 3 Quiz</button>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Question {idx+1} of {questions.length}</h3>
          <p className="text-lg mb-4">{q.definition}</p>
          <div className="flex gap-2 mb-4">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">{q.category}</span>
            <span className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm">{q.difficulty}</span>
          </div>
          {showHint
            ? <p className="bg-orange-500/20 p-4 rounded-lg border-l-4 border-orange-400 italic mb-4">💡 {q.hint}</p>
            : <button onClick={() => setShowHint(true)} className="text-white underline mb-4">Show Hint</button>
          }
        </div>
        {showAns
          ? <div className="bg-green-500/20 p-4 rounded-lg mb-4 border-l-4 border-green-400 text-white text-center">{answer.trim().toLowerCase()===q.term.toLowerCase()?'✅ Correct':'❌ Wrong: '+q.term}</div>
          : (
            <div className="flex gap-3 mb-4">
              <input type="text" value={answer} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Your answer" className="flex-1 p-3 rounded-lg bg-white text-black" />
              <button onClick={submit} className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold text-white">Submit</button>
            </div>
          )
        }
        <p className="text-center">Score: {score} / {questions.length}</p>
      </div>
    </div>
  )
}
