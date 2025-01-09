import React from "react";
import {emptyScreenStyles} from "@app/EmptyScreen/EmptyScreen.styles.ts";

interface EmptyScreenProps {
    content: React.ReactNode;
}

export const EmptyScreen: React.FC<EmptyScreenProps> = ({content}) => {
    return (
        <div className={emptyScreenStyles}>
            {content}
        </div>
    )
}