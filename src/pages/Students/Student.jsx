import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useHttp2 from '../../hooks/useHttp2'
import PageHeader from '../../components/UI/PageHeader'
import MyTable from '../../components/table/MyTable'
import MyPagination from '../../components/table/MyPagination'
import { schoolColumn, studentColumn } from '../../utils/Columns'
import SearchBar from '../../components/filter/SearchBar'
import { FaDownload, FaPlus } from 'react-icons/fa'
import { Button, Space } from 'antd'
import Cookies from 'js-cookie'
import SearchAndFilter from '../../components/filter/SearchAndFilter'
import useHttpHtml from '../../hooks/useHttpHtml'

const Students = () => {

  // const token = JSON.parse(Cookies.get('admin') ?? {})?.token
  const { sendRequest, isLoading } = useHttp2()
  const { sendRequest: reqHtml, isLoading: htmlLoading } = useHttpHtml()
  const center_id = JSON.parse(Cookies.get('school') ?? {})?.user?.id
  const { sendRequest: handleDataDownload, isLoading: dataDownloadLoading } = useHttp2()
  const [data, setData] = useState([])
  const [pageDetails, setPageDetails] = useState({})
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const navigation = useNavigate()
  // For Filter
  const [date, setDate] = useState('')
  const [query, setQuery] = useState('')

  const filterProps = {
    query,
    setQuery,
    date,
    setDate
  }

  //   const downloadExcelFile = async () => {
  //     try {
  //         const response = await fetch('http://127.0.0.1:8001/api/v1/download-students-xls', {
  //             method: 'GET',
  //             headers: {
  //                 'Content-Type': 'application/vnd.ms-excel', 
  //                 'Authorization':`Bearer ${token}`
  //             }
  //         });

  //         if (!response.ok) {
  //             throw new Error('Network response was not ok');
  //         }

  //         const blob = await response.blob();

  //         // Create a URL for the blob
  //         const url = window.URL.createObjectURL(blob);

  //         // Create an anchor element and simulate a click
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.setAttribute('download', 'file.xls'); // Set the file name
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //     } catch (error) {
  //         console.error('Error downloading the file:', error);
  //     }
  // };




  const paginationObject = {
    pageDetails,
    limit,
    setLimit,
    page,
    setPage
  }


  const navigate = useNavigate()

  const getData = () => {
    sendRequest({
      url: `student/center/${center_id}?limit=${limit}&page=${page}&search=${query}&date=${date}`
    }, result => {
      setData(result.data.docs)
      setPageDetails({ ...result.data, docs: [] })
    })
  }
  const handleDelete = (id) => {
    sendRequest({
      url: `students/${id}`,
      method: 'DELETE'
    }, result => {
      getData()
    }, true)
  }

  const viewAdmitCard = (id) => {
    sendRequest({
      url: 'generate-admit-card',
      method: 'POST',
      body: {
        student_id: id
      }
    }, (res) => {

      console.log(res);

      const { admit_card } = res.data;
      if (!admit_card) {
        console.error('Admit card URL is undefined');
        return;
      }

      const url = admit_card;
      const newTab = window.open();
      if (newTab) {
        newTab.location.href = url;
      } else {
        console.error('Failed to open new tab. Check your browser settings for pop-up blockers.');
      }
    }, true);
  };

  const downloadAllAdmitCards = () => {
    sendRequest({
        url: 'generate-admit-cards',
        method: 'POST',
        responseType: 'blob' // Ensure response type is blob for file download
    },
    (res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'all_admit_cards.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }, true);
};




  useEffect(() => {
    getData()
  }, [limit, page, query, date])

  useEffect(() => {
    setPage(1)
  }, [query, date])

  const columns = studentColumn((id) => navigate(`edit/${id}`), handleDelete, id => navigate(`view/${id}`), (id) => viewAdmitCard(id))

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 25
        }}
      >
        <PageHeader heading={'Students List'} >
          <Space>
            <Button icon={<FaDownload />} type="default" onClick={downloadAllAdmitCards}> Download All Admit Cards </Button>
            <Button onClick={() => navigate('add')} type='primary' icon={<FaPlus />}  >Add Student</Button>
          </Space>
        </PageHeader>
        <SearchAndFilter {...filterProps} />
        {/* <SearchBar func={setQuery} value={query} placeholder={'Search Students by name'} /> */}
        <h4 style={{ color: 'var(--color_black_2)', fontWeight: '500' }}>
          {pageDetails?.totalDocs ?? 0} Results</h4>
        <MyTable data={data} columns={columns} />
        <MyPagination {...paginationObject} />
      </div>
    </>
  )
}

export default Students
