import React, { useEffect, useState } from 'react';
import classes from './Profile.module.css';
import { Button, Card, Col, Flex, Form, Input, Row, Select, Upload } from 'antd';
import FormItem from '../../components/FormItem/FormItem';
import useHttpForm from '../../hooks/useHttpForm';
import { useNavigate } from 'react-router';
import { FaPlus } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { BASE_API, BASE_URL } from '../../utils/BASE_URL';

function Profile() {

    console.log(BASE_API+'/')
    const [form] = Form.useForm();
    const { sendRequest, isLoading } = useHttpForm()
    const navigate = useNavigate()
    const id = Cookies.get('school') ? JSON.parse(Cookies.get('school')).user.id : '';

    const [principalSign, setPrincipalSign] = useState(null)

    const dic = {
        'school_prinipal_signature': setPrincipalSign,
    }

    const handleFiles = (fileList, key) => {
        setPrincipalSign(fileList.fileList)
        form.setFieldValue(key, fileList)
    }


    const handleForm = values => {

        delete values.email;

        const formData = new FormData()

        if (typeof values.school_principal_signature !== 'string' && values.school_principal_signature.file) {
            formData.append('school_principal_signature', values.school_principal_signature.file);
        }

        delete values.school_principal_signature

        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                formData.append(key, values[key]);
            }
        }

        sendRequest({
            url: `center/${id}`,
            method: 'PATCH',
            body: formData
        }, result => {
            const token = JSON.parse(Cookies.get('school') ?? {}).token
            Cookies.set('school', JSON.stringify({
                user: result.data,
                token
            }))
        }, true)

    }

    useEffect(() => {
        sendRequest({
            url: `center/${id}`
        }, result => {
            form.setFieldsValue(result.data)
            setPrincipalSign([{
                uid: '-1',
                name: 'school_principal_signature',
                status: 'done',
                url: `${BASE_API}/${result.data.school_principal_signature}`
            }])
        })
    }, [])

    const inputFields = [
        {
            label: 'School Name',
            name: 'school_name',
            rules: [
                { required: true, message: 'School name is required' },
                { pattern: /^(?!.* {2}).*$/, message: 'No more than one space between words' }
            ],
            element: (data) => <Input {...data} />
        },
        {
            label: 'School Email',
            name: 'email',
            rules: [
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Please enter a valid email' }
            ],
            dataObj: { disabled: true },
            element: (data) => <Input {...data} />
        },
        {
            label: 'School Mobile',
            name: 'school_mobile_no',
            rules: [
                { required: true, message: 'Mobile number is required' },
                { pattern: /^\d{10}$/, message: 'Mobile number must be 10 digits and only digits' }
            ],
            element: (data) => <Input {...data} />
        },
        {
            label: 'School District',
            name: 'school_district',
            rules: [
                { required: true, message: 'School district is required' }
            ],
            element: (data) => <Input {...data} />
        },
        {
            label: 'School Category',
            name: 'school_category',
            rules: [
                { required: true, message: 'School category is required' }
            ],
            dataObj: {
                options: [
                    { label: 'Category 429', value: '429' },
                    { label: 'Category 223', value: '223' },
                    { label: 'Category 3776', value: '3776' },
                    { label: 'Category 711', value: '711' },
                    { label: 'Category 69', value: '69' }
                ]
            },
            element: (data) => <Select {...data} />
        },
        {
            label: 'School Level',
            name: 'school_level',
            rules: [
                { required: true, message: 'School level is required' }
            ],
            dataObj: {
                options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'Senior Secondary', value: 'senior secondary' },
                    { label: 'Middle', value: 'middle' }
                ]
            },
            element: (data) => <Select {...data} />
        },
        {
            label: 'School Address',
            name: 'center_address',
            rules: [
                { required: true, message: 'School address is required' }
            ],
            element: (data) => <Input {...data} />
        },
        {
            label: 'School Pincode',
            name: 'school_pincode',
            rules: [
                { required: true, message: 'School pincode is required' },
                { pattern: /^\d+$/, message: 'Pincode must be only digits' }
            ],
            element: (data) => <Input {...data} />
        },
        {
            label: 'School Principal Signature',
            name: 'school_principal_signature',
            rules: [
                { required: true, message: 'School principal signature is required' }
            ],
            dataObj: {
                beforeUpload: x => false,
                listType: 'picture-card',
                maxCount: 1,
                fileList: principalSign,
                onChange: fileList => handleFiles(fileList, 'school_principal_signature')
            },
            element: (data) => <Upload {...data} >
                <button
                    style={{ border: 0, background: 'none' }}
                    type="button"
                >
                    <FaPlus />
                    <div style={{ marginTop: 8 }}>
                        Upload
                    </div>
                </button>
            </Upload>
        }
    ];

    return (
        <Form
            scrollToFirstError
            form={form}
            layout="vertical"
            name={'basic'}
            onFinish={handleForm}
        >
            <Row
                gutter={20}
            >
                <Col
                    xs={{
                        span: 24,
                    }}
                    lg={{
                        span: 24,
                    }}

                    className={classes.my_flex}>
                    <Card
                        size="small"
                        title="Update Profile Details"
                    >
                        <div className={classes.card_body}>
                            {inputFields.map((element, index) => (
                                <FormItem key={index} {...element} />
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
            <Flex align='center' justify='flex-end'>
                <Button htmlType='submit' className={classes.btn} disabled={isLoading} type='primary'>Update Profile</Button>
            </Flex>
        </Form>
    )
}

export default Profile