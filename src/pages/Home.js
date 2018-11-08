import React from 'react';
import { Grid, List, Image, Input, Button } from 'semantic-ui-react';
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

import {INCIDENT_PLACEHOLDER, SN_INC_SEARCH_URL, VERSION1_SEARCH_URL, VERSION1_PLACEHOLDER} from '../appConfig';

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            incident: "",
            version1: ""

        }
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    handleKeyPressIncident = (e) => {
        const isEnter = keyboardKey.getKey(e) === 'Enter'

        if(isEnter) {
            var url = _.replace(SN_INC_SEARCH_URL, new RegExp(INCIDENT_PLACEHOLDER, "g"), this.state.incident)
            var win = window.open(url, '_blank');
            win.focus();

        }

    }

    // TODO version 1 link
    handleKeyPressVersion1 = (e) => {
        const isEnter = keyboardKey.getKey(e) === 'Enter'

        if(isEnter) {
            var url = _.replace(VERSION1_SEARCH_URL, new RegExp(VERSION1_PLACEHOLDER, "g"), this.state.version1)
            var win = window.open(url, '_blank');
            win.focus();

        }
    }

    render() {
        return (
            <div>
                <Grid columns={4}>
                    <Grid.Column>
                        <List>
                            <List.Item>
                                <List.Icon name={null} />
                                <List.Content>
                                    <List.Header id="homeSubHeader" >Main</List.Header>
                                    <List.List>
                                        <List.Item>
                                            <Image src={GVC} />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="https://my.gvcgroup.com/">Intra</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='react' />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="http://pm.bwin.corp/">Product Matrix</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <Image src={beholder} />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="http://beholder.bwin.func/#/">Beholder QA Environments</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='gitlab' />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="https://vie.git.bwinparty.com/">Gitlab</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                    </List.List>
                                    <List.Header id="homeSubHeader">F5</List.Header>
                                    <List.List>
                                        <List.Item>
                                            <Image src={f5} />
                                            <Image src={AT} id="homeSecondIcon" />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="https://10.130.128.10/tmui/login.jsp">IXI EXT</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <Image src={f5} />
                                            <Image src={AT} id="homeSecondIcon" />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="https://10.140.128.10/tmui/login.jsp">TSI EXT</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <Image src={f5} />
                                            <Image src={AT} id="homeSecondIcon" />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="https://10.130.0.6/tmui/login.jsp">IXI INT</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <Image src={f5} />
                                            <Image src={AT} id="homeSecondIcon" />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="https://10.140.0.9/tmui/login.jsp">TSI INT</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <Image src={f5} />
                                            <Image src={BE} id="homeSecondIcon" />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="https://10.164.128.10/tmui/login.jsp">oos-lb1-2</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <Image src={f5} />
                                            <Image src={FR} id="homeSecondIcon" />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="https://10.165.128.10/tmui/login.jsp">par-lb1-1</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <Image src={f5} />
                                            <Image src={RU} id="homeSecondIcon" />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="https://10.162.128.10/tmui/login.jsp">mos-lb1-2</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <Image src={f5} />
                                            <Image src={GI} id="homeSecondIcon" />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="https://10.166.222.56/tmui/login.jsp">gib2-lb2-2</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <Image src={f5} />
                                            <Image src={GG} id="homeSecondIcon" />
                                            <List.Content>
                                                <List.Header><a target="_blank" rel="noopener noreferrer" href="https://10.169.222.56/tmui/login.jsp">gci2-lb2-2</a></List.Header>
                                            </List.Content>
                                        </List.Item>
                                    </List.List>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column>
                        column2
                    </Grid.Column>
                    <Grid.Column>
                        column3
                    </Grid.Column>
                    <Grid.Column>
                        <Input onKeyPress={this.handleKeyPressIncident} onChange={this.handleChange} name="incident" placeholder='INCxxxxxx'></Input>
                        {this.state.incident !== "" ? <Button circular icon="arrow right" id="homeSecondIcon" /> : <span></span>}
                        <Input onKeyPress={this.handleKeyPressVersion1} onChange={this.handleChange} name="version1" placeholder='B-xxxxxxx'></Input>
                        {this.state.version1 !== "" ? <Button circular icon="arrow right" id="homeSecondIcon" /> : <span></span>}
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}