import { Dropdown } from "semantic-ui-react";
import React from 'react';

const ServerSearchMultipleDropdown = (props) => {
    return (
        <Dropdown
            fluid
            multiple
            value={[]}
            id="serverSearchDropdown"
            className={props.className && props.className}
            icon='search'
            selection
            // onLabelClick={props.handleServerChange}
            onChange={props.handleServerChange}
            // value={props.value}
            options={props.options}
            fluid
            selectOnBlur={false}
            selectOnNavigation={false}
            placeholder={props.placeholder ? props.placeholder : 'Type to search'}
            onSearchChange={props.handleServerSearchChange}
            search={props.search ? props.search : true}
        />
    );
}

export default ServerSearchMultipleDropdown;