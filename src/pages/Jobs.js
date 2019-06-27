import React from 'react';
import { Grid, Segment, Header, Divider, List } from 'semantic-ui-react';
import { JOBS } from '../appConfig';
import { executeJob } from '../requests/MiscAxios';

class Jobs extends React.PureComponent {

    runJob = (type, job) => {
        executeJob(type, job.name);
    }

    render() {
        let lbJobs = JOBS.find(x => x.type === "LB").jobs;
        let lbJobsRender = lbJobs.map(x => {
            return (
                <List.Item key={x.name} href="#" onClick={() => this.runJob("LB", x)} icon='setting' content={x.text} />
            )
        })

        let scomJobs = JOBS.find(x => x.type === "SCOM").jobs;
        let scomRender = scomJobs.map(x => {
            return (
                <List.Item key={x.name} href="#" onClick={() => this.runJob("SCOM", x)} icon='setting' content={x.text} />
            )
        })

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Jobs
                        </Header>
                        <Segment attached='bottom' >
                            <Grid>
                                <Grid.Row columns='equal'>
                                    <Grid.Column>
                                        <Header content="Hangfire" as='h5' />
                                        <Divider />
                                        <List>
                                            <List.Item href="https://loco.prod.env.works/hangfire" target="_blank" icon='dashboard' content='Hangfire Dashboard' />
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header content="Loadbalancer" as='h5' />
                                        <Divider />
                                        <List>
                                            {lbJobsRender}
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header content="SCOM" as='h5' />
                                        <Divider />
                                        <List>
                                            {scomRender}
                                        </List>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Jobs;