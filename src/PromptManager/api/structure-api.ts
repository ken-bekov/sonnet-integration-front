import {Company, Minion} from "./types.ts";
import {makeAutoObservable} from "mobx";

export const loadCompanies = async (): Promise<Company[]> => {
    const response = await fetch('http://localhost:9090/structure/tree');

    if (response.ok) {
        const companies = await response.json();
        for (const company of companies) {
            for (const branch of company.branches) {
                branch.company = company;
                for (const factory of branch.factories) {
                    factory.branch = branch;
                    for (const agent of factory.agents) {
                        agent.factory = factory;
                    }
                }
            }
        }
        return companies.map((company: Company) => makeAutoObservable(company, {branches: false}));
    }

    throw new Error('Can\'t load agents tree');
}

export const loadMinionsByAgentId = async (agentId: number): Promise<Minion[]> => {
    const response = await fetch(`http://localhost:9090/structure/agent/${agentId}/minion`);
    if (response.ok) {
        const body = await response.json();
        return body.result;
    }

    throw new Error(`Can't load minions for agent with id ${agentId}`);
}