import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    List,
    ListItemButton
} from "@mui/material";
import React from "react";
import {AiQueryTemplate} from "@app/api/types.ts";
import {useStyles} from "./TemplateListModal.styles";

interface TemplateListModalProps extends DialogProps {
    templates: AiQueryTemplate[];
    targetTemplate: AiQueryTemplate;
    onTemplateSelected: (template: AiQueryTemplate) => void;
}

export const TemplateListModal: React.FC<TemplateListModalProps> = (props) => {
    const {templates, targetTemplate, onClose, onTemplateSelected} = props;
    const styles = useStyles();

    const handleTemplateSelection = (template: AiQueryTemplate) => {
        onTemplateSelected(template);
    }

    return (
        <Dialog {...props}>
            <DialogTitle>
                Выбор запроса
            </DialogTitle>
            <DialogContent className={styles.content}>
                <div>
                    <List>
                        {templates.map((template) =>
                            (targetTemplate.id !== template.id && (
                                <ListItemButton
                                    key={template.id}
                                    onClick={() => {handleTemplateSelection(template)}}
                                >
                                    {template.name}
                                </ListItemButton>
                            ))
                        )}
                    </List>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose?.({}, 'escapeKeyDown')}>
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    )
}