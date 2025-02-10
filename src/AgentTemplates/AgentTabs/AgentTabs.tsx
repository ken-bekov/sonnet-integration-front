import {Tab, Tabs} from "@mui/material";
import React from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import {useStyles} from "./AgentTabs.styles";

export const AgentTabs: React.FC = () => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {agentId} = useParams();
    const styles = useStyles();

    const pathSegments = pathname.split("/").filter(str => !!str);
    const currentTab = pathSegments.slice(-1)[0];

    return (
        <>
            <Tabs value={currentTab} className={styles.agentTabs}>
                <Tab
                    label="Шаблон"
                    value={'edit'}
                    onClick={() => navigate(`/agent/${agentId}/edit`)}
                />
                <Tab
                    label="Результат"
                    value={'result'}
                    onClick={() => navigate(`/agent/${agentId}/result`)}
                />
            </Tabs>
        </>
    )
}