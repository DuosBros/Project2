import React, { useState } from 'react';
import { Modal, Image } from 'semantic-ui-react';
import henlo from '../assets/henlo.jpg'

const Henlo = (props) => {
    const [open, setOpen] = useState(props.show);

    return (
        <Modal
            closeOnEscape={true}
            closeIcon={true}
            open={open}
            size='tiny'
            onClose={() => setOpen(false)}>
            <Modal.Header>You have found an easter egg!</Modal.Header>
            <Modal.Content>
                <Image size='medium' src={henlo} />
            </Modal.Content>
        </Modal>
    )
}

export default Henlo;