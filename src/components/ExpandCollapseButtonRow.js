import React from 'react';
import { Grid, Button, Icon } from 'semantic-ui-react'

export default class ExpandCollapseButtonRow extends React.PureComponent {
    render() {
        return (
            <Grid.Row>
                <Grid.Column width={13}>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Button icon onClick={() => this.props.handleExpandCollapseButton(this.props.property)}>
                        {this.props.currentPropertyState ? 'Collapse' : 'Expand'}
                            <Icon className='iconMargin' name={this.props.currentPropertyState ? 'compress' : 'expand'} />
                    </Button>
                </Grid.Column>
            </Grid.Row>
        )
    }
}