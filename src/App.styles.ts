import {css} from "@emotion/css";
import {Theme} from "@mui/material";

export const getApplicationStyles = (theme: Theme) => css`
    max-width: 1200px;
    flex-grow: 1;

    *::-webkit-scrollbar {
        width: 8px;
        background-color: ${theme.palette.background.default};
    }
    *::-webkit-scrollbar-thumb {
        background-color: ${theme.palette.action.disabled};
        border-radius: 4px;
    }
`
