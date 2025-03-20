import {AI_HOST_URL} from "@app/common/globals.ts";

export interface AiRequest {
    id?: number;
    name: string;
    request_set_id?: number;
    state: string;
    template: string;
    prompt: string;
    response: string;
    error: string;
    start_time?: Date;
    end_time?: Date;
}

export interface AiRequestSet {
    id: number;
    agentId: number;
    requests: AiRequest[];
    create_time: Date;
    state: AiRequestSetStatus;
    error: string;
}

export enum AiRequestSetStatus {
    processing = 'processing',
    done = 'done',
    error = 'error',
}

export const runQuerySet = async (agentId: number) => {
    const response = await fetch(`${AI_HOST_URL}/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({agentId})
    });
    if (response.ok) {
        return;
    }
}

export const loadAiRequestSets = async (agentId: number): Promise<AiRequestSet[]> => {
    const response = await fetch(`${AI_HOST_URL}/query/set?agentId=${agentId}`);
    if (response.ok) {
        const result = await response.json();
        return result.requestSets;
    }
    return [];
}
