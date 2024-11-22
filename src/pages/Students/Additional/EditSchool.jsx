import { Button, Col, Flex, Form, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import classes from './Additional.module.css'
import S_Info from './components/Student_Info';
import useHttpForm from '../../../hooks/useHttpForm';
import Upload_Docuements from './components/Upload_Documents';
import moment from 'moment';

const EditStudent = () => {


    const [form] = Form.useForm();
    const { sendRequest, isLoading } = useHttpForm()
    const navigate = useNavigate()
    const {id} = useParams()

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


        if (typeof values.student_photo !=='string' && values.student_photo.file) {
            formData.append('student_photo', values.student_photo.file);
        }
        
        if (typeof values.student_signature !=='string' && values.student_signature.file) {
            formData.append('student_signature', values.student_signature.file);
        }
        
        
        if (typeof values.parent_signature !=='string' && values.parent_signature.file) {
            formData.append('parent_signature', values.parent_signature.file);
        }
        

        delete values.student_signature
        delete values.student_photo
        delete values.parent_signature

        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                formData.append(key, values[key]);
            }
        }

        sendRequest({
            url: `students/${id}`,
            method: 'PUT',
            body: formData
        }, result => {
            navigate('/student')
        }, true)
    }

    useEffect(()=>{
        sendRequest({
            url:`students/${id}`,
        },result=>{
            form.setFieldsValue(result.data)
            console.log(result.data.student_photo)
            // setStudentPhoto([{
            //     uid:'-1',
            //     name:'student-photo',
            //     status:'done',
            //     url:'file:///C:/Users/Puneet%20Shrivastav/Documents/GitHub/bihar_board_backend/app/uploads/1732236716221-Theater-Circle_page-0001.jpg'
            // }])
            form.setFieldValue('dob_in_figures', moment(new Date).format('YYYY-MM-DD'))
        })
    },[])


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
                    <Upload_Docuements
                    {...uploadProps}
                    />
                </Col>
            </Row>
            <Flex align='center' justify='space-between'>
            <Button loading={isLoading}  htmlType='button' className={classes.bottom_btn} onClick={()=>navigate(-1)} size='large'>Back</Button>
            <Button loading={isLoading} htmlType='submit' className={classes.bottom_btn} type='primary' size='large'>Edit Student</Button>
            </Flex>
        </Form>
    )
}

export default EditStudent
