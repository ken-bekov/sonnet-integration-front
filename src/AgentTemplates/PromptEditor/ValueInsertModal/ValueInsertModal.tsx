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
import {Malfunction, Minion, MinionTypeNames, TrendName} from "@app/api/types.ts";
import {AutocompleteChangeReason} from "@mui/material/useAutocomplete/useAutocomplete";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Dayjs} from "dayjs";

interface ValueInsertModalProps {
    open: boolean;
    onClose: () => void;
    onTrendInsert: (
        trendName: TrendName,
        fromDate: Date,
        toDate: Date,
    ) => void;
    onSpectreTrendInsert: (
        spectreTrend: Malfunction,
        fromDate: Date,
        toDate: Date,
    ) => void;
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

const datesContainerStyles = css`
    display: flex;
    justify-content: space-between;
`

interface Metric {
    id: string;
    label: string;
}

interface Channel {
    id: number;
    label: string;
    channel: TrendName | Malfunction;
}

export const ValueInsertModal: React.FC<ValueInsertModalProps> = (props) => {
    const {open, onClose, minions, loading, onTrendInsert, onSpectreTrendInsert} = props;
    const [fromDate, setFromDate] = useState<Dayjs | null>(null);
    const [toDate, setToDate] = useState<Dayjs | null>(null);

    const metrics: Metric[] = [
        {id: 'trends', label: 'Тренды'},
        {id: 'spectre-trends', label: 'Тренды спектров'},
    ]

    const [selectedMetric, setSelectedMetric] = useState<Metric | null>(metrics[0]);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    const handleSelectedMinionChange = (
        _: SyntheticEvent,
        value: Metric | null,
        reason: AutocompleteChangeReason
    ) => {
        if (reason === "selectOption") {
            setSelectedMetric(value);
            setSelectedChannel(null);
        }
    }

    const handleSelectedChannelChange = (
        _: SyntheticEvent,
        value: Channel | null,
        reason: AutocompleteChangeReason
    ) => {
        if (reason === "selectOption") {
            setSelectedChannel(value);
        }
    }

    const getSelectedMinion = () => {
        if (!minions) {
            return null;
        }

        if (
            selectedMetric?.id === 'trends'
            || selectedMetric?.id === 'spectre-trends'
        ) {
            return  minions.find(minion => minion.type.name === MinionTypeNames.Trend);
        }
    }

    const handleOnInsertClick = () => {
        if (selectedMetric?.id === 'trends' && selectedChannel) {
            onTrendInsert(
                selectedChannel?.channel as TrendName,
                fromDate?.toDate() || new Date(),
                toDate?.toDate() || new Date()
            );
        }

        if (selectedMetric?.id === 'spectre-trends' && selectedChannel) {
            onSpectreTrendInsert(
                selectedChannel?.channel as Malfunction,
                fromDate?.toDate() || new Date(),
                toDate?.toDate() || new Date(),
            );
        }
    }

    const getTrendChannels = (): Channel[] => {
        const minion = getSelectedMinion();
        if (minion) {
            return minion.trendNames.map(trend => ({
                id: trend.id,
                label: trend.name,
                channel: trend,
            }));
        }
        return [];
    }


    const getMalfunctionChannels = (): Channel[] => {
        const minion = getSelectedMinion();
        if (minion) {
            return minion.dependentMalfunctions.map(malfunction => ({
                id: malfunction.id,
                label: `${malfunction.text} (${malfunction.channel}: ${malfunction.name})`,
                channel: malfunction,
            }));
        }
        return [];
    }

    const getChannels = () => {
        if (selectedMetric?.id === 'trends') {
            return getTrendChannels();
        }
        if (selectedMetric?.id === 'spectre-trends') {
            return getMalfunctionChannels();
        }
        return [];
    }

    return (
        <Dialog open={open} onClose={onClose}>
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
                            <div className={datesContainerStyles}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={fromDate}
                                        onChange={(dayjs) => setFromDate(dayjs)}
                                    />
                                    <DatePicker
                                        value={toDate}
                                        onChange={(dayjs) => setToDate(dayjs)}
                                    />
                                </LocalizationProvider>
                            </div>
                            <Autocomplete
                                renderInput={(params) => <TextField {...params} label="Название параметра"/>}
                                options={metrics}
                                getOptionLabel={(option) => option.label}
                                getOptionKey={(option) => option.id}
                                onChange={handleSelectedMinionChange}
                                value={selectedMetric}
                                size="small"
                            />
                            <Autocomplete
                                renderInput={(params) => <TextField {...params} label="Название канала"/>}
                                options={getChannels() || []}
                                getOptionLabel={(option) => option.label}
                                getOptionKey={(option) => option.id}
                                size="small"
                                value={selectedChannel}
                                onChange={handleSelectedChannelChange}
                            />
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
