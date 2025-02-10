import React, {useEffect} from 'react';
import {RichTreeView, TreeViewBaseItem} from "@mui/x-tree-view";
import {Agent, Branch, Company, Factory} from "@app/PromptManager/api/types.ts";
import {css} from "@emotion/css";
import {useApplicationState} from "@app/state/application-state.ts";
import {AsyncResultStatus} from "@app/common/async-utils.ts";
import {treeViewStyle} from "./AgentTreeView.styles.ts";
import {observer} from "mobx-react-lite";
import {ProgressScreen} from "@app/common/ProgressScreen/ProgressScreen.tsx";

const richTreeViewStyle = css`
    height: 100%;
`

interface AgentTreeViewProps {
    onSelectedAgentChange: (agent: Agent) => void;
}

export const AgentTreeView: React.FC<AgentTreeViewProps> = observer((props) => {
    const {onSelectedAgentChange} = props;

    const {agentTreeState} = useApplicationState();
    const {companies} = agentTreeState;

    useEffect(() => {
        if (!companies.value) {
            agentTreeState.loadAgentTree();
        }
    }, []);

     const agentToItem = (agent: Agent) => ({
        id: `agent-${agent.id}`,
        label: agent.device_name,
    })

    const factoryToItem = (factory: Factory) => ({
        id: `factory-${factory.id}`,
        label: factory.name,
        children: factory.agents.map(agentToItem),
    })

    const branchToItem = (branch: Branch) => ({
        id: `branch-${branch.id}`,
        label: branch.name,
        children: branch.factories.map(factoryToItem),
    })

    const companyToItem = (company: Company): TreeViewBaseItem => ({
        id: `company-${company.id}`,
        label: company.name,
        children: company.branches.map(branchToItem)
    })

    const findAgentById = (agentId: number): Agent | null => {
        if (!companies.value) {
            return null;
        }

        for (const company of companies.value) {
            for (const branch of company.branches) {
                for (const factory of branch.factories) {
                    for (const agent of factory.agents) {
                        if (agent.id === agentId) {
                            return agent;
                        }
                    }
                }
            }
        }
        return null;
    }

    const treeItems = companies.value?.map(companyToItem) || [];

    const handleSelectedItemsChange = (
        _: React.SyntheticEvent,
        itemId: string | null
    ) => {
        if (!itemId) {
            return;
        }

        if (itemId.startsWith('agent-')) {
            const agentId = +itemId.replace('agent-', '');
            const agent = findAgentById(agentId);
            if (agent) {
                onSelectedAgentChange(agent);
            }
        }
    }

    if (companies.status === AsyncResultStatus.pending) {
        return <ProgressScreen text='загрузка агентов'/>
    }

    return (
        <div className={treeViewStyle}>
            <RichTreeView
                items={treeItems}
                className={richTreeViewStyle}
                onSelectedItemsChange={handleSelectedItemsChange}
            />
        </div>
    )
})