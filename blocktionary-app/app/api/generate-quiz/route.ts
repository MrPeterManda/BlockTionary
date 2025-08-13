import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function GET() {
  console.log('=== Starting Groq API call ===')
  
  try {
    console.log('Groq API key exists:', !!process.env.GROQ_API_KEY)
    console.log('Calling Groq...')
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a blockchain education expert. Generate quiz questions in valid JSON format only.'
        },
        {
          role: 'user',
          content: `Generate exactly 13 unique beginner-level blockchain quiz questions every time this prompt is run.

Return ONLY a JSON array. Each object must include:
- term: blockchain term (string)
- definition: clear and concise definition (string)
- hint: helpful analogy or example (string)
- difficulty: "beginner" (string)
- category: one of "basics", "defi", or "technical" (string)

Do not include any text outside the JSON array. No markdown, no explanations.
`
        }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 1000
    })

    const content = completion.choices[0]?.message?.content?.trim()
    console.log('Raw Groq response:', content)
    
    if (!content) {
      throw new Error('No content from Groq')
    }

    // Clean the response
    const cleanContent = content
      .replace(/```/g, '')
      .trim()
    
    const questions = JSON.parse(cleanContent)
    
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array')
    }
    
    console.log('Successfully parsed', questions.length, 'questions')
    return NextResponse.json(questions)
    
  } catch (err: any) {
    console.error('=== Groq ERROR ===')
    console.error('Error message:', err.message)
    
    // Fallback questions
    const fallbackQuestions = [
      {
        term: "DeFi",
        definition: "Decentralized Finance protocols that operate without traditional intermediaries",
        hint: "Banking services without banks",
        difficulty: "beginner",
        category: "defi"
      },
      {
        term: "Smart Contract",
        definition: "Self-executing contracts with terms written into code", 
        hint: "Like a vending machine - automatic when conditions are met",
        difficulty: "beginner",
        category: "technical"
      }
    ]
    
    return NextResponse.json(fallbackQuestions)
  }
}
