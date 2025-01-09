import {css} from "@emotion/css";
import {Theme} from "@mui/material";

export const promptManagerStyle = css`
    display: flex;
    align-items: stretch;
    height: 100%;
    flex-direction: column;
    flex-grow: 1;
`;

export const progressScreenStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 10;
    opacity: 0.3;
`
export const getHeaderStyles = (theme: Theme) => css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background-color: ${theme.palette.action.selected};
`