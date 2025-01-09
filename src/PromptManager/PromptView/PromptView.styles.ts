import {css} from "@emotion/css";
import {Theme} from "@mui/material";

export const getStyles = (theme: Theme) => ({
    promptViewStyles: css`
        display: flex;
        flex-direction: column;
        flex: 0 1 auto;
        min-height: 100px;
    `,
    textContainerStyles: css`
        padding: 18px;
        overflow-y: auto;
        flex: 0 1 auto;
        min-height: 100px;
        border: 1px solid ${theme.palette.grey["300"]};
        border-radius: 4px;
    `,
    toolbarStyles: css`
        padding: 18px;
        display: flex;
        justify-content: flex-end;
    `,
    statusBarStyles: css`
        padding: 14px 8px;
    `
})