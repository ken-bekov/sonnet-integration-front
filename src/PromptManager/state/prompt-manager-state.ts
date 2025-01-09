import {action, observable, toJS} from "mobx";
import {AiQueryTemplate, Minion} from "../api/types.ts";
import {generateRequest, loadTemplate, saveTemplate} from "../api/template-api.ts";
import {AsyncResult, toAsyncResult} from "../../common/async-utils.ts";
import {loadMinionsByAgentId} from "../api/structure-api.ts";
import {getAiAnswer} from "../api/ai-api.ts";

export enum TabNames {
    editor,
    prompt,
    response,
}

export class PromptManagerState {
    @observable accessor currentTab = TabNames.editor;
    @observable accessor queryTemplate = new AsyncResult<AiQueryTemplate>();
    @observable accessor minions = new AsyncResult<Minion[]>();
    @observable accessor generatedRequest: AsyncResult<string> | null = null;
    @observable accessor aiAnswer: AsyncResult<string> | null = null;

    @action
    loadQueryTemplate(agentId: number) {
        this.queryTemplate = toAsyncResult<AiQueryTemplate>(async () => {

            const loadedTemplate = await loadTemplate(agentId);
            if (loadedTemplate.id) {
                return loadedTemplate;
            }

            return {
                agent_id: agentId,
                text: '',
            };
        });
        this.generatedRequest = null;
        this.aiAnswer = null;
    }

    @action
    loadMinions(agentId: number) {
        this.minions = toAsyncResult(() => {
            return loadMinionsByAgentId(agentId)
        })
    }

    @action
    generateRequest() {
        this.generatedRequest = toAsyncResult(async () => {
            if (this.queryTemplate.value) {
                return generateRequest(this.queryTemplate.value.text, {});
            }
            return '';
        })
    }

    async saveTemplate() {
        if (this.queryTemplate.value !== undefined) {
            return saveTemplate(toJS(this.queryTemplate.value));
        }
    }

    @action
    getAiAnswer() {
        this.aiAnswer = toAsyncResult(async () => {
            if (this.generatedRequest?.value) {
                return getAiAnswer(this.generatedRequest?.value);
            }
            return '';
        })
    }
}