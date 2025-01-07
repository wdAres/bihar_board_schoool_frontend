import { Button, Card, Col, Form, Input, Row } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate,useParams } from 'react-router';
import useHttp2 from '../../hooks/useHttp2';
import classes from '../Employee/Additional/Additional.module.css'
import FormItem from '../../components/FormItem/FormItem';

const Property = () => {
    const { id } = useParams(); 
    const [form] = Form.useForm();
    const { sendRequest, isLoading } = useHttp2();
    const navigate = useNavigate();

    const handleForm = (values) => {
        // alert(values)
       
        sendRequest({
            url: `Property/${id}`,
            method: 'PATCH',
            body: values
        }, result => {
            navigate('/property')
        }, true)
    }

    useEffect(() => {
        sendRequest({ url: `Property/center/true` },
            result => {
                const propertyData = result.data.docs[0];
                form.setFieldsValue(propertyData);
            }, true);
    },
        [form, sendRequest]);

    const inputFields = [
        {
            label: 'Total Benches',
            name: 'totalBenches',
            rules: [{ required: true, message: 'Please enter the number of benches' }],
            element: (data) => <Input {...data} />
        },
        {
            label: 'Total Classrooms',
            name: 'totalClassRooms',
            rules: [{ required: true, message: 'Please enter the number of classrooms' }],
            element: (data) => <Input {...data} />
        },
        {
            label: 'Total Guards',
            name: 'totalGuards',
            rules: [{ required: true, message: 'Please enter the number of guards' }],
            element: (data) => <Input {...data} />
        },
        {
            label: 'Total Desks',
            name: 'totalDesks',
            rules: [{ required: true, message: 'Please enter the number of desks' }],
            element: (data) => <Input {...data} />
        },
        {
            label: 'Total Chairs',
            name: 'totalChairs',
            rules: [{ required: true, message: 'Please enter the number of chairs' }],
            element: (data) => <Input {...data} />
        },
        {
            label: 'Total Computers',
            name: 'totalComputers',
            rules: [{ required: true, message: 'Please enter the number of computers' }],
            element: (data) => <Input {...data} />
        },
        {
            label: 'Total Projectors',
            name: 'totalProjectors',
            rules: [{ required: true, message: 'Please enter the number of projectors' }],
            element: (data) => <Input {...data} />
        }

    ];


    return (
        <Form
            scrollToFirstError
            form={form}
            layout="vertical"
            name={'basic'}
            onFinish={handleForm}
            className={``}>
            <Row gutter={20}>
                <Col xs={{ span: 24 }} lg={{ span: 24 }} className={classes.my_flex}>
                    <Card
                        size="small"
                        title="School Property"
                    >
                        <div className={classes.card_body}>
                            {inputFields.map(element => <FormItem key={element.name} {...element} />)}
                        </div>
                    </Card>
                </Col>
            </Row>
            <Button loading={isLoading} htmlType='submit' className={classes.bottom_btn} type='primary' size='large'>Update</Button>
        </Form>
    )
}

export default Property;
