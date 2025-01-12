import {AiAnswer} from "@app/PromptManager/api/types.ts";
import {AI_HOST_URL} from "@app/common/globals.ts";

export async function getAiAnswer(request: string): Promise<AiAnswer> {
    const response = await fetch(`${AI_HOST_URL}/ai/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({message: request}),
    });

    const result = await response.json();
    return result.answer;
}