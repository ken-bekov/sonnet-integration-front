import {observable, runInAction} from "mobx";

export enum AsyncResultStatus {
    pending,
    fulfilled,
    rejected
}

export class AsyncResult<T> {
    @observable accessor value: T | undefined;
    @observable accessor status: AsyncResultStatus = AsyncResultStatus.pending;
    @observable accessor error: Error | undefined;
}

export function toAsyncResult<T>(func: () => Promise<T>, result?: AsyncResult<T>): AsyncResult<T> {
    const asyncResult = result || new AsyncResult<T>();
    runInAction(() => {
        asyncResult.error = undefined;
        asyncResult.status = AsyncResultStatus.pending;
    })
    func()
        .then(result => {
            runInAction(() => {
                asyncResult.value = result;
                asyncResult.status = AsyncResultStatus.fulfilled;
            })
        })
        .catch(error => {
            runInAction(() => {
                asyncResult.status = AsyncResultStatus.rejected;
                asyncResult.error = error;
            })
        });
    return asyncResult;
}

export enum AsyncActionStatus {
    processing,
    done,
    error,
}