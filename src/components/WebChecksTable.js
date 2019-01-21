import React from 'react'
import { Button } from 'semantic-ui-react';
import GenericTable from './GenericTable';

export default class WebChecksTable extends GenericTable {

    getColumns() {
        return [
            {
                name: "Name",
                prop: "Title",
                width: 4,
            },
            {
                name: "Url",
                prop: "Url",
                width: 8
            },
            {
                name: "Expected Text",
                prop: "ExpectedText",
                width: 3
            },
            {
                name: "KB article",
                prop: "Knowledgebasearticle",
                display: "kblink"
            }
        ];
    }

    transformDataRow(data) {
        data.kblink = (
            <Button
                as="a"
                href={data.Knowledgebasearticle}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '0.3em' }}
                size='medium'
                icon='external' />
        );
        return data;
    }
}
