import {AiQueryTemplate} from "./types.ts";
import {AI_HOST_URL} from "@app/common/globals.ts";

export const generateRequest = async (templateText: string, context: object = {}) => {
    const response = await fetch(`${AI_HOST_URL}/template/result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                template: templateText,
                context,
            }),
        }
    );
    const data = await response.json();
    return data.result;
}

export const saveTemplate = async (template: AiQueryTemplate) => {
    const response = await fetch(`${AI_HOST_URL}/template`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({template}),
    });
    if (response.ok) {
        const result = await response.json();
        return result.id as number;
    }
    throw new Error(`Ошибка при сохранении`);
}

export const loadTemplate = async (agentId: number) => {
    const response = await fetch(`${AI_HOST_URL}/template?agent_id=${agentId}`);
    const data = await response.json();
    return (data.templates[0] || {}) as AiQueryTemplate;
}