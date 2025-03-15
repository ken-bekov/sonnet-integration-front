import React, {SyntheticEvent, useState} from "react";
import {
    Autocomplete,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel, Radio, RadioGroup,
    TextField
} from "@mui/material";
import {Malfunction, Minion, MinionTypeNames, TrendName} from "@app/api/types.ts";
import {AutocompleteChangeReason} from "@mui/material/useAutocomplete/useAutocomplete";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import {
    MalfunctionChannelSelector
} from "@app/AgentTemplates/PromptEditor/ValueInsertModal/MalfunctionChannelSelector/MalfunctionChannelSelector.tsx";
import {useStyles} from "@app/AgentTemplates/PromptEditor/ValueInsertModal/ValueInsertModal.styles.tsx";

interface ValueInsertModalProps {
    open: boolean;
    onClose: () => void;
    onTrendInsert: (
        trendName: TrendName,
        fromDate: string,
        toDate: string,
        interval: number,
    ) => void;
    onSpectreTrendInsert: (
        spectreTrend: Malfunction,
        fromDate: string,
        toDate: string,
        interval: number,
    ) => void;
    minions?: Minion[];
    loading: boolean;
}

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
    const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().subtract(3, 'day'));
    const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
    const [lastDays, setLastDays] = useState(3);
    const [period, setPeriod] = useState('any');
    const [resampleInterval, setResampleInterval] = useState<number>(30);
    const classes = useStyles();

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
            return minions.find(minion => minion.type.name === MinionTypeNames.Trend);
        }
    }

    const handleOnInsertClick = () => {
        const fromParam = period === 'any'
            ? `'${(fromDate || dayjs()).format('YYYY-MM-DD')}'`
            : `(daysAgoToDate ${lastDays})`;
        const toParam = period === 'any'
            ? `'${(toDate || dayjs()).format('YYYY-MM-DD')}'`
            : `(daysAgoToDate ${0})`;

        if (selectedMetric?.id === 'trends' && selectedChannel) {
            onTrendInsert(
                selectedChannel?.channel as TrendName,
                fromParam,
                toParam,
                resampleInterval,
            );
        }

        if (selectedMetric?.id === 'spectre-trends' && selectedChannel) {
            onSpectreTrendInsert(
                selectedChannel?.channel as Malfunction,
                fromParam,
                toParam,
                resampleInterval,
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

    const getMalfunctions = () => {
        const minion = getSelectedMinion();
        return minion?.dependentMalfunctions || [];
    }

    const handleMalfunctionChange = (malfunction: Malfunction | null) => {
        const channel: Channel | null = malfunction
            ? {
                id: malfunction.id,
                label: `${malfunction.text} [${malfunction.name}]`,
                channel: malfunction,
            }
            : null;

        setSelectedChannel(channel);
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Параметр для вставки</DialogTitle>
            <DialogContent>
                <div className={classes.contentContainer}>
                    {loading && (
                        <div className={classes.progress}>
                            <CircularProgress/>
                        </div>
                    )}
                    {!loading && (
                        <>
                            <div className={classes.periodSection}>
                                <RadioGroup className={classes.radioContainer}>
                                    <FormControlLabel
                                        control={<Radio checked={period === 'any'}/>}
                                        label='Произвольный период'
                                        onChange={(_, checked)=> checked && setPeriod('any')}
                                    />
                                    <FormControlLabel
                                        control={<Radio checked={period === 'lastDays'}/>}
                                        label='За N последних дней'
                                        onChange={(_, checked)=> checked && setPeriod('lastDays')}
                                    />
                                </RadioGroup>
                                {period === 'any' && (
                                    <div className={classes.datesContainer}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label='От'
                                                value={dayjs(fromDate)}
                                                onChange={(dayjs) => setFromDate(dayjs)}
                                                className={classes.smallEditor}
                                            />
                                            <DatePicker
                                                label='До'
                                                value={dayjs(toDate)}
                                                onChange={(dayjs) => setToDate(dayjs)}
                                                className={classes.smallEditor}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                )}
                                {period === 'lastDays' && (
                                    <TextField
                                        type='number'
                                        label='Количество дней'
                                        value={lastDays}
                                        onChange={(event) => setLastDays(+event.target.value || 0)}
                                        className={classes.smallEditor}
                                        style={{maxWidth: '245px'}}
                                    />
                                )}
                            </div>
                            <TextField
                                type='number'
                                label='Ресемплинг (мин)'
                                value={resampleInterval}
                                onChange={(event) => setResampleInterval(+event.target.value)}
                                className={classes.smallEditor}
                                style={{maxWidth: '245px'}}
                            />
                            <Autocomplete
                                renderInput={(params) => <TextField {...params} label="Название параметра"/>}
                                options={metrics}
                                getOptionLabel={(option) => option.label}
                                getOptionKey={(option) => option.id}
                                onChange={handleSelectedMinionChange}
                                value={selectedMetric}
                                size="small"
                            />
                            {selectedMetric?.id === 'trends' && (
                                <Autocomplete
                                    renderInput={(params) => <TextField {...params} label="Название канала"/>}
                                    options={getChannels() || []}
                                    getOptionLabel={(option) => option.label}
                                    getOptionKey={(option) => option.id}
                                    size="small"
                                    value={selectedChannel}
                                    onChange={handleSelectedChannelChange}
                                />
                            )}
                            {selectedMetric?.id === 'spectre-trends' && (
                                <MalfunctionChannelSelector
                                    malfunctions={getMalfunctions()}
                                    onMalfunctionChange={handleMalfunctionChange}
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
