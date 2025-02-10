import {action, computed, observable} from "mobx";
import {AsyncResult, toAsyncResult} from "@app/common/async-utils.ts";
import {Agent, AiQueryTemplate, Minion} from "@app/PromptManager/api/types.ts";
import {
    createNewTemplateForAgent,
    deleteTemplate,
    loadTemplates,
    saveTemplate
} from "@app/PromptManager/api/template-api.ts";
import {runQuerySet} from "@app/PromptManager/api/request-api.ts";
import {loadMinionsByAgentId} from "@app/PromptManager/api/structure-api.ts";

export class PromptEditorState {
    @observable accessor templates = new AsyncResult<AiQueryTemplate[]>();
    @observable accessor minions = new AsyncResult<Minion[]>();

    @observable accessor selectedTemplateIndex = -1;
    @observable accessor isChangingTemplateList = false;

    constructor(public agent: Agent) {
    }

    @computed
    get selectedTemplate() {
        const templates = this.templates.value;

        return templates && this.selectedTemplateIndex > -1
            ? templates[this.selectedTemplateIndex]
            : null;
    }

    @action
    loadQueryTemplates() {
        toAsyncResult<AiQueryTemplate[]>(async () => {
            const loadedTemplates = await loadTemplates(this.agent.id);
            if (loadedTemplates) {
                return loadedTemplates;
            }

            return [];
        }, this.templates);
    }

    @action
    async addNewTemplate() {
        const getUniqueTemplateName = () => {
            let index = 1;
            let uniqueName = `Template_${index}`;
            while (this.templates.value?.find(template => template.name === uniqueName)) {
                uniqueName = `Template_${++index}`;
            }
            return uniqueName;
        }

        if (!this.agent.id) {
            return;
        }

        this.isChangingTemplateList = true;
        try {
            const uniqueName = getUniqueTemplateName();
            const template: AiQueryTemplate = {
                agent_id: this.agent.id,
                name: uniqueName,
                text: '',
            };

            const id = await createNewTemplateForAgent(template);
            if (id) {
                template.id = id;
                this.templates.value?.push(template);
            }
        } finally {
            this.isChangingTemplateList = false;
        }
    }

    @action
    async deleteTemplate(templateId: number) {
        this.isChangingTemplateList = true;
        try {
            await deleteTemplate(templateId);
        } finally {
            this.isChangingTemplateList = false;
        }
    }

    async saveTemplates() {
        const templates = this.templates.value;
        if (!templates) {
            return;
        }

        for (const template of templates) {
            await saveTemplate(template);
        }
    }

    @action
    async executeTemplates() {
        await runQuerySet(this.agent.id);
    }

    @action
    loadMinions() {
        toAsyncResult(
            () => {
                return loadMinionsByAgentId(this.agent.id)
            },
            this.minions,
        );
    }
}