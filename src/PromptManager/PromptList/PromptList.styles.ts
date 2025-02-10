import {css} from "@emotion/css";

export const useStyles = () => {
    return {
        promptList: css`
            display: flex;
            flex-direction: column;
            width:250px`,
        toolbar: css`
            display: flex;`,
        item: css`
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;`,
    }
}