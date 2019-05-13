import { Dropdown } from "semantic-ui-react";
import React from 'react';

const ServiceSearchDropdown = (props) => {
    return (
        <Dropdown
            className={props.className && props.className}
            icon='search'
            selection
            onChange={props.handleServiceChange}
            options={props.options}
            fluid
            selectOnBlur={false}
            selectOnNavigation={false}
            placeholder={props.placeholder ? props.placeholder : 'Type to search'}
            value=""
            onSearchChange={props.handleServiceShortcutSearchChange}
            search={props.search ? props.search : true}
        />
    );
}

export default ServiceSearchDropdown;