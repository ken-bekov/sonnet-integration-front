import React, {SyntheticEvent} from "react";
import {AiRequest, AiRequestSet} from "@app/api/request-api.ts";
import {RichTreeView, TreeViewBaseItem} from "@mui/x-tree-view";
import dayjs from "dayjs";
import {useStyles} from "./ResultList.styles.ts";

interface ResultListProps {
    resultSets: AiRequestSet[];
    selectedRequest: AiRequest | null;
    onSelectedChange: (selectedResult: AiRequest | null) => void;
}

export const ResultList: React.FC<ResultListProps> = (props) => {
    const {resultSets, onSelectedChange, selectedRequest} = props;
    const classes = useStyles();

    const requestToTreeItem = (request: AiRequest): TreeViewBaseItem => {
        return {
            id: `request-${request.id}`,
            label: request.name,
        }
    }

    const requestSetToTreeItem = (requestSet: AiRequestSet): TreeViewBaseItem => {
        return {
            id: `set-${requestSet.id}`,
            label: dayjs(requestSet.create_time).format('DD-MM-YYYY HH:mm:ss'),
            children: requestSet.requests.map(requestToTreeItem)
        }
    }

    const treeItems = resultSets
        .sort((a, b) => dayjs(b.create_time).diff(a.create_time, 'milliseconds'))
        .map(requestSetToTreeItem);

    const requestSet = resultSets.reduce<Record<string, AiRequest>>(
        (requests, set) => {
            set.requests.forEach(request => {
                requests[`request-${request.id}`] = request;
            });
            return requests;
        },
        {}
    )

    const handleSelectedItemChange = (_: SyntheticEvent, id: string | null) => {
        if (id) {
            const request = requestSet[id];
            onSelectedChange(request);
        } else {
            onSelectedChange(null);
        }
    }

    return (
        <div className={classes.treeView}>
            <RichTreeView
                items={treeItems}
                onSelectedItemsChange={handleSelectedItemChange}
                selectedItems={selectedRequest ? `request-${selectedRequest.id}` : null}

            />
        </div>
    )
}
