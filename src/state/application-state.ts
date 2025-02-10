import {AgentTreeState} from "@app/AgentSelectionModal/AgentTreeView/state/agent-tree-state.ts";
import {MessageStackState} from "@app/common/MessageStack/state/message-stack-state.ts";
import {action, observable} from "mobx";
import {Agent} from "@app/api/types.ts";

export class ApplicationState {
    public agentTreeState = new AgentTreeState();
    public messageStackState = new MessageStackState();

    @observable.ref accessor selectedAgent: Agent | null = null;
    @observable accessor showAgentSelectionDialog: boolean = true;

    @action
    setSelectedAgent(agent: Agent | null) {
        this.selectedAgent = agent;
    }
}

const applicationState = new ApplicationState();

export const useApplicationState = () => applicationState;