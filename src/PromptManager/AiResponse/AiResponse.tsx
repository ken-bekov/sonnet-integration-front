import React from "react";
import {useApplicationState} from "../../state/application-state.ts";
import {AsyncStatus} from "../../common/async-utils.ts";
import {ProgressScreen} from "../../common/ProgressScreen/ProgressScreen.tsx";
import {textContainerStyles} from "./AiResponse.styles.ts";
import {observer} from "mobx-react-lite";
import {EmptyScreen} from "@app/EmptyScreen/EmptyScreen.tsx";
import {Typography} from "@mui/material";

export const AiResponse: React.FC = observer(() => {
    const {promptManagerState} = useApplicationState();
    const {aiAnswer} = promptManagerState;
    const text = aiAnswer?.value || '';
    const lines = text.split('\n');

    if (aiAnswer === null) {
        return <EmptyScreen content={
            <Typography color='textSecondary'>Ответ еще не получен</Typography>
        }/>    }

    if (aiAnswer.status === AsyncStatus.pending) {
        return <ProgressScreen text='ожидание ответа AI'/>
    }

    return (
        <div className={textContainerStyles}>
            <div>
                {lines.map((line, index) => (
                    <React.Fragment key={index}>
                        <span>{line}</span>
                        <br/>
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
})