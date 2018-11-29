import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getDismeApplicationsActions } from '../actions/RolloutStatusActions';
import { getDismeApplications } from '../requests/ServiceAxios';
import { Grid, Header, Segment, Dropdown } from 'semantic-ui-react';

class RolloutStatus extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dismeApplicationsFiltered: []
        }
    }

    componentDidMount() {
        getDismeApplications()
            .then(res => {
                this.props.getDismeApplicationsActions(res.data.map(x => 
                    ({ 
                        text: x.Application, 
                        value: x.Application })))
            })
    }

    handleOnChange = (e, { value }) => {
    }

    handleOnSearchChange = (e) => {
        if (e.target.value.length > 1) {

            var filtered = this.props.rolloutStatusStore.dismeApplications.filter(x => x.text.toString().search(new RegExp(x.text, "i")) >= 0)
            this.setState({ dismeApplicationsFiltered: filtered });
        }
    }

    render() {
        console.log(this.props.rolloutStatusStore.dismeApplications)
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Rollout Status
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={3} >
                                        <Dropdown
                                            icon='search'
                                            selection
                                            onChange={this.handleOnChange}
                                            options={this.state.dismeApplicationsFiltered.length === 0 ? this.props.rolloutStatusStore.dismeApplications : this.state.dismeApplicationsFiltered}
                                            fluid
                                            selectOnBlur={false}
                                            selectOnNavigation={false}
                                            placeholder='Type to search...'
                                            onSearchChange={this.handleOnSearchChange}
                                            search
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        rolloutStatusStore: state.RolloutStatusReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDismeApplicationsActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RolloutStatus);
