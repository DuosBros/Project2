import React from 'react';
import packageJson from '../../package.json';
import { Divider, Icon } from 'semantic-ui-react'

export default class Footer extends React.Component {

    render() {
        return (
            <div {...this.props}>
                <Divider />
                <div className="content">
                    © {(new Date()).getFullYear()} <a href={"mailto:d.leanops.sports.b2c@gvcgroup.com&subject=" + encodeURIComponent("LOCO v" + packageJson.version + " Feedback")}>VIE LeanOps B2C</a> |
                     Issue? <a href={"https://vie.git.bwinparty.com/leanops/Loco/bwin.loco.client/issues/new?issue[title]=" + encodeURIComponent("LOCO v" + packageJson.version + " Issue") + "&issue[description]=Explain%20the%20issue%20in%20detail."} target="_blank" rel="noopener noreferrer">Report it!</a> <Icon name="bug" ></Icon>
                     | Version: {packageJson.version}
                 </div>
            </div>
        )
    }
}
