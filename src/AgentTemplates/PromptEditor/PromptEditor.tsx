import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {PromptEditorState} from "./prompt-editor-state.ts";
import {ProgressScreen} from "@app/common/ProgressScreen/ProgressScreen.tsx";
import {AsyncResultStatus} from "@app/common/async-utils.ts";
import {observer} from "mobx-react-lite";
import {PromptList} from "@app/PromptManager/PromptList/PromptList.tsx";
import {useStyles} from "./PromptEditor.styles.ts";
import {Button, Menu, MenuItem} from "@mui/material";
import {useApplicationState} from "@app/state/application-state.ts";
import { ValueInsertModal } from "@app/PromptManager/PromptEditor/ValueInsertModal/ValueInsertModal";
import {AiQueryTemplate, Minion, MinionTypeNames, TrendName} from "@app/PromptManager/api/types.ts";
import dayjs from "dayjs";
import {KeyboardArrowDown} from '@mui/icons-material';
import {TemplateListModal} from "@app/AgentTemplates/TemplateListModal/TemplateListModal.tsx";

interface PromptEditorProps {
    state: PromptEditorState;
}

export const PromptEditor: React.FC<PromptEditorProps> = observer((props) => {
    const {state} = props;
    const {agent, templates, selectedTemplate, minions} = state;
    const appState = useApplicationState();
    const {messageStackState} = appState;
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);
    const [isRequestListModalOpen, setRequestListModalOpen] = useState(false);
    const [insertMenuAnchorEl, setInsertMenuAnchorEl] = useState<null | HTMLElement>(null);


    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const styles = useStyles();

    useEffect(() => {
        if (agent && !state.templates.value) {
            state.loadQueryTemplates();
            state.loadMinions();
        }
    }, [state, agent]);

    if (
        templates.status === AsyncResultStatus.pending
    ) {
        return (<ProgressScreen text='Loading Agent data...'/>)
    }

    const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (selectedTemplate) {
            selectedTemplate.text = event.target.value;
        }
    }

    const handleSaveClick = () => {
        (async () => {
            try {
                await state.saveTemplates();
                messageStackState.showMessage({text: 'Изменения сохранены', severity: 'success'});
            } catch (error: unknown) {
                messageStackState.showMessage({text: (error as Error).message, severity: 'error'});
            }

        })()
    }

    const handleExecuteClick = () => {
        (async () => {
            await state.executeTemplates();
        })();
    }

    const handleInsert = (minion: Minion, trendName: TrendName, fromDate: Date, toDate: Date) => {
        const textArea = textAreaRef.current;
        if (!textArea || !state.selectedTemplate) {
            return;
        }

        if (minion.type?.name === MinionTypeNames.Trend) {
            const fromDateStr = dayjs(fromDate).format('YYYY-MM-DD');
            const toDateStr = dayjs(toDate).format('YYYY-MM-DD');
            const trendTag = `{{trend ${trendName.id} '${fromDateStr}' '${toDateStr}'}}`;
            const currentPosition = textArea.selectionStart;
            const templateText = state.selectedTemplate.text;
            state.selectedTemplate.text =
                templateText.substring(0, currentPosition) + `${trendName.name}\n` +
                trendTag + templateText.substring(currentPosition, templateText.length);
        }

        setInsertModalOpen(false);
    }

    function insertTemplateTag(template: AiQueryTemplate) {
        const textArea = textAreaRef.current;
        if (!textArea || !state.selectedTemplate) {
            return;
        }

        const currentPosition = textArea.selectionStart;
        const templateText = state.selectedTemplate.text;
        state.selectedTemplate.text =
            templateText.substring(0, currentPosition) +
            `{{query_${template.id}}}` +
            templateText.substring(currentPosition, templateText.length);
        setRequestListModalOpen(false);
    }

    return (
        <>
            <div className={styles.promptEditor}>
                <PromptList state={state}/>
                {!!selectedTemplate && (
                    <div className={styles.rightSide}>
                        <div>
                            <Button
                                onClick={(event) =>
                                    setInsertMenuAnchorEl(event.target as HTMLElement)
                                }
                                endIcon={<KeyboardArrowDown/>}
                            >
                                Вставить
                            </Button>
                            <Menu
                                anchorEl={insertMenuAnchorEl}
                                open={!!insertMenuAnchorEl}
                                onClose={() => setInsertMenuAnchorEl(null)}
                            >
                                <MenuItem onClick={() => {
                                    setInsertModalOpen(true);
                                    setInsertMenuAnchorEl(null);
                                }}>
                                    Метрика
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    setRequestListModalOpen(true);
                                    setInsertMenuAnchorEl(null);
                                }}>
                                    Ссылка на запрос
                                </MenuItem>
                            </Menu>
                            <Button
                                onClick={handleSaveClick}
                            >
                                Сохранить
                            </Button>
                            <Button
                                onClick={handleExecuteClick}
                            >
                                Запустить
                            </Button>
                        </div>
                        <textarea
                            ref={textAreaRef}
                            className={styles.textArea}
                            onChange={handleValueChange}
                            value={selectedTemplate?.text}
                        />
                    </div>
                )}
            </div>
            <ValueInsertModal
                loading={!minions.value}
                minions={minions.value}
                open={isInsertModalOpen}
                onClose={() => setInsertModalOpen(false)}
                onInsert={handleInsert}
            />
            {selectedTemplate && (
                <TemplateListModal
                    open={isRequestListModalOpen}
                    onClose={() => setRequestListModalOpen(false)}
                    templates={templates.value || []}
                    targetTemplate={selectedTemplate}
                    onTemplateSelected={(template) => insertTemplateTag(template)}
                />
            )}
        </>
    )
})