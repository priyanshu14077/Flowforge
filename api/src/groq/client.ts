import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function runLLMNode(
  model: string,
  prompt: string,
  systemPrompt?: string,
  context?: Record<string, unknown>
): Promise<string> {
  const messages: { role: 'system' | 'user'; content: string }[] = []

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }

  const contextPrefix = context
    ? `Context from previous steps:\n${JSON.stringify(context, null, 2)}\n\n`
    : ''

  messages.push({ role: 'user', content: contextPrefix + prompt })

  const completion = await groq.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2048,
  })

  return completion.choices[0]?.message?.content ?? ''
}