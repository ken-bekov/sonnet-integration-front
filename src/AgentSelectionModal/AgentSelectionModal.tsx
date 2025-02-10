import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle} from "@mui/material";
import {AgentTreeView} from "@app/AgentSelectionModal/AgentTreeView/AgentTreeView.tsx";
import {treeContainerStyles} from "@app/AgentSelectionModal/AgentSelectionModal.styles.ts";
import {Agent} from "@app/api/types.ts";
import {useNavigate} from "react-router";

export const AgentSelectionModal: React.FC<DialogProps> = (props) => {
    const [agent, setAgent] = useState<Agent | null>(null);
    const navigate = useNavigate();
    const {onClose} = props;

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
                <Button
                    onClick={() => {
                        if (agent) {
                            navigate(`/agent/${agent.id}/edit`);
                        }
                        onClose?.({}, 'escapeKeyDown');
                    }}
                    disabled={!agent}
                >
                    Перейти
                </Button>
                <Button onClick={() => onClose?.({}, 'escapeKeyDown')}>
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    )
}