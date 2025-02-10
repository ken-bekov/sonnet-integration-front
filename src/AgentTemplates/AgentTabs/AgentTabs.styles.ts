import { css } from "@emotion/css"
import {useTheme} from "@mui/material";

export const useStyles = () => {
    const theme = useTheme();

    return {
        agentTabs: css`
            border-bottom: 1px ${theme.palette.action.disabled} solid;
        `
    }
}