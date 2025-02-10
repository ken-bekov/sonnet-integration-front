import React from "react";
import {useStyles} from "@app/PromptManager/PromptList/PromptList.styles.ts";
import {Button, IconButton, List, ListItemButton, Tooltip} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {observer} from "mobx-react-lite";
import {PromptEditorState} from "@app/PromptEditor/prompt-editor-state.ts";

interface PromptListProps {
    state: PromptEditorState;
}

export const PromptList: React.FC<PromptListProps> = observer((props) => {
    const {state} = props;
    const styles = useStyles();

    const handleListItemClick = (index: number) => {
        state.selectedTemplateIndex = index;
    }

    const handleAddClick = () => {
        if (state.isChangingTemplateList) {
            return;
        }

        (async () => {
            await state.addNewTemplate();
            state.loadQueryTemplates();
        })();
    }

    const handleDeleteClick = (templateId: number) => {
        (async () => {
            await state.deleteTemplate(templateId);
            state.loadQueryTemplates();
        })()
    }

    return (
        <div className={styles.promptList}>
            <div className={styles.toolbar}>
                <Tooltip title='Добавить запрос'>
                    <Button
                        onClick={() => handleAddClick()}
                        disabled={state.isChangingTemplateList}
                    >
                        Добавить
                    </Button>
                </Tooltip>
            </div>
            <List component='nav'>
                {state.templates.value?.map((template, index) => (
                    <ListItemButton
                        key={template.id}
                        onClick={() => handleListItemClick(index)}
                        selected={state.selectedTemplateIndex === index}
                    >
                        <div className={styles.item}>
                            {template.name || 'template'}
                            <IconButton onClick={() => template.id && handleDeleteClick(template.id)}>
                                <Delete/>
                            </IconButton>
                        </div>
                    </ListItemButton>
                ))}
            </List>
        </div>
    )
})