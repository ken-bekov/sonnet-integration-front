import {AiQueryTemplate} from "./types.ts";
import {AI_HOST_URL} from "@app/common/globals.ts";

export const createNewTemplateForAgent = async (template: AiQueryTemplate) => {
    const response = await fetch(`${AI_HOST_URL}/template`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({template}),
    });

    if (!response.ok) {
        throw new Error(`Error on creating template: ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.templateId;
}

export const deleteTemplate = async (templateId: number) => {
    const response = await fetch(`${AI_HOST_URL}/template/${templateId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Error on deleting template: ${response.status}: ${response.statusText}`);
    }
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

export const loadTemplates = async (agentId: number) => {
    const response = await fetch(`${AI_HOST_URL}/template?agent_id=${agentId}`);
    const data = await response.json();
    return (data.templates || []) as AiQueryTemplate[];
}