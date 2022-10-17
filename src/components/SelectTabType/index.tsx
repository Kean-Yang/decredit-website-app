import React from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';

interface DataProps {
    typeName?: string;
    typeList?: any;
    typeIndex: any;
    switchIndex?: (value: any) => any;
}

const SelectTabType = ({
    typeName = '',
    typeList = [],
    typeIndex = 0,
    switchIndex = () => {},
}: DataProps) => {
    const { t } = useTranslation();
    const splitjoin = (str: string) => {
        return str.split(' ').join('_');
    };

    return (
        <div className="select-tab-type">
            {typeName || ''}
            <div className="select-tab-type-item">
                {typeList &&
                    typeList.map((item: any, index: any) => {
                        return (
                            <div
                                className={
                                    typeIndex === item.id ||
                                    typeIndex === item.value
                                        ? 'active'
                                        : ''
                                }
                                key={index}
                                id={item.id || item.value}
                                onClick={() => {
                                    switchIndex({ ...item, index: index });
                                }}
                            >
                                {/* str.split(' ').join('_'); */}
                                {/* {item.name} */}
                                {t(`${splitjoin(item.name)}`)}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default SelectTabType;
