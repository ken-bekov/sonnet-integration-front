import React, {createContext, PropsWithChildren, useState} from "react";
import {Alert, Slide, Snackbar} from "@mui/material";
import {AlertColor} from "@mui/material/Alert/Alert";

export interface SnackbarContextValue {
    showMessage: (message: SnackbarMessageProps) => void;
}

export const SnackbarContext = createContext<SnackbarContextValue>({
    showMessage: (message: SnackbarMessageProps) => {
        console.log(message.text);
    }
});

export interface SnackbarMessageProps {
    text: string;
    severity: AlertColor;
}

export const SnackbarProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [message, setMessage] = useState<SnackbarMessageProps | null>();

    const showMessage = (props: SnackbarMessageProps) => {
        setMessage(props);
    }

    return (
        <SnackbarContext.Provider value={{showMessage}}>
            {children}
            <Snackbar
                open={!!message}
                onClose={() => setMessage(null)}
                autoHideDuration={3000}
                TransitionComponent={(props) => <Slide {...props}/>}
            >
                <Alert severity={message?.severity}>
                    {message?.text}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    )
}