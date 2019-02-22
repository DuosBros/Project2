import React from 'react';
import { Image, Grid } from 'semantic-ui-react'
import obi from '../assets/obi.jpg'

const NotFound = () => {
    return (
        <Grid stackable>
            <Grid.Row>
                <Grid.Column>
                    <Image src={obi} />
                </Grid.Column>
            </Grid.Row>
        </Grid>

    )
}

export default NotFound