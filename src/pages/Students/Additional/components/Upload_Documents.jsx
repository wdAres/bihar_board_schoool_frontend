import React, { useState } from 'react'
import { Button, Card, DatePicker, Flex, Input, message, Select, Space, Upload } from 'antd'
import classes from './Component.module.css'
import FormItem from '../../../../components/FormItem/FormItem'
import MyUpload from '../../../../components/MyUpload/MyUpload'
import { FaDumpster, FaPlus } from 'react-icons/fa'
import { checkFileSize, checkFileType, handleFile } from '../../../../utils/fileOperations'
import MyUpload2 from '../../../../components/MyUpload/MyUpload2'
const Upload_Docuements = ({studentPhoto=[] ,studentSign=[],parentSign=[], handleFiles=()=>{}}) => {


    // const [studentPhoto, setStudentPhoto] = useState()


    const uploadButton = (
        <div>
            <FaPlus />
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    const inputFields = [
        {
            label: 'Student Photo',
            name: 'student_photo',
            rules: [{ required: true }],
            dataObj: {
                maxCount: 1,
                listType:'picture-card',
                beforeUpload:x=>false,
                fileList:studentPhoto,
                onChange:fileList=>handleFiles(fileList,'student_photo')
            },
            element: (data) => <Upload  {...data}>
                {uploadButton}
            </Upload>
        },
        {
            label: 'Student Signature',
            name: 'student_signature',
            rules: [{ required: true }],
            dataObj: {
                maxCount: 1,
                listType:'picture-card',
                beforeUpload:x=>false,
                fileList:studentSign,
                onChange:fileList=>handleFiles(fileList,'student_signature')
            },
            element: (data) => <Upload  {...data}>
                {uploadButton}
            </Upload>
        },
        {
            label: 'Student Parents Signature',
            name: 'parent_signature',
            rules: [{ required: true }],
            dataObj: {
                maxCount: 1,
                listType:'picture-card',
                beforeUpload:x=>false,
                fileList:parentSign,
                onChange:fileList=>handleFiles(fileList,'parent_signature')
            },
            element: (data) => <Upload  {...data}>
                {uploadButton}
            </Upload>
        }
    ];


    return (
        <Card
            size="small"
            title="Upload Documents"
        >
            <div className={classes.card_body}>
                {inputFields.map(element => <FormItem key={element.name} {...element} />)}
            </div>
        </Card>
    )
}

export default Upload_Docuements