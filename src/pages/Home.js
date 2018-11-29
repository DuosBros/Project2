import React from 'react';
import { Grid, List, Header, Image, Input, Button } from 'semantic-ui-react';
import keyboardKey from 'keyboard-key'
import _ from 'lodash'

import GVC from '../assets/GVC.png'
import beholder from '../assets/beholder.png'
import f5 from '../assets/f5.png'
import AT from '../assets/AT.png'
import BE from '../assets/BE.png'
import FR from '../assets/FR.png'
import RU from '../assets/RU.png'
import GI from '../assets/GI.png'
import GG from '../assets/GG.png'

import { INCIDENT_PLACEHOLDER, SN_INC_SEARCH_URL, VERSION1_SEARCH_URL, VERSION1_PLACEHOLDER } from '../appConfig';
import links from '../links';

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            incident: "",
            version1: "",
            filterLinks: ""
        }
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    handleKeyPressIncident = (e) => {
        const isEnter = keyboardKey.getKey(e) === 'Enter'

        if (isEnter) {
            var url = _.replace(SN_INC_SEARCH_URL, new RegExp(INCIDENT_PLACEHOLDER, "g"), this.state.incident)
            var win = window.open(url, '_blank');
            win.focus();

        }

    }

    // TODO version 1 link
    handleKeyPressVersion1 = (e) => {
        const isEnter = keyboardKey.getKey(e) === 'Enter'

        if (isEnter) {
            var url = _.replace(VERSION1_SEARCH_URL, new RegExp(VERSION1_PLACEHOLDER, "g"), this.state.version1)
            var win = window.open(url, '_blank');
            win.focus();

        }
    }

    renderLinks(filter) {
        let columns = links.map((e, i) => (<div key={"links-column-" + i} className="links column">{this.renderLinksColumn(e, filter)}</div>));
        return (<div className="links listing">{columns}</div>);
    }

    renderLinksColumn(column, filter) {
        let sections = column.map((e, i) => (<div key={"links-section-" + i} className="links section">{this.renderLinksSection(e, filter)}</div>));
        return sections;
    }

    renderLinksSection(section, filter) {
        let items = section.items.map((e, i) => this.renderLinksItem(e, i, filter))
        if (items.every((val, i, arr) => val === null)) {
            return null
        }
        else {
            return (
                <div>
                    <Header size="medium" href={section.url} target="_blank" rel="noopener noreferrer">{section.SectionTitle}</Header>
                    <List>{items}</List>
                </div>
            )

        }
    }

    renderLinksItem(item, i, filter) {
        let icon = item.icon;
        if (!icon) {
            icon = null;
        } else if (icon.startsWith("data:") || icon.startsWith("http:") || icon.startsWith("https:")) {
            icon = (<Image src={icon} />);
        } else {
            icon = (<Image src={process.env.PUBLIC_URL + "icons/" + icon} />);
        }

        if (item.title.toLowerCase().indexOf(filter) > -1) {
            return (
                <List.Item key={"links-item-" + i}>
                    {icon}
                    <List.Content className={icon === null ? "noimg" : ""}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
                    </List.Content>
                </List.Item>
            );
        }
        else {
            return null
        }
    }

    render() {
        let links = this.renderLinks(this.state.filterLinks);

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <div>
                            <Input onChange={this.handleChange} name="filterLinks" placeholder='Search...'></Input>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <div>
                            <Input onKeyPress={this.handleKeyPressIncident} onChange={this.handleChange} name="incident" placeholder='INCxxxxxx'></Input>
                            {this.state.incident !== "" ? <Button circular icon="arrow right" id="homeSecondIcon" /> : null}
                        </div>
                        <div>
                            <Input onKeyPress={this.handleKeyPressVersion1} onChange={this.handleChange} name="version1" placeholder='B-xxxxxxx'></Input>
                            {this.state.version1 !== "" ? <Button circular icon="arrow right" id="homeSecondIcon" /> : null}
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {links}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}
