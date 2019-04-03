import React from 'react';
import { Grid, List, Popup, Divider, Header, Image, Flag, Input, Button } from 'semantic-ui-react';

import { APP_TITLE } from '../appConfig';
import links from '../links';

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filterLinks: ""
        }
    }

    componentDidMount() {
        document.title = APP_TITLE + "Home";
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    renderLinksButtons() {
        let buttons = links.buttons.map((e, i) => (<Button key={"link-button-" + i} color={e.color} as="a" href={e.url} target="_blank" rel="noopener noreferrer">{e.title}</Button>))
        return (<div>{buttons}</div>);
    }

    renderLoadBalancers() {
        const LB_PER_ROW = 2;
        let rows = [];
        const rreq = Math.ceil(links.loadbalancers.length / (LB_PER_ROW * 1.0))
        for (let i = 0; i < rreq; i++) {
            let row = [];
            for (let j = 0; j < LB_PER_ROW; j++) {
                let lb = links.loadbalancers[(i * LB_PER_ROW) + j];
                if (!lb) {
                    continue;
                }
                row.push((
                    <Grid.Column key={j}>
                        <Popup trigger={
                            <a href={lb.url} target="_blank" rel="noopener noreferrer">
                                {lb.icon ? (
                                    <Image style={{marginRight: '0.5em'}} inline src={process.env.PUBLIC_URL + "icons/" + lb.icon} />
                                ) : (<Flag name={lb.country} />)}
                                {lb.title}
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
            /*global process*/
            icon = (<Image src={process.env.PUBLIC_URL + "icons/" + icon} />);
            /*global process:false*/
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
                    <Grid.Column>
                        {buttons}
                        <Divider hidden />
                        <div>
                            <Input value={this.state.filterLinks} onChange={this.handleChange} name="filterLinks" placeholder='Search...'></Input>
                            <Button onClick={() => this.handleChange(null, { name: "filterLinks", value: "" })} circular icon="close" id="homeSecondIcon" style={{ visibility: (this.state.filterLinks === "" ? "hidden" : "visible") }} />
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
