import {AiQueryTemplate} from "./types.ts";

export const generateRequest = async (templateText: string, context: object = {}) => {
    const response = await fetch('http://localhost:9090/template/result', {
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
    const response = await fetch('http://localhost:9090/template', {
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
    const response = await fetch(`http://localhost:9090/template?agent_id=${agentId}`);
    const data = await response.json();
    return (data.templates[0] || {}) as AiQueryTemplate;
}