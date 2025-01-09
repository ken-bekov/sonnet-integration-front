import React from "react";
import {observer} from "mobx-react-lite";
import {Alert, Snackbar} from "@mui/material";
import {MessageStackState} from "@app/common/MessageStack/state/message-stack-state.ts";

interface MessageStackProps {
    state: MessageStackState;
}

export const MessageStack: React.FC<MessageStackProps> = observer(({state}) => {
    const {messageStack} = state;

    return (
        messageStack.map((message, index) => (
            <Snackbar
                key={`${index}${message}`}
                open={true}
                style={{transform: `translateY(${index * -55}px)`}}
                disableWindowBlurListener
            >
                <Alert severity={message.severity}>{message.text}</Alert>
            </Snackbar>
        ))
    )
})