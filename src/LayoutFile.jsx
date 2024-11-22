import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import classes from './LayoutFile.module.css'
import Sidebar from './components/LayoytElements/Sidebar';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import Header from './components/LayoytElements/Header';
import VerifyProfile from './pages/Auth/VerifyProfile';
const { Content } = Layout;


const LayoutFile = ({children}) => {
    const navigate = useNavigate()
    const school = Cookies.get('school') ? JSON.parse(Cookies.get('school')) : false
    const [sidebar , setSidebar] = useState(false)

    useEffect(() => {
        !school ? navigate('/login') : school.user.profile_review ? '' : navigate('/verify-profile')
    }, [school])

    const handleSidebar = ()=>setSidebar(!sidebar)

    return (
        <div
        className={classes.layout}
        >
             <ToastContainer
                position='top-right'
                autoClose='1000'
                closeOnClick
                pauseOnHover={false}
                draggable
                theme="light"
            />
            <Sidebar handleSidebar={handleSidebar} sidebar={sidebar} />
            <Layout
            className={classes.main_layout}
            >
                <Header handleSidebar={handleSidebar} />
                {/* <Header className={classes.header} /> */}
                <Content className={classes.content}>
                    {children}
                </Content>
            </Layout>
        </div>
    );
};

export default LayoutFile;