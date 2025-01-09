import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle} from "@mui/material";
import {AgentTreeView} from "@app/AgentSelectionModal/AgentTreeView/AgentTreeView.tsx";
import {treeContainerStyles} from "@app/AgentSelectionModal/AgentSelectionModal.styles.ts";
import {useApplicationState} from "@app/state/application-state.ts";
import {Agent} from "@app/PromptManager/api/types.ts";
import {runInAction} from "mobx";

export const AgentSelectionModal: React.FC<DialogProps> = (props) => {
    const appState = useApplicationState();
    const {selectedAgent} = appState;
    const [agent, setAgent] = useState<Agent | null>(null);

    return (
        <Dialog {...props}>
            <DialogTitle>
                Выбор агента
            </DialogTitle>
            <DialogContent>
                <div className={treeContainerStyles}>
                    <AgentTreeView onSelectedAgentChange={(agent) => setAgent(agent)}/>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    runInAction(() => {
                        appState.selectedAgent = agent;
                        appState.showAgentSelectionDialog = false;
                    })
                }}>
                    Выбрать
                </Button>
                {selectedAgent && (
                    <Button
                        onClick={() => {appState.showAgentSelectionDialog = false}}
                    >
                        Закрыть
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}