import {css} from "@emotion/css";
import {Theme} from "@mui/material";

export const getTextAreaStyles = (theme: Theme) => css`
        resize: none;
        outline: none;
        font-family: ${theme.typography.fontFamily};
        font-size: 1rem;
        flex-grow: 1;
        padding: 16px;
        border: 1px solid ${theme.palette.divider};
        border-radius: 4px;
        margin: 8px;
    `;

export const toolbarStyles = css`
        display: flex;
        justify-content: flex-end;
        z-index: 1;
        padding: 8px;
        gap: 4px;
    `