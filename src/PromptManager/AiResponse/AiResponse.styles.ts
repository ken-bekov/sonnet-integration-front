import {css} from "@emotion/css";
import {Theme} from "@mui/material";

export const getStyles = (theme: Theme) => ({
    textContainerStyles: css`
        padding: 18px;
        overflow-y: auto;
        flex: 0 1 auto;
        min-height: 100px;
    `,
    aiResponseStyles: css`
        flex: 0 1 auto;
        display: flex;
        flex-direction: column;
        min-height: 100px;
    `,
    statusBarStyles: css`
        display: flex;
        gap: 8px;
        padding: 8px;
        background-color: ${theme.palette.action.selected};
    `
})