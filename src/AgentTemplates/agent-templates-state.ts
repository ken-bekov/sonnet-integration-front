import {action, computed, observable} from "mobx";
import {AsyncResult, toAsyncResult} from "@app/common/async-utils.ts";
import {Agent} from "@app/PromptManager/api/types.ts";
import {loadAgent} from "@app/PromptManager/api/structure-api";
import {PromptEditorState} from "@app/AgentTemplates/PromptEditor/prompt-editor-state.ts";
import {ExecutionResultsState} from "@app/AgentTemplates/ExecutionResults/execution-results-state.ts";

export class AgentTemplatesState {
    @observable accessor agent = new AsyncResult<Agent>();

    @computed
    get editorState() {
        if (this.agent.value) {
            return new PromptEditorState(this.agent.value);
        }

        return null;
    }

    @computed
    get executionState() {
        if (this.agent.value) {
            return new ExecutionResultsState(this.agent.value);
        }

        return null;
    }

    @action
    loadAgent(agentId: number) {
        toAsyncResult(
            async () => {
                return await loadAgent(agentId);
            },
            this.agent
        );
    }
}