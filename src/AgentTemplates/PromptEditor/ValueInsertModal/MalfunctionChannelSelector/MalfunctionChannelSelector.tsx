import {Malfunction} from "@app/api/types.ts";
import React, {SyntheticEvent, useMemo, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";
import {AutocompleteChangeReason} from "@mui/material/useAutocomplete/useAutocomplete";
import {useStyles} from './MalfunctionChannelSelector.styles';

interface MalfunctionChannelSelectorProps {
    malfunctions: Malfunction[];
    onMalfunctionChange: (malfunction: Malfunction | null) => void;
}

export const MalfunctionChannelSelector: React.FC<MalfunctionChannelSelectorProps> = (props) => {
    const {malfunctions, onMalfunctionChange} = props;
    const [type, setType] = useState<string | null>();
    const [channel, setChannel] = useState<string | null>();
    const [malfunction, setMalfunction] = useState<Malfunction | null>();
    const classes = useStyles();

    const types = useMemo(() => {
        const typeSet = malfunctions.reduce((set, malfunctions) => {
            set.add(malfunctions.type);
            return set;
        }, new Set<string>());
        return [...typeSet].sort();
    }, [malfunctions]);

    const channels = useMemo(() => {
        const channelSet = malfunctions
            .filter(malfunction => malfunction.type === type)
            .reduce((set, malfunctions) => {
                set.add(malfunctions.channel);
                return set;
            }, new Set<string>());
        return [...channelSet].sort();
    }, [type, malfunctions]);

    const selectedMalfunctions = useMemo(() => {
        return malfunctions.filter(malfunction =>
            malfunction.type === type && malfunction.channel === channel
        );
    }, [type, channel, malfunctions]);

    const handleTypeChange = (
        _: SyntheticEvent,
        value: string | null,
        reason: AutocompleteChangeReason
    ) => {
        if (reason === 'selectOption' || reason === 'clear') {
            setType(value);
            setChannel(undefined);
            setMalfunction(undefined);
        }
    }

    const handleChannelChange = (
        _: SyntheticEvent,
        value: string | null,
        reason: AutocompleteChangeReason
    ) => {
        if (reason === 'selectOption' || reason === 'clear') {
            setChannel(value)
            setMalfunction(undefined);
        }
    }

    const handleMalfunctionChange = (
        _: SyntheticEvent,
        value: Malfunction | null,
        reason: AutocompleteChangeReason
    ) => {
        if (reason === 'selectOption' || reason === 'clear') {
            setMalfunction(value);
            onMalfunctionChange(value);
        }
    }

    return (
        <div className={classes.malfunctionChannelSelector}>
            <Autocomplete
                renderInput={(params) => <TextField {...params} label="Тип канала"/>}
                options={types}
                getOptionLabel={(option) => option}
                getOptionKey={(option) => option}
                onChange={handleTypeChange}
                value={type}
                size="small"
            />
            {type && (
                <Autocomplete
                    key={type}
                    renderInput={(params) => <TextField {...params} label="Канал"/>}
                    options={channels}
                    getOptionLabel={(option) => option}
                    getOptionKey={(option) => option}
                    onChange={handleChannelChange}
                    value={channel}
                    size="small"
                />
            )}
            {type && channel && (
                <Autocomplete
                    key={channel}
                    renderInput={(params) => <TextField {...params} label="Неисправность"/>}
                    options={selectedMalfunctions}
                    getOptionKey={(option) => option.id}
                    getOptionLabel={(option) => `${option.text} [${option.name}]`}
                    onChange={handleMalfunctionChange}
                    value={malfunction}
                    size="small"
                />
            )}
        </div>
    )
}
