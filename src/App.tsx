import './App.scss'
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme} from "@mui/material";
import {css} from "@emotion/css";
import {configure} from "mobx";
import {ThemeProvider} from "@emotion/react";
import {useApplicationState} from "@app/state/application-state.ts";
import {observer} from "mobx-react-lite";
import {MessageStack} from "@app/common/MessageStack/MessageStack.tsx";
import {applicationStyles} from "@app/App.styles.ts";
import {BrowserRouter, Route, Routes} from "react-router";
import {AgentTemplates} from "@app/AgentTemplates/AgentTemplates.tsx";

const mainTheme = createTheme({});

configure({
    enforceActions: "never",
})

const mainLayout = css`
    height: 100vh;
`

function App() {
    const {
        messageStackState,
    } = useApplicationState();

    return (
        <div className={applicationStyles}>
            <ThemeProvider theme={mainTheme}>
                <CssBaseline/>
                <BrowserRouter>
                    <div className={mainLayout}>
                        <Routes>
                            <Route path="/agent/:agentId/*" element={<AgentTemplates/>}/>
                        </Routes>
                    </div>
                </BrowserRouter>
                {/*<AgentSelectionModal open={showAgentSelectionDialog}/>*/}
                <MessageStack state={messageStackState}/>
            </ThemeProvider>
        </div>
    )
}

export default observer(App)
