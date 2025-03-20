import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {ExecutionResultsState} from "@app/AgentTemplates/ExecutionResults/execution-results-state.ts";
import {ResultList} from "@app/AgentTemplates/ExecutionResults/ResultList/ResultList.tsx";
import { useStyles } from "./ExecutionResults.styles";
import {Button, Tab, Tabs} from "@mui/material";
import {AiRequestSetStatus} from "@app/api/request-api.ts";

interface ExecutionResultsProps {
    state: ExecutionResultsState;
}

export const ExecutionResults: React.FC<ExecutionResultsProps> = observer((props) => {
    const {state} = props;
    const {requestSets, agent, selectedRequest, selectedSet} = state;
    const styles = useStyles();
    const [currentTab, setCurrentTab] = useState('response');

    useEffect(() => {
        if (requestSets) {
            state.loadRequestSets();
        }
    }, [state, agent.id]);

    const handleRefresh = () => {
        if (requestSets) {
            state.loadRequestSets();
        }
    }

    const handleChangeTab = (_: React.SyntheticEvent, value: string) => {
        setCurrentTab(value);
    }

    return (
        <div className={styles.executionResults}>
            <div className={styles.treeView}>
                <Button onClick={handleRefresh}>Обновить</Button>
                {!!requestSets.value && (
                    <ResultList
                        resultSets={requestSets.value}
                        selectedResult={state.selectedRequest}
                        onSelectResult={(request) => {
                            state.selectedSet = null;
                            state.selectedRequest = request;
                        }}
                        onSelectSet={(set) => {
                            state.selectedRequest = null;
                            state.selectedSet = set;
                        }}
                    />
                )}
            </div>
            <div className={styles.content}>
                {!!selectedRequest && (
                    <>
                        <Tabs onChange={handleChangeTab} value={currentTab}>
                            <Tab label='Ответ' value='response'/>
                            <Tab label='Промпт' value='propmt'/>
                            <Tab label='Ошибки' value='errors'/>
                        </Tabs>
                        {currentTab === 'response' && (
                            <textarea
                                className={styles.textArea}
                                value={selectedRequest.response}
                                readOnly
                            />
                        )}
                        {currentTab === 'propmt' && (
                            <textarea
                                className={styles.textArea}
                                value={selectedRequest.prompt}
                                readOnly
                            />
                        )}
                        {currentTab === 'errors' && (
                            <textarea
                                className={styles.textArea}
                                value={selectedRequest.error}
                                readOnly
                            />
                        )}
                    </>
                )}
                {!!selectedSet && (
                    <div>
                        {selectedSet.state === AiRequestSetStatus.processing && (
                            <span>In progress...</span>
                        )}
                        {selectedSet.state === AiRequestSetStatus.done && (
                            <span>Done</span>
                        )}
                        {selectedSet.state === AiRequestSetStatus.error && (
                            <span>Error: {selectedSet.error}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
})
