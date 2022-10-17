import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';
import {
    Row,
    Col,
    Button,
    Form,
    Input,
    Radio,
    Spin,
    Breadcrumb,
    message,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { ApiCreditOraclesAddInfo } from '../../services';
import certificationLeftTop from '../../assets/certification-left-top.png';
import certificationRightBotton from '../../assets/certification-right-botton.png';
import certificationContent from '../../assets/certification-content.png';
import AuditPending from './components/AuditPending';
import './index.scss';

const Certification = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const wallet = useWallet();
    const { account } = wallet;
    const [current, setCurrent] = useState(0);

    const [visible, setVisible] = useState(false);
    const [nextLoad, setNextLoad] = useState(false);

    const showVisible = useCallback(() => {
        setVisible(true);
    }, []);
    const hideVisible = useCallback(() => {
        setVisible(false);
    }, []);

    const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;
    const jumpBcck = () => {
        history.goBack();
    };

    const switchPagplane = (current: Number) => {
        setCurrent(current);
    };
    const next = () => {
        setCurrent(current + 1);
        setTimeout(function () {
            setNextLoad(false);
        }, 1200);
    };
    const prev = () => {
        setCurrent(current - 1);
        setTimeout(function () {
            setNextLoad(false);
        }, 1200);
    };

    const onFinish = (values: any) => {
        setNextLoad(true);
        const params = {
            first_name: values.first_name || '',
            family_name: values.family_name || '',
            passport_no: values.passport_no || '',
            email: values.email || '',
            address: values.address || '',
            wallet_address: account, // 地址
            identity_type: values.identity_type || 3, // 身份类型 1:企业主 2:上班族 3:⾃由职业
            has_online_loan: values.has_online_loan || 2, //是否有⽹贷 1:是 2:否
            online_loan_num: values.online_loan_num || 1, // ⽹贷笔数 1:3笔以下 2:3笔以上
            is_overdue: values.is_overdue || 2, // 是否逾期 1:是 2:否
            overdue_info: values.overdue_info || 1, // 逾期情况 1:2年内2次 2:2年内6次以下 3:2年内 6次以上
            query: values.query || 1, //半年内查询次数 1:没有 2:2次及以下 3:3-5次 4:6次以上
            salary_payment: values.salary_payment || 1, // ⼯资发放⽅式 1:公司转账 2:现⾦⽀付 3:打卡⼯资
            has_car: values.has_car || 2, // 是否有⻋ 1:是 2:否
            car_price: values.car_price || 1, // 购⻋价格 1:10w以下 2:10-20w 3:20以上
            car_age: values.car_age || 1, // ⻋龄 1:3年以下 2:3年-6年 3:6以上
            has_house: values.has_house || 2, // 是否有房 1:是 2:否
            house_type: values.house_type || 5, // 房屋类型 1:有按揭⾃购房 2:⽆按揭⾃购房 3:亲属住房4:租房 5:其他
            has_life_insurance: values.has_life_insurance || 2, //是否寿险 1:是 2:否
            life_insurance_pay: values.life_insurance_pay || 1, // 寿险年缴纳⾦额 1:3000以下 2:3000以上
            life_insurance_year: values.life_insurance_year || 1, // 寿险缴纳年限 1:6个⽉ 2:1年 3:2年
            has_gjj: 2 || '', //是否公积⾦ 1:是 2:否
            gjj_month_pay: 1 || '', //公积⾦⽉缴⾦额 1:500⼀下 2:500-1000 3:1000以上
            is_gjj_pay_year: 2 || '', // 公积⾦连续缴纳1年以上 1:是 2:否
            has_credit_card: values.has_credit_card || 2, // 是否有信⽤卡 1:是 2:否
        };

        ApiCreditOraclesAddInfo(params)
            .then((res) => {
                setNextLoad(false);
                if (res.code === 200) {
                    showVisible();
                } else {
                    message.error('Network error, please try again');
                }
            })
            .catch((err) => {
                setNextLoad(false);
                message.error('Network error, please try again');
                console.log(err);
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        setCurrent(0);
    };

    return (
        <div className="certification">
            <img
                className="certificationLeftTop"
                src={certificationLeftTop as any}
                alt="OpenDefi"
            />
            <div className="certification-header">
                <span className="certification-header-title">
                    {t('FormInformation')}
                </span>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>{t('dashboard')}</Breadcrumb.Item>
                    <Breadcrumb.Item href="/dashboard">
                        {t('Credit')}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{t('FormInformation')}</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <Form
                name=""
                className="certification-form"
                layout="vertical"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                {/* <Steps current={current} onChange={switchPagplane}>
                    <Steps.Step title="1" description="Personal Information" />
                    <Steps.Step title="2" description="Personal Information" />
                    <Steps.Step title="3" description="Personal Information" />
                </Steps> */}

                <div className="steps">
                    <div
                        className={`steps-item ${
                            current === 0 ? 'active' : ''
                        }`}
                        onClick={() => {
                            switchPagplane(0);
                        }}
                    >
                        <div className="order">1</div>
                        <div className="divider"></div>
                    </div>
                    <div
                        className={`steps-item ${
                            current === 1 ? 'active' : ''
                        }`}
                        onClick={() => {
                            switchPagplane(1);
                        }}
                    >
                        <div className="order">2</div>
                        <div className="divider"></div>
                    </div>
                    <div
                        className={`steps-item ${
                            current === 2 ? 'active' : ''
                        }`}
                        onClick={() => {
                            switchPagplane(2);
                        }}
                    >
                        <div className="order">3</div>
                        <div className="divider"></div>
                    </div>
                </div>

                <div className="page">
                    <div
                        className={`page-item ${current === 0 ? 'active' : ''}`}
                    >
                        <div className="page-item-content">
                            <img
                                className="certificationContent"
                                src={certificationContent as any}
                                alt="OpenDefi"
                            />
                            <Row>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ1')}
                                        name="first_name"
                                        rules={[
                                            {
                                                required: true,
                                                message: t(
                                                    'creditFromQ_required'
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder={t('creditFromQ1')}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ2')}
                                        name="family_name"
                                        rules={[
                                            {
                                                required: true,
                                                message: t(
                                                    'creditFromQ_required'
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder={t('creditFromQ2')}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ3')}
                                        name="passport_no"
                                        rules={[
                                            {
                                                type: 'string',
                                                pattern: /^[0-9a-zA-Z]{1,}$/,
                                                required: true,
                                                message: t(
                                                    'creditFromQ_required'
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder={t('creditFromQ3')}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ4')}
                                        name="email"
                                        rules={[
                                            {
                                                type: 'email',
                                                required: true,
                                                message: t(
                                                    'creditFromQ_required'
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder={t('creditFromQ4')}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ5')}
                                        name="address"
                                        rules={[
                                            {
                                                required: true,
                                                message: t(
                                                    'creditFromQ_required'
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder={t('creditFromQ5')}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ6')}
                                        name="identity_type"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>
                                                {t('Entrepreneur')}
                                            </Radio>
                                            <Radio value={2}>
                                                {t('Employee')}{' '}
                                            </Radio>
                                            <Radio value={3}>
                                                {t('Freelancer')}
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ7')}
                                        name="has_online_loan"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>{t('Yes')}</Radio>
                                            <Radio value={2}>{t('No')} </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <div
                        className={`page-item ${current === 1 ? 'active' : ''}`}
                    >
                        <div className="page-item-content">
                            <img
                                className="certificationContent"
                                src={certificationContent as any}
                                alt="OpenDefi"
                            />
                            <Row>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ8')}
                                        name="online_loan_num"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>
                                                {t('NoMore3times')}
                                            </Radio>
                                            <Radio value={2}>
                                                {t('More3times')}
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ9')}
                                        name="is_overdue"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>{t('Yes')}</Radio>
                                            <Radio value={2}>{t('No')} </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ10')}
                                        name="overdue_info"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>
                                                {t('NoMoreTwice')}
                                            </Radio>
                                            <Radio value={2}>
                                                {t('36times')}
                                            </Radio>
                                            <Radio value={3}>
                                                {t('More6times')}{' '}
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ11')}
                                        name="query"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>{t('No')}</Radio>
                                            <Radio value={2}>
                                                {t('NoMoreTwice')}
                                            </Radio>
                                            <Radio value={3}>
                                                {t('35times')}
                                            </Radio>
                                            <Radio value={4}>
                                                {t('More5Times')}
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ12')}
                                        name="salary_payment"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>
                                                {t('CompanyTransfer')}
                                            </Radio>
                                            <Radio value={2}>{t('Cash')}</Radio>
                                            <Radio value={3}>
                                                {t('PayrollCard')}
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ13')}
                                        name="has_car"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>{t('Yes')}</Radio>
                                            <Radio value={2}>{t('No')} </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ14')}
                                        name="car_price"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>
                                                {t('NoMoreX', { x: '20,000' })}
                                            </Radio>
                                            <Radio value={2}>
                                                {t('pricePpurchase23')}
                                            </Radio>
                                            <Radio value={3}>
                                                {t('More30000')}{' '}
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <div
                        className={`page-item ${current === 2 ? 'active' : ''}`}
                    >
                        <div className="page-item-content">
                            <img
                                className="certificationContent"
                                src={certificationContent as any}
                                alt="OpenDefi"
                            />
                            <Row>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ15')}
                                        name="car_age"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>
                                                {t('NoMore3years')}
                                            </Radio>
                                            <Radio value={2}>
                                                {t('3_6years')}
                                            </Radio>
                                            <Radio value={3}>
                                                {t('More6years')}{' '}
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ16')}
                                        name="has_house"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>{t('Yes')}</Radio>
                                            <Radio value={2}>{t('No')} </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ17')}
                                        name="house_type"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>
                                                {t('MortgageHouse')}
                                            </Radio>
                                            <Radio value={2}>
                                                {t('FullPurchaseHouse')}
                                            </Radio>
                                            <Radio value={3}>
                                                {t('RelativeHouse')}{' '}
                                            </Radio>
                                            <Radio value={4}>
                                                {t('RentalHouse')}{' '}
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ18')}
                                        name="has_life_insurance"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>{t('Yes')}</Radio>
                                            <Radio value={2}>{t('No')} </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ19')}
                                        name="life_insurance_pay"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>
                                                {t('NoMoreX', { x: 500 })}
                                            </Radio>
                                            <Radio value={2}>
                                                {' '}
                                                {t('MoreThanX', {
                                                    x: 500,
                                                })}{' '}
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ20')}
                                        name="life_insurance_year"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>
                                                {t('Nomore6months')}
                                            </Radio>
                                            <Radio value={2}>
                                                {t('6months1year')}
                                            </Radio>
                                            <Radio value={3}>
                                                {t('More2years')}
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>

                                <Col
                                    xs={24}
                                    sm={24}
                                    lg={{ span: 12, offset: 6 }}
                                >
                                    <Form.Item
                                        label={t('creditFromQ21')}
                                        name="has_credit_card"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>{t('Yes')}</Radio>
                                            <Radio value={2}>{t('No')} </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>

                <Form.Item>
                    <div className="form-but">
                        {current > 0 && current !== 0 ? (
                            <Button
                                type="text"
                                className="back"
                                onClick={() => {
                                    setNextLoad(true);
                                    prev();
                                }}
                            >
                                {t('back')}
                            </Button>
                        ) : (
                            ''
                        )}
                        {current < 2 && (
                            <Button
                                type="text"
                                className="back"
                                loading={nextLoad}
                                onClick={() => {
                                    setNextLoad(true);
                                    next();
                                }}
                            >
                                {t('Next')}
                            </Button>
                        )}
                        {current === 2 && (
                            <Button
                                type="text"
                                className="ok"
                                htmlType="submit"
                            >
                                {t('Submit')}
                            </Button>
                        )}
                    </div>
                </Form.Item>

                {nextLoad && (
                    <div className="spin">
                        <Spin
                            tip="Loading..."
                            delay={600}
                            indicator={antIcon}
                        ></Spin>
                    </div>
                )}
            </Form>

            <img
                className="certificationRightBotton"
                src={certificationRightBotton as any}
                alt="OpenDefi"
            />

            <AuditPending
                close={hideVisible}
                back={jumpBcck}
                visible={visible}
            />
        </div>
    );
};

export default Certification;
