import React from 'react';
import { Divider, Segment, Grid, Container } from 'semantic-ui-react'

export default class Footer extends React.Component {

    render() {
        return (
            <div {...this.props}>
                <Divider />
                <Grid>
                    <Grid.Column>
                        © {(new Date()).getFullYear()} <a href="mailto:SportsB2CLeanOpsLOB2C1@bwinparty.com">VIE LeanOps</a>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}