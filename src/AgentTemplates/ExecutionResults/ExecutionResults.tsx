import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {ExecutionResultsState} from "@app/AgentTemplates/ExecutionResults/execution-results-state.ts";
import {ResultList} from "@app/AgentTemplates/ExecutionResults/ResultList/ResultList.tsx";
import { useStyles } from "./ExecutionResults.styles";
import {Button} from "@mui/material";

interface ExecutionResultsProps {
    state: ExecutionResultsState;
}

export const ExecutionResults: React.FC<ExecutionResultsProps> = observer((props) => {
    const {state} = props;
    const {requestSets, agent, selectedRequest} = state;
    const styles = useStyles();

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

    return (
        <div className={styles.executionResults}>
            <div className={styles.treeView}>
                <Button onClick={handleRefresh}>Обновить</Button>
                {!!requestSets.value && (
                    <ResultList
                        resultSets={requestSets.value}
                        selectedRequest={state.selectedRequest}
                        onSelectedChange={(request) => {
                            state.selectedRequest = request;
                        }}
                    />
                )}
            </div>
            <div className={styles.content}>
                {!!selectedRequest && (
                    <textarea
                        className={styles.textArea}
                        value={selectedRequest.response} readOnly
                    />
                )}
            </div>
        </div>
    )
})