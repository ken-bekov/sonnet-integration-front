import React from "react";
import {progressScreenStyles} from "./ProgressScreen.styles.ts";
import {CircularProgress, Typography} from "@mui/material";

interface ProgressScreenProps {
    text: string;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({text}) => {
    return (
        <div className={progressScreenStyles}>
            <div className='progressLabel'>
                <CircularProgress/>
                <Typography color={"textSecondary"}>
                    {text}
                </Typography>
            </div>
        </div>
    )
}