import {css} from "@emotion/css";
import {useTheme} from "@mui/material";

export const useStyles = () => {
    const theme = useTheme();
    return {
        promptEditor: css`
            display: flex;
            height: 100%;
        `,
        rightSide: css`
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        `,
        textArea:css`
            resize: none;
            outline: none;
            font-family: ${theme.typography.fontFamily};
            font-size: 1rem;
            flex-grow: 1;
            padding: 16px;
            border: 1px solid ${theme.palette.divider};
            border-radius: 4px;
            margin: 8px;
        `,
    }
}