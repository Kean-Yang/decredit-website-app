import React from 'react';
import { Empty, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import NoDataIcon from '../../assets/loading-nodata.png';
import './Empty.scss';

interface DataProps {
    description?: string;
    linkUrl?: string;
    isCreate?: any;
    ButtonText?: string;
}

const NoData = ({
    description = '',
    linkUrl = '',
    ButtonText = '',
    isCreate = null,
}: DataProps) => {
    const { t } = useTranslation();

    return (
        <div className="Empty">
            <Empty
                image={NoDataIcon}
                imageStyle={{
                    height: 432,
                }}
                description={<span>{description || t('No_Data')}</span>}
            >
                {linkUrl ? (
                    <Link to={linkUrl}>
                        <Button type="primary" className="create-auction">
                            {isCreate ? isCreate : <PlusCircleOutlined />}
                            {ButtonText || t('Create_Auction')}
                        </Button>
                    </Link>
                ) : (
                    <Button type="primary" className="create-auction">
                        {isCreate ? isCreate : <PlusCircleOutlined />}
                        {ButtonText || t('Create_Auction')}
                    </Button>
                )}
            </Empty>
        </div>
    );
};

export default NoData;
