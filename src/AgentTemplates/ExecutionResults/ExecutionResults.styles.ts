import {css} from "@emotion/css";
import {useTheme} from "@mui/material";

export const useStyles = () => {
    const theme = useTheme();

    return {
        executionResults:css`
            display: flex;
            height: 100%;
            align-items: stretch;
        `,
        treeView: css`
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            min-width: 250px;
        `,
        content: css`
            flex-grow: 1;
            display: flex;
            flex-direction: column;
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
            width: 100%;
            height: 100%;
        `,
    }
}
