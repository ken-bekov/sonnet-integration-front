import {action, observable} from "mobx";
import {AsyncResult, toAsyncResult} from "@app/common/async-utils.ts";
import {Company} from "@app/PromptManager/api/types.ts";
import {loadCompanies} from "@app/PromptManager/api/structure-api.ts";

export class AgentTreeState {
    @observable accessor companies = new AsyncResult<Company []>();

    @action
    loadAgentTree() {
        this.companies = toAsyncResult(() => loadCompanies());
    }
}