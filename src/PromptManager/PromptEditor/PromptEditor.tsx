import {ChangeEvent, FC, JSX, useEffect, useRef, useState} from "react";
import {Button, useTheme} from "@mui/material";
import {ValueInsertModal} from "./ValueInsertModal/ValueInsertModal.tsx";
import {Minion, MinionTypeNames, TrendName} from "../api/types.ts";
import {observer} from "mobx-react-lite";
import {useApplicationState} from "../../state/application-state.ts";
import {TabNames} from "../state/prompt-manager-state.ts";
import {getTextAreaStyles, toolbarStyles} from "./PromptEditor.styles.ts";
import {css} from "@emotion/react";
import {AsyncStatus} from "../../common/async-utils.ts";

const promptEditorStyles = css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: stretch;
    align-items: stretch;
`

interface PromptEditorProps {
    commonTools: JSX.Element;
}

export const PromptEditor: FC<PromptEditorProps> = observer((props) => {
    const {commonTools} = props;
    const theme = useTheme();
    const [insertModalOpen, setInsertModalOpen] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const {promptManagerState} = useApplicationState();
    const {queryTemplate, minions, generatedRequest} = promptManagerState;
    const templateText = queryTemplate.value?.text || '';

    useEffect(() => {
        if (!minions.value) {
            promptManagerState.loadMinions(1);
        }
    }, [])

    const handleInsert = (minion: Minion, trendName: TrendName) => {
        const textArea = textAreaRef.current;
        if (!textArea || !queryTemplate.value) {
            return;
        }

        if (minion.type?.name === MinionTypeNames.Trend) {
            const trendTag = `{{trend ${trendName.id}}}`;
            const currentPosition = textArea.selectionStart;
            queryTemplate.value.text =
                templateText.substring(0, currentPosition) + `${trendName.name}\n` +
                trendTag + templateText.substring(currentPosition, templateText.length);
        }
    }

    const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (queryTemplate.value) {
            queryTemplate.value.text = event.target.value;
        }
    }

    const handleGenerateClick = () => {
        promptManagerState.currentTab = TabNames.prompt;
        promptManagerState.generateRequest();
    }

    return (
        <div css={promptEditorStyles}>
            <div className={toolbarStyles}>
                {commonTools}
                <Button
                    onClick={() => {
                        setInsertModalOpen(true)
                    }}
                >
                    Вставить
                </Button>
                <Button
                    onClick={handleGenerateClick}
                    disabled={generatedRequest?.status === AsyncStatus.pending}
                >
                    Сформировать
                </Button>
            </div>
            <textarea
                ref={textAreaRef}
                className={getTextAreaStyles(theme)}
                onChange={handleValueChange}
                value={templateText}
            />
            <ValueInsertModal
                loading={!minions}
                minions={minions.value}
                open={insertModalOpen}
                onClose={() => setInsertModalOpen(false)}
                onInsert={handleInsert}
            />
        </div>
    )
})