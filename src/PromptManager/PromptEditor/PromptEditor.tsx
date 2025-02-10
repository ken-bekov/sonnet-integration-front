import {ChangeEvent, FC, JSX, useEffect, useRef, useState} from "react";
import {Button, useTheme} from "@mui/material";
import {ValueInsertModal} from "./ValueInsertModal/ValueInsertModal.tsx";
import {Minion, MinionTypeNames, TrendName} from "../api/types.ts";
import {observer} from "mobx-react-lite";
import {PromptManagerState} from "../state/prompt-manager-state.ts";
import {getTextAreaStyles, toolbarStyles} from "./PromptEditor.styles.ts";
import {css} from "@emotion/react";
import {AsyncResultStatus} from "../../common/async-utils.ts";
import dayjs from "dayjs";
import {runQuerySet} from "@app/PromptManager/api/request-api.ts";

const promptEditorStyles = css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: stretch;
    align-items: stretch;
`

interface PromptEditorProps {
    commonTools: JSX.Element;
    state: PromptManagerState;
}

export const PromptEditor: FC<PromptEditorProps> = observer((props) => {
    const {commonTools, state} = props;
    const theme = useTheme();
    const [insertModalOpen, setInsertModalOpen] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const {queryTemplates, minions, generatedRequest} = state;

    useEffect(() => {
        if (!minions.value &&  state.id) {
            promptManagerState.loadMinions(selectedAgent.id);
        }
    }, [])

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

    const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (state.selectedTemplate) {
            state.selectedTemplate.text = event.target.value;
        }
    }

    const handleGenerateClick = () => {
        (async () => { await runQuerySet()})();
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
                    disabled={generatedRequest?.status === AsyncResultStatus.pending}
                >
                    Сформировать
                </Button>
            </div>
            <textarea
                ref={textAreaRef}
                className={getTextAreaStyles(theme)}
                onChange={handleValueChange}
                value={state.selectedTemplate?.text}
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