import React from 'react';
import { Grid } from 'semantic-ui-react';
import GenericBarChart from '../charts/GenericBarChart';
import ExpandCollapseButtonRow from './ExpandCollapseButtonRow';
import RawDataRow from './RawDataRow';

const BarChartWithRawData = (props) => {

    var expandCollapseButton = null;
    if (props.expandCollapseButtonProps) {
        expandCollapseButton = (
            <ExpandCollapseButtonRow
                handleExpandCollapseButton={props.expandCollapseButtonProps.handleExpandCollapseButton}
                property={props.expandCollapseButtonProps.name}
                currentPropertyState={props.expandCollapseButtonProps.currentState} />
        )
    }

    var rawData = props.data;
    if (props.filterUnknown) {
        rawData = rawData.filter(x => x.name !== "Unknown")
    }

    var mappedRawData = rawData.map((x, i) => {
        return (
            <RawDataRow key={i} x={x} />
        )
    })

    return (
        <Grid stackable>
            <Grid.Row>
                <Grid.Column width={props.barChartWidth}>
                    <GenericBarChart data={props.data} />
                </Grid.Column>
                <Grid.Column width={props.rawDataWidth} >
                    {mappedRawData}
                </Grid.Column>
            </Grid.Row>
            {expandCollapseButton}
        </Grid>
    );
}

export default BarChartWithRawData;