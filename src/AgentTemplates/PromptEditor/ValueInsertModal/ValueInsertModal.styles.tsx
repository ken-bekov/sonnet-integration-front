import {css} from "@emotion/css";

export const useStyles = () => {
    return {
        contentContainer: css`
            width: 500px;
            padding: 16px 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
        `,
        progress: css`
            display: flex;
            align-items: center;
            justify-content: center;
        `,
        datesContainer: css`
            display: flex;
            justify-content: space-between;
            gap: 10px;
        `,
        radioContainer: css`
            display: flex;
            flex-direction: row !important;
        `,
        periodSection: css`
            display: flex;
            flex-direction: column;
            gap: 10px;
        `,
        smallEditor: css`
            .MuiInputBase-input {
                padding: 10px 14px;
            }
        `
    }
}
