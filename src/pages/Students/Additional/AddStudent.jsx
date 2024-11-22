import { Button, Col, Form, Row } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import useHttp2 from '../../../hooks/useHttp2';
import classes from './Additional.module.css'
import S_Info from './components/Student_Info';
import School_Info from './components/School_Info';
import Center_Info from './components/Center_Info';
import useHttpForm from '../../../hooks/useHttpForm';
import Upload_Docuements from './components/Upload_Documents';

const AddStudent = () => {


    const [form] = Form.useForm();
    const { sendRequest, isLoading } = useHttpForm()
    const navigate = useNavigate()

     // Imp For File Hanlding

     const [studentPhoto,setStudentPhoto] = useState(null)
     const [parentSign,setParentSign] = useState(null)
     const [studentSign,setStudentSign] = useState(null)
 
     const dic = {
         'student_photo':setStudentPhoto,
         'student_signature':setStudentSign,
         'parent_signature':setParentSign,
     }
 
     const handleFiles = (fileList,key)=>{
         console.log(fileList)
         dic[key](fileList.fileList)
         form.setFieldValue(key,fileList)
     }
 
     const uploadProps = {
         studentPhoto,
         parentSign,
         studentSign,
         handleFiles
     }
 


    const handleForm = (values) => {

        const formData = new FormData()

        formData.append('student_photo',values.student_photo.file)
        formData.append('student_signature',values.student_signature.file)
        formData.append('parent_signature',values.parent_signature.file)

        delete values.student_signature
        delete values.student_photo
        delete values.parent_signature

        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                formData.append(key, values[key]);
            }
        }

        sendRequest({
            url: `students`,
            method: 'POST',
            body: formData
        }, result => {
            navigate('/student')
        }, true)
    }


    return (
        <Form
            scrollToFirstError
            form={form}
            layout="vertical"
            name={'basic'}
            onFinish={handleForm}
            className={``}>
            <Row
                gutter={20}
            >
                <Col
                    xs={{
                        span: 24,
                    }}
                    lg={{
                        span: 15,
                    }}

                    className={classes.my_flex}>
                    <S_Info />
                </Col>
                <Col
                    xs={{
                        span: 24,
                    }}
                    lg={{
                        span: 9,
                    }}
                    className={classes.my_flex}>
                    <Upload_Docuements {...uploadProps} />
                </Col>
            </Row>
            <Button loading={isLoading} htmlType='submit' className={classes.bottom_btn} type='primary' size='large'>Add Student</Button>
        </Form>
    )
}

export default AddStudent