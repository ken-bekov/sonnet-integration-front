import {AiAnswer} from "@app/PromptManager/api/types.ts";

export async function getAiAnswer(request: string): Promise<AiAnswer> {
    const response = await fetch('http://localhost:9090/ai/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({message: request}),
    });

    const result = await response.json();
    return result.answer;
}