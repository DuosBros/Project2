import React from 'react';
import { Grid, List, Popup, Divider, Header, Image, Flag, Input, Button } from 'semantic-ui-react';
import keyboardKey from 'keyboard-key'
import _ from 'lodash'

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

    handleKeyPressVersion1 = (e) => {
        const isEnter = keyboardKey.getKey(e) === 'Enter'

        if (isEnter) {
            var url = _.replace(VERSION1_SEARCH_URL, new RegExp(VERSION1_PLACEHOLDER, "g"), this.state.version1)
            var win = window.open(url, '_blank');
            win.focus();

        }
    }

    renderLinksButtons() {
        let buttons = links.buttons.map((e, i) => (<Button key={"link-button-" + i} color={e.color} as="a" href={e.url} target="_blank" rel="noopener noreferrer">{e.title}</Button>))
        return (<div>{buttons}</div>);
    }

    renderLoadBalancers() {
        const LB_PER_ROW = 2;
        let rows = [];
        const rreq = Math.ceil(links.loadbalancers.length / (LB_PER_ROW * 1.0))
        for(let i = 0; i < rreq; i++) {
            let row = [];
            for(let j = 0; j < LB_PER_ROW; j++) {
                let lb = links.loadbalancers[(i * LB_PER_ROW) + j];
                if(!lb) {
                    continue;
                }
                row.push((
                    <Grid.Column>
                        <Popup trigger={
                            <a href={lb.url} target="_blank" rel="noopener noreferrer">
                                <Flag name={lb.country} /> {lb.title}
                            </a>
                        } content={lb.tooltip} />
                    </Grid.Column>
                ));
            }
            rows.push((
                <Grid.Row key={i} columns={LB_PER_ROW}>
                    {row}
                </Grid.Row>
            ));
        }
        return (<Grid>{rows}</Grid>);
    }

    renderLinksList(filter) {
        let columns = links.list.map((e, i) => (<div key={"links-column-" + i} className="links column">{this.renderLinksListColumn(e, filter)}</div>));
        return (<div className="links listing">{columns}</div>);
    }

    renderLinksListColumn(column, filter) {
        let sections = column.map((e, i) => (<div key={"links-section-" + i} className="links section">{this.renderLinksListSection(e, filter)}</div>));
        return sections;
    }

    renderLinksListSection(section, filter) {
        let items = section.items.map((e, i) => this.renderLinksListItem(e, i, filter))
        if (items.every((val) => val === null)) {
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

    renderLinksListItem(item, i, filter) {
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
        let links = this.renderLinksList(this.state.filterLinks);
        let buttons = this.renderLinksButtons();
        let loadbalancers = this.renderLoadBalancers();

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        {buttons}
                        <Divider hidden />
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
                    <Grid.Column width={10}>
                        {links}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        {loadbalancers}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}
