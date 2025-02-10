import React, {useEffect, useState} from "react";
import {AgentTemplatesState} from "@app/AgentTemplates/agent-templates-state.ts";
import {Route, Routes, useParams} from "react-router";
import {AsyncResultStatus} from "@app/common/async-utils.ts";
import {ProgressScreen} from "@app/common/ProgressScreen/ProgressScreen.tsx";
import {observer} from "mobx-react-lite";
import {PromptEditor} from "@app/AgentTemplates/PromptEditor/PromptEditor.tsx";
import {AgentTabs} from "@app/AgentTemplates/AgentTabs/AgentTabs.tsx";
import {useStyles} from "./AgentTemplates.styles.ts";
import {ExecutionResults} from "@app/AgentTemplates/ExecutionResults/ExecutionResults.tsx";
import {Button} from "@mui/material";
import {AgentSelectionModal} from "@app/AgentSelectionModal/AgentSelectionModal.tsx";

export const AgentTemplates: React.FC = observer(() => {

    const [state] = useState(new AgentTemplatesState())
    const[isAgentSelectionOpen, setAgentSelectionOpen] = useState(false);
    const {agent} = state;
    const {agentId} = useParams();
    const styles = useStyles();

    useEffect(() => {
        if (agentId && !isNaN(+agentId)) {
            state.loadAgent(+agentId);
        }
    }, [state, agentId]);

    if (agent.status === AsyncResultStatus.pending) {
        return (<ProgressScreen text='Loading Agent data...'/>)
    }

    return (
        <div className={styles.agentTemplates}>
            <div className={styles.header}>
                {agent.value?.device_name}
                <Button color='secondary' onClick={() => {setAgentSelectionOpen(true)}}>
                    Выбрать другой
                </Button>
            </div>
            <AgentTabs/>
            <div className={styles.container}>
                <Routes>
                    <Route path='/edit' index element={
                        state.editorState && <PromptEditor state={state.editorState}/>
                    }/>
                    <Route path='/result' index element={
                        state.executionState && <ExecutionResults state={state.executionState}/>
                    }/>
                </Routes>
            </div>
            <AgentSelectionModal
                open={isAgentSelectionOpen}
                onClose={() => setAgentSelectionOpen(false)}
            />
        </div>
    )
})