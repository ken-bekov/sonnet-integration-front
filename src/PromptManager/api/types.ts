export interface Agent {
    id: number;
    device_name: string;
    factory: Factory;
}

export interface Factory {
    id: number;
    name: string;
    branch: Branch;
    agents: Agent[];
}

export interface Branch {
    id: number;
    name: string;
    company: Company;
    factories: Factory[];
}

export interface Company {
    id: number;
    name: string;
    branches: Branch[];
}

export interface Trend {
    id: number;
    name: string;
}

export interface TrendName {
    id: number;
    name: string;
}

export interface MinionType {
    id: number;
    name: string;
}

export interface Minion {
    id: number;
    trendNames: TrendName[];
    type: MinionType;
}

export interface AiQueryTemplate {
    id?: number;
    agent_id: number;
    name: string;
    text: string;
    readonly modified_at?: string;
}

export interface AiAnswer {
    text: string;
    usage: {
        input_tokens: number;
        output_tokens: number;
    }
}

export enum MinionTypeNames {
    Trend= "Trend",
    Message= "Message",
    Spectrum= "Spectrum",
    Temperature= "Temperature",
    Oil= "Oil",
    TrendWireless= "TrendWireless",
    SpectrumWireless= "SpectrumWireless",
    TemperatureWireless= "TemperatureWireless",
    Raspberry= "Raspberry"
}