import {action, observable} from "mobx";
import {Agent} from "@app/PromptManager/api/types.ts";
import {AlertColor} from "@mui/material/Alert/Alert";

interface StackedMessage {
    text: string;
    severity?: AlertColor;
    delay?: number;
}

export class MessageStackState {
    @observable.ref accessor selectedAgent: Agent | null = null;
    @observable.ref accessor messageStack: StackedMessage[] = [];

    @action
    showMessage({text, delay = 3000, severity='info'}: StackedMessage) {
        const newMessage =  {text, delay, severity};
        this.messageStack = [...this.messageStack, newMessage];
        setTimeout(() => {
            this.removeMessage(newMessage);
        }, 3000);
    }

    @action
    private removeMessage(messageToDelete: StackedMessage) {
        this.messageStack = this.messageStack.filter(message => messageToDelete !== message);
    }
}