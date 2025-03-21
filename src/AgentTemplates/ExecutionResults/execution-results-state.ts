import {action, observable} from "mobx";
import {AsyncResult, toAsyncResult} from "@app/common/async-utils.ts";
import {AiRequest, AiRequestSet, loadAiRequestSets} from "@app/api/request-api.ts";
import {Agent} from "@app/api/types.ts";

export class ExecutionResultsState {
    @observable accessor requestSets = new AsyncResult<AiRequestSet[]>();
    @observable accessor selectedRequest: AiRequest | null = null;
    @observable accessor selectedSet: AiRequestSet | null = null;

    constructor(public agent: Agent) {}

    @action
    loadRequestSets() {
        toAsyncResult(
            async () => {
                return loadAiRequestSets(this.agent.id)
            },
            this.requestSets,
        )
    }
}
