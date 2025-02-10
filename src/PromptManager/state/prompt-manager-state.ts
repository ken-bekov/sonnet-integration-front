import {action, computed, observable, toJS} from "mobx";
import {Agent, AiAnswer, AiQueryTemplate, Minion} from "../api/types.ts";
import {
    createNewTemplateForAgent,
    deleteTemplate,
    generateRequest,
    loadTemplates,
    saveTemplate
} from "../api/template-api.ts";
import {AsyncResult, toAsyncResult} from "../../common/async-utils.ts";
import {loadAgent, loadMinionsByAgentId} from "../api/structure-api.ts";
import {getAiAnswer} from "../api/ai-api.ts";

export enum TabNames {
    editor,
    result,
}

export class PromptManagerState {
    @observable accessor currentTab = TabNames.editor;
    @observable accessor selectedTemplateIndex = -1;

    @observable accessor queryTemplates = new AsyncResult<AiQueryTemplate[]>();
    @observable accessor agent = new AsyncResult<Agent>();

    @observable accessor minions = new AsyncResult<Minion[]>();
    @observable accessor generatedRequest: AsyncResult<string> | null = null;
    @observable accessor aiAnswer: AsyncResult<AiAnswer | null> | null = null;

    @observable accessor isProcessingTemplates = false;

    constructor() {
    }

    private getUniqueTemplateName() {
        let index = 1;
        let uniqueName = `Template_${index}`;
        while (this.queryTemplates.value?.find(template => template.name === uniqueName)) {
            uniqueName = `Template_${++index}`;
        }
        return uniqueName;
    }

    @computed get selectedTemplate() {
        return this.queryTemplates.value?.[this.selectedTemplateIndex];
    }

    @action
    loadAgent(agentId: number) {
        toAsyncResult(async () => {
            return await loadAgent(agentId);
        }, this.agent);
    }

    @action
    loadQueryTemplates() {
        const agent = this.agent.value;
        if (!agent?.id) {
            return;
        }

        toAsyncResult<AiQueryTemplate[]>(async () => {
            const loadedTemplates = await loadTemplates(agent.id);
            if (loadedTemplates) {
                return loadedTemplates;
            }

            return [];
        }, this.queryTemplates);
    }

    @action
    loadMinions() {
        const agent = this.agent.value;
        if (agent?.id) {
            this.minions = toAsyncResult(() => {
                return loadMinionsByAgentId(agent.id)
            })
        }
    }

    @action
    generateRequest() {
        this.generatedRequest = toAsyncResult(async () => {
            if (this.queryTemplates.value) {
                return generateRequest(this.queryTemplates.value.map(template => ({
                    name: template.name,
                    text: template.text,
                })), {});
            }
            return '';
        })
    }

    @action
    async addNewTemplate() {
        const agent = this.agent.value;
        if (!agent?.id) {
            return;
        }

        this.isProcessingTemplates = true;
        try {
            const uniqueName = this.getUniqueTemplateName();
            const template: AiQueryTemplate = {
                agent_id: agent.id,
                name: uniqueName,
                text: '',
            };

            const id = await createNewTemplateForAgent(template);
            if (id) {
                template.id = id;
                this.queryTemplates.value?.push(template);
            }
        } finally {
            this.isProcessingTemplates = false;
        }
    }

    async saveTemplate(template: AiQueryTemplate) {
        if (this.queryTemplates.value !== undefined) {
            return saveTemplate(toJS(template));
        }
    }

    async saveTemplates() {
        const templates = this.queryTemplates.value;
        if (!templates) {
            return;
        }

        this.isProcessingTemplates = true;
        try {
            for(const template of templates) {
                await saveTemplate(template);
            }
        } finally {
            this.isProcessingTemplates = false;
        }
    }

    @action
    async getAiAnswer() {
        this.aiAnswer = toAsyncResult(async () => {
            if (this.generatedRequest?.value) {
                return getAiAnswer(this.generatedRequest?.value);
            }
            return null;
        });
    }

    @action
    async deleteTemplate(templateId: number) {
        const agent = this.agent.value;
        if (!agent?.id) {
            return;
        }

        this.isProcessingTemplates = true;
        try {
            await deleteTemplate(templateId);
        } finally {
            this.isProcessingTemplates = false;
        }
    }
}