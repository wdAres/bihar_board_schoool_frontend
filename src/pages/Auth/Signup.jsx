import React from 'react'
import classes from './Auth.module.css'
import { Button, Form, Input } from 'antd'
import useHttp2 from '../../hooks/useHttp2'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import FormItem from '../../components/FormItem/FormItem'

const inputData = [
    {
        label: "Name",
        name: "name",
        rules: [
            {
                required: true,
            }
        ],
        element: (data) => <Input {...data} />
    },
    {
        label: "Email",
        name: "email",
        rules: [
            {
                required: true,
            }
        ],
        element: (data) => <Input {...data} />
    },
    {
        label: "Password",
        name: "password",
        rules: [
            {
                required: true,
                message: 'Please input your password!',
            },
            {
                min: 8,
                message: 'Minimum 8 characters required!'
            },
        ],
        element: ({data}) => <Input.Password {...data} />
    }
]

const Signup = () => {

    const { sendRequest, isLoading } = useHttp2()
    const navigate = useNavigate()

    const onFinish = (values) => {
        sendRequest({
            url: 'auth/register',
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: values
        }, result => {
            navigate('/login')
        }, true)
    };
    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };

    return (
        <section className={classes.section}>
            <Form
            className={classes.form}
                name="basic"
                labelCol={{
                    span: 24,
                }}
                wrapperCol={{
                    span: 24,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            // autoComplete="off"
            >
                {/* <Form.Item
                    label="username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        }
                    ]}
                >
                    <Input />
                </Form.Item> */}

                {/* <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            min: 8,
                            message: 'Minimum 8 characters required!'
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item> */}

                <h1 className={classes.heading}>Signup</h1>


                {inputData.map(element => <FormItem key={element.name} {...element} />)}

                <Form.Item
                    wrapperCol={{
                        span: 24,
                    }}
                >
                    <Button style={{marginTop:'30px',width:'100%'}} loading={isLoading} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </section>
    )
}

export default Signup