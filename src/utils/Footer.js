import React from 'react';
import packageJson from '../../package.json';
import { Divider, Grid, Icon } from 'semantic-ui-react'

export default class Footer extends React.Component {

    render() {
        return (
            <div {...this.props}>
                <Divider />
                <Grid>
                    <Grid.Row columns='equal'>

                        <Grid.Column>
                            © {(new Date()).getFullYear()} <a href="mailto:d.leanops.sports.b2c@gvcgroup.com">VIE LeanOps B2C</a> | 
                             Issue? <a href="https://vie.git.bwinparty.com/groups/leanops/Loco/-/issues" target="_blank" rel="noopener noreferrer">Report it!</a> <Icon name="bug" ></Icon>
                             | Version: {packageJson.version}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}
