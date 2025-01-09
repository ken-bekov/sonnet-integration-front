import {FC} from "react";
import {Button, Typography, useTheme} from "@mui/material";
import {useApplicationState} from "../../state/application-state.ts";
import {AsyncStatus} from "../../common/async-utils.ts";
import {observer} from "mobx-react-lite";
import {getStyles} from "./PromptView.styles.ts";
import {TabNames} from "../state/prompt-manager-state.ts";
import {ProgressScreen} from "../../common/ProgressScreen/ProgressScreen.tsx";
import {EmptyScreen} from "@app/EmptyScreen/EmptyScreen.tsx";

export const PromptView: FC = observer(() => {
    const {promptManagerState} = useApplicationState();
    const {generatedRequest} = promptManagerState;
    const theme = useTheme();
    const {
        promptViewStyles,
        statusBarStyles,
        textContainerStyles,
        toolbarStyles
    } = getStyles(theme);

    const text = generatedRequest?.value || '';
    const lines = text.split('\n');

    const handleSendClick = () => {
        promptManagerState.currentTab = TabNames.response;
        promptManagerState.getAiAnswer();
    }

    if (generatedRequest === null) {
        return <EmptyScreen content={
            <Typography color='textSecondary'>Промпт еще не сформирован</Typography>
        }/>
    }

    if (generatedRequest.status === AsyncStatus.pending) {
        return <ProgressScreen text='формирование промпта'/>
    }

    return (
        <div className={promptViewStyles}>
            <div className={toolbarStyles}>
                <Button onClick={handleSendClick}>Отправить</Button>
            </div>
            <div className={textContainerStyles}>
                <div>
                    {lines.map((line, index) => (
                        <span key={index}>
                        {line}<br/>
                    </span>
                    ))}
                </div>
            </div>
            <div className={statusBarStyles}>
                <Typography color='textSecondary'>
                    {`количество символов: ${text.length}`}
                </Typography>
            </div>
        </div>
    )
})