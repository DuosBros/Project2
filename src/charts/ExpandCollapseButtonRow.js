import React from 'react';
import { Grid, Button, Icon } from 'semantic-ui-react'

const ExpandCollapseButtonRow = (props) => {
    return (
        <Grid.Row>
            <Grid.Column width={13}>
            </Grid.Column>
            <Grid.Column width={3}>
                <Button icon onClick={() => props.handleExpandCollapseButton(props.property)}>
                    {props.currentPropertyState ? 'Collapse' : 'Expand'}
                    <Icon className='iconMargin' name={props.currentPropertyState ? 'compress' : 'expand'} />
                </Button>
            </Grid.Column>
        </Grid.Row>
    )
}

export default ExpandCollapseButtonRow;