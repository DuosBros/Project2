import React from 'react';
import { Divider, Grid, Icon } from 'semantic-ui-react'

export default class Footer extends React.Component {

    render() {
        return (
            <div {...this.props}>
                <Divider />
                <Grid>
                    <Grid.Row columns='equal'>

                        <Grid.Column>
                            © {(new Date()).getFullYear()} <a href="mailto:SportsB2CLeanOpsLOB2C1@bwinparty.com">VIE LeanOps</a> | 
                             Issue? <a href="https://vie.git.bwinparty.com/groups/leanops/Loco/-/issues" target="_blank" rel="noopener noreferrer">Report it!</a> <Icon name="bug" ></Icon>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}
