import { MessageArraySchema } from "@/lib/validators/message"
import { ChatGPTMessage, OpenAIStream, OpenAIStreamPayload } from "@/lib/openai-stream"
import { chatbotPrompt } from "../../helpers/constants/chatbot-prompt"

export async function POST(request: Request) {
    const { messages } = await request.json()

    const parsedMessages = MessageArraySchema.parse(messages)

    const outboundMessages: ChatGPTMessage[] = parsedMessages.map(message => ({
        role: message.isUserInput ? 'user' : 'system',
        content: message.text
    }))

    outboundMessages.unshift({
        role: 'system',
        content: chatbotPrompt
    })

    const payload: OpenAIStreamPayload = {
        model: 'gpt-3.5-turbo',
        messages: outboundMessages,
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 150,
        stream: true,
        n: 1
    }
console.log('dasdas')
    const stream = await OpenAIStream(payload)

    return new Response(stream)
}
  