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

const Students = () => {

  const center_id = JSON.parse(Cookies.get('school') ?? {})?.user?.id
  const [date, setDate] = useState(new Date())
  const [query, setQuery] = useState('')
  const { sendRequest, isLoading } = useHttp2()
  const [data, setData] = useState([])
  const [pageDetails, setPageDetails] = useState({})
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const navigation = useNavigate()

  const paginationObject = {
    pageDetails,
    limit,
    setLimit,
    page,
    setPage
  }

  const filterProps = {
    query,
    setQuery,
    date,
    setDate
  }

  const navigate = useNavigate()

  const getData = () => {
    sendRequest({
      url: `students/center/${center_id}?limit=${limit}&page=${page}&search=${query}`
    }, result => {
      setData(result.data.docs)
      setPageDetails({ ...result.data, docs: [] })
    })
  }
  const handleDelete = (id) => {
    sendRequest({
      url: `students/${id}`,
      method:'DELETE'
    }, result => {
      getData()
    },true)
  }

  useEffect(() => {
    getData()
  }, [limit, page, query])

  useEffect(() => {
    setPage(1)
  }, [query])

  const columns = studentColumn((id) => navigate(`edit/${id}`),handleDelete)

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
            <Button icon={<FaDownload />} type='default'>Download Data</Button>
            <Button onClick={() => navigate('add')} type='primary' icon={<FaPlus />}  >Add Student</Button>
          </Space>
        </PageHeader>
        <SearchAndFilter query={query} setQuery={setQuery} />
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
