import React from 'react';
import {FormattedNumber} from 'react-intl';
import {varTypes} from '../../config/apiHelpers';
import tableStyles from '../styles/table';

const defaultPercentProps = {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
};

export default (content, rowKey, cellKey, p) => {
    const isPercent = (enumValue) => 
                            (varTypes[p.vars.combo[enumValue]] === 'percent') ||
                            (p.rows.type === 'detailed' && rowKey % 3 !== 0);
    const getValue = (v, enumValue) => (
        (v === undefined || isNaN(parseFloat(v))) ? 
            null : 
            parseFloat(v) / (isPercent(enumValue) ? 100 : 1)
    );
    const renderValue = (v, enumValue) => {
        let value = getValue(v, enumValue),
            percentProps = isPercent(enumValue) ? defaultPercentProps : null;
        return value ? (
            <FormattedNumber 
                locales={'en-US'/* p.language.messages.locale */} 
                value={value}
                {...percentProps}
            />
        ) : '-';
    };
        
    let values = content ? content.split('|') : [null, null],
        firstLine = renderValue(values[0], 'first'),
        secondLine = p.rows.type === 'detailed' ? null : renderValue(values[1], 'second'),
        cellContent = secondLine ? (
            <div>
                <span>{firstLine}</span><br/>
                <span className="secondary">{secondLine}</span>
            </div>
        ):(
            <span>
                {firstLine}
            </span>
        );
    return (
        <td 
            key={cellKey}
            style={tableStyles(p).borderRight}
        >
            {cellContent}
        </td>
    );
}