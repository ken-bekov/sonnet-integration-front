import {observable, runInAction} from "mobx";

export enum AsyncStatus {
    pending,
    fulfilled,
    rejected
}

export class AsyncResult<T> {
    @observable accessor value: T | undefined;
    @observable accessor status: AsyncStatus = AsyncStatus.pending;
    @observable accessor error: Error | undefined;
}

export function toAsyncResult<T>(func: () => Promise<T>): AsyncResult<T> {
    const asyncResult = new AsyncResult<T>();
    asyncResult.status = AsyncStatus.pending;
    func()
        .then(result => {
            runInAction(() => {
                asyncResult.status = AsyncStatus.fulfilled;
                asyncResult.value = result;
            })
        })
        .catch(error => {
            runInAction(() => {
                asyncResult.status = AsyncStatus.rejected;
                asyncResult.error = error;
            })
        });
    return asyncResult;
}