import {css} from "@emotion/css";
import {useTheme} from "@mui/material";

export const useStyles = () => {
    const theme = useTheme();

    return {
        agentTemplates: css`
            height: 100%;
            display: flex;
            flex-direction: column;
        `,
        container: css`
            padding: 16px 0;
            flex-grow: 1;
        `,
        header:css`
            padding: 12px;
            font-weight: 700;
            color: ${theme.palette.text.secondary}
        `
    }
}