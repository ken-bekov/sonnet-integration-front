import './App.scss'
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme} from "@mui/material";
import {PromptManager} from "./PromptManager/PromptManager.tsx";
import {css} from "@emotion/css";
import {configure} from "mobx";
import {ThemeProvider} from "@emotion/react";
import {useApplicationState} from "@app/state/application-state.ts";
import {AgentSelectionModal} from "@app/AgentSelectionModal/AgentSelectionModal.tsx";
import {observer} from "mobx-react-lite";
import {MessageStack} from "@app/common/MessageStack/MessageStack.tsx";
import {applicationStyles} from "@app/App.styles.ts";

const mainTheme = createTheme({});

configure({
    enforceActions: "never",
})

const mainLayout = css`
    height: 100vh;
`

function App() {
    const {
        selectedAgent,
        messageStackState,
        showAgentSelectionDialog
    } = useApplicationState();

    return (
        <div className={applicationStyles}>
            <ThemeProvider theme={mainTheme}>
                <CssBaseline/>
                <div className={mainLayout}>
                    {selectedAgent && <PromptManager/>}
                </div>
                <AgentSelectionModal open={showAgentSelectionDialog}/>
                <MessageStack state={messageStackState}/>
            </ThemeProvider>
        </div>
    )
}

export default observer(App)
