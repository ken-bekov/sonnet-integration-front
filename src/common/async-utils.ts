import {action, observable, runInAction} from "mobx";

export enum AsyncStatus {
    pending,
    fulfilled,
    rejected
}

export class AsyncResult<T> {
    @observable accessor value: T | undefined;
    @observable accessor status: AsyncStatus = AsyncStatus.pending;
    @observable accessor error: Error | undefined;
    
    @action
    fromPromise(func: () => Promise<T>) {
        this.status = AsyncStatus.pending;
        func()
            .then(result => {
                this.status = AsyncStatus.fulfilled;
                this.value = result;
            })
            .catch(error => {
                this.status = AsyncStatus.rejected;
                this.error = error;
            });
    }
}

export function toAsyncResult<T>(func: () => Promise<T>): AsyncResult<T> {
    const asyncResult = new AsyncResult<T>();
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