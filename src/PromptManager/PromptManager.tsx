import {PromptEditor} from "./PromptEditor/PromptEditor.tsx";
import {Button, CircularProgress} from "@mui/material";
import {FC, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {AsyncResultStatus} from "../common/async-utils.ts";
import {useStyles} from "./PromptManager.styles.ts";
import {PromptManagerState, TabNames} from "./state/prompt-manager-state.ts";
import {PromptList} from "@app/PromptManager/PromptList/PromptList.tsx";
import {Route, Routes, useNavigate, useParams} from "react-router";

export const PromptManager: FC = observer(() => {
    const {id} = useParams();
    const [state] = useState(new PromptManagerState());
    const styles = useStyles();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            state.loadAgent(+id);
        }
    }, [state, id]);

    useEffect(() => {
        if (state.agent.value) {
            state.loadMinions();
            state.loadQueryTemplates();
        }
    }, [state, state.agent.value])

    const handleSaveClick = () => {
        (async () => {
            try {
                await state.saveTemplates();
                messageStackState.showMessage({text: 'Изменения сохранены', severity: 'success'});
            } catch (error: unknown) {
                messageStackState.showMessage({text: (error as Error).message, severity: 'error'});
            }
        })();
    }

    const handleTabChange = (_: unknown, tabName: TabNames) => {
        state.currentTab = tabName;
        if (state.agent.value?.id) {
            navigate(`/results/${state.agent.value.id}`);
        }
    }

    const commonTools = () => (
        <div>
            <Button onClick={handleSaveClick}>
                Сохранить
            </Button>
        </div>
    )

    if (state.agent.status === AsyncResultStatus.pending) {
        return (
            <div className={styles.progressScreen}>
                <CircularProgress/>
            </div>
        )
    }

    return (
        <>
            <div className={styles.content}>
                <Routes>
                    <Route path={'/:id/template'} element={
                        <>
                            <PromptList state={state}/>
                            <PromptEditor
                                commonTools={commonTools()}
                                state={state}
                            />
                        </>
                    }/>
                </Routes>
            </div>
        </>
    )
})