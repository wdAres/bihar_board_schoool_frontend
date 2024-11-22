import React, { useEffect } from 'react';
import classes from './VerifyProfile.module.css';
import { Button, Col, Form, Input, Row, Select, Upload } from 'antd';
import FormItem from '../../components/FormItem/FormItem';
import useHttpForm from '../../hooks/useHttpForm';
import { useNavigate } from 'react-router';
import { FaPlus } from 'react-icons/fa';
import Cookies from 'js-cookie';

function VerifyProfile() {

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
        maxCount: 1
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

  const [form] = Form.useForm();
  const { sendRequest, isLoading } = useHttpForm()
  const navigate = useNavigate()

  const handleForm = values => {

    delete values.email;

    const formData = new FormData()

    formData.append('school_principal_signature', values.school_principal_signature.file)

    delete values.school_principal_signature;

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        formData.append(key, values[key]);
      }
    }

    formData.append('profile_review', true)

    sendRequest({
      url: `center/details`,
      method: 'PATCH',
      body: formData
    }, result => {
      const token = JSON.parse(Cookies.get('school') ?? {})
      Cookies.set('school', JSON.stringify({
        user: result.data,
        token
      }))

      navigate('/student')

    }, true)

  }

  useEffect(() => {
    sendRequest({
      url: `center/details`
    }, result => {
      form.setFieldsValue(result.data)
      if (result.data.profile_review) {
        console.log('we are here')
        navigate('/student')
      }

    })
  }, [])

  return (
    <section className={classes.section}>
      <div className={classes.section_top} >
        <h1>Please Verify Your Profile</h1>
        <p>
          Please verify your profile and make sure to confirm all your fields. <br /> If you found any anomaly in your profile so please make sure to update your data.
        </p>
      </div>
      <div className={classes.section_body}>
        <Form
          scrollToFirstError
          form={form}
          layout="vertical"
          name={'basic'}
          onFinish={handleForm}
        >
          <div className={classes.form}>
            {inputFields.map((element, index) => (
              <FormItem key={index} {...element} />
            ))}
          </div>
          <Button htmlType='submit' className={classes.btn} disabled={isLoading} type='primary'>Update Profile</Button>
        </Form>
      </div>
    </section>
  )
}

export default VerifyProfile