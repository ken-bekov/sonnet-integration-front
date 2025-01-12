import React from "react";
import {useApplicationState} from "../../state/application-state.ts";
import {AsyncStatus} from "../../common/async-utils.ts";
import {ProgressScreen} from "../../common/ProgressScreen/ProgressScreen.tsx";
import {getStyles} from "./AiResponse.styles.ts";
import {observer} from "mobx-react-lite";
import {EmptyScreen} from "@app/EmptyScreen/EmptyScreen.tsx";
import {Typography, useTheme} from "@mui/material";

export const AiResponse: React.FC = observer(() => {
    const {promptManagerState} = useApplicationState();
    const {aiAnswer} = promptManagerState;
    const {
        aiResponseStyles,
        statusBarStyles,
        textContainerStyles
    } = getStyles(useTheme());

    if (aiAnswer?.status === AsyncStatus.pending) {
        return <ProgressScreen text='ожидание ответа AI...'/>
    }

    if (aiAnswer === null) {
        return <EmptyScreen content={
            <Typography color='textSecondary'>Ответ еще не получен</Typography>
        }/>
    }

    if (!aiAnswer.value) {
        return <EmptyScreen content={
            <Typography color='textSecondary'>Пустой ответ</Typography>
        }/>
    }

    const {text, usage} = aiAnswer.value;
    const lines = text.split('\n');

    return (
        <div className={aiResponseStyles}>
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
            <div className={statusBarStyles}>
                <Typography color='textSecondary' fontSize='0.9rem'>
                    входящих токенов: {usage.input_tokens}
                </Typography>
                <Typography color='textSecondary' fontSize='0.9rem'>
                    исходящих токенов: {usage.output_tokens}
                </Typography>
            </div>
        </div>
    )
})