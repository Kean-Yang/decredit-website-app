import React from 'react';
import { DatePicker } from 'antd';

const test = () => {
    const onChange = (date: any, dateString: any) => {
        console.log(date, dateString);
    };
    return (
        <div className="test">
            <DatePicker onChange={onChange} />
        </div>
    );
};

export default test;
