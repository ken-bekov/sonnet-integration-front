import {PromptEditor} from "./PromptEditor/PromptEditor.tsx";
import {Button, CircularProgress, Tab, Tabs, Typography, useTheme} from "@mui/material";
import {FC, useEffect} from "react";
import {PromptView} from "./PromptView/PromptView.tsx";
import {useApplicationState} from "../state/application-state.ts";
import {observer} from "mobx-react-lite";
import {AsyncStatus} from "../common/async-utils.ts";
import {AiResponse} from "./AiResponse/AiResponse.tsx";
import {getHeaderStyles, progressScreenStyle, promptManagerStyle} from "./PromptManager.styles.ts";
import {TabNames} from "./state/prompt-manager-state.ts";

export const PromptManager: FC = observer(() => {
    const appState = useApplicationState();
    const {promptManagerState, selectedAgent, messageStackState} = appState;
    const {queryTemplate, currentTab} = promptManagerState;
    const theme = useTheme();

    useEffect(() => {
        if (selectedAgent) {
            promptManagerState.loadQueryTemplate(selectedAgent.id);
            promptManagerState.loadMinions(selectedAgent.id);
        }
    }, [selectedAgent])

    const handleSaveClick = () => {
        (async () => {
            try{
                const id = await promptManagerState.saveTemplate();
                if (queryTemplate.value) {
                    queryTemplate.value.id = id;
                }
                messageStackState.showMessage({text: 'Изменения сохранены', severity: 'success'});
            } catch (error: unknown) {
                messageStackState.showMessage({text: (error as Error).message, severity: 'error'});
            }
        })();
    }

    const handleTabChange = (_: unknown, tabName: TabNames) => {
        promptManagerState.currentTab = tabName;
    }

    const commonTools = () => (
        <div>
            <Button onClick={handleSaveClick}>
                Сохранить
            </Button>
        </div>
    )

    if (queryTemplate.status === AsyncStatus.pending) {
        return (
            <div className={progressScreenStyle}>
                <CircularProgress/>
            </div>
        )
    }

    const factory = selectedAgent?.factory;
    const branch = factory?.branch;
    const company = branch?.company;

    return (
        <>
            {queryTemplate.value && (
                <div className={promptManagerStyle}>
                    <div className={getHeaderStyles(theme)}>
                        {selectedAgent && (
                            <>
                                <Typography color={theme.palette.grey["800"]} fontWeight='500'>
                                    {selectedAgent.device_name}
                                </Typography>
                                {factory && branch && company && (
                                    <Typography color={theme.palette.grey["700"]} fontSize='0.9rem'>
                                        {`(${company.name}/${branch.name}/${factory.name})`}
                                    </Typography>
                                )}
                                <Button
                                    size='small'
                                    onClick={() => appState.showAgentSelectionDialog = true}
                                >
                                    изменить
                                </Button>
                            </>
                        )}
                    </div>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab label="Шаблон" value={TabNames.editor}/>
                        <Tab label="Промпт" value={TabNames.prompt}/>
                        <Tab label="Ответ" value={TabNames.response}/>
                    </Tabs>
                    {currentTab === TabNames.editor && (
                        <PromptEditor commonTools={commonTools()}/>
                    )}
                    {currentTab === TabNames.prompt && (
                        <PromptView/>
                    )}
                    {currentTab === TabNames.response && (
                        <AiResponse/>
                    )}
                </div>
            )}
        </>
    )
})