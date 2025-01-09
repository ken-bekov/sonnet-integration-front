import React, {SyntheticEvent, useState} from "react";
import {
    Autocomplete,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import {css} from "@emotion/css";
import {Minion, TrendName} from "../../api/types.ts";
import {AutocompleteChangeReason} from "@mui/material/useAutocomplete/useAutocomplete";

interface ValueInsertModalProps {
    open: boolean;
    onClose: () => void;
    onInsert: (minion:Minion, trendName: TrendName) => void;
    minions?: Minion[];
    loading: boolean;
}

const contentContainerStyles = css`
    width: 500px;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const progressStyles = css`
    display: flex;
    align-items: center;
    justify-content: center;
`

export const ValueInsertModal: React.FC<ValueInsertModalProps> = (props) => {
    const { open, onClose, minions, loading, onInsert } = props;
    const [selectedMinion, setSelectedMinion] = useState<Minion | null>(null);
    const [selectedTrendName, setSelectedTrendName] = useState<TrendName | null>(null);

    const handleSelectedMinionChange = (
        _: SyntheticEvent,
        value: Minion | null,
        reason: AutocompleteChangeReason
    ) => {
        if (reason === "selectOption") {
            setSelectedMinion(value);
            setSelectedTrendName(null);
        }
    }

    const handleSelectedChannelChange = (
        _: SyntheticEvent,
        value: TrendName | null,
        reason: AutocompleteChangeReason
    ) => {
        if (reason === "selectOption") {
            setSelectedTrendName(value);
        }
    }

    const handleOnInsertClick = () => {
        if (selectedMinion && selectedTrendName) {
            onInsert(selectedMinion, selectedTrendName);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle>Параметр для вставки</DialogTitle>
            <DialogContent>
                <div className={contentContainerStyles}>
                    {loading && (
                        <div className={progressStyles}>
                            <CircularProgress/>
                        </div>
                    )}
                    {!loading && (
                        <>
                            <Autocomplete
                                renderInput={(params) => <TextField {...params} label="Название параметра"/>}
                                options={minions || []}
                                getOptionLabel={(option) => option.type.name}
                                getOptionKey={(option) => option.id}
                                onChange={handleSelectedMinionChange}
                                value={selectedMinion}
                                size="small"
                            />
                            {selectedMinion && (
                                <Autocomplete
                                    renderInput={(params) => <TextField {...params} label="Название канала"/>}
                                    options={selectedMinion.trendNames || []}
                                    getOptionLabel={(option) => option.name}
                                    getOptionKey={(option) => option.id}
                                    size="small"
                                    value={selectedTrendName}
                                    onChange={handleSelectedChannelChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnInsertClick}>Вставить</Button>
                <Button onClick={onClose}>Закрыть</Button>
            </DialogActions>
        </Dialog>
    )
}