import {PromptManagerState} from "../PromptManager/state/prompt-manager-state.ts";
import {AgentTreeState} from "@app/AgentSelectionModal/AgentTreeView/state/agent-tree-state.ts";
import {MessageStackState} from "@app/common/MessageStack/state/message-stack-state.ts";
import {observable} from "mobx";
import {Agent} from "@app/PromptManager/api/types.ts";

export class ApplicationState {
    public promptManagerState = new PromptManagerState();
    public agentTreeState = new AgentTreeState();
    public messageStackState = new MessageStackState();

    @observable.ref accessor selectedAgent: Agent | null = null;
    @observable accessor showAgentSelectionDialog: boolean = true;
}

const applicationState = new ApplicationState();

export const useApplicationState = () => applicationState;