import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useHttp2 from '../../hooks/useHttp2'
import PageHeader from '../../components/UI/PageHeader'
import MyTable from '../../components/table/MyTable'
import MyPagination from '../../components/table/MyPagination'
import { schoolColumn } from '../../utils/Columns'
import SearchBar from '../../components/filter/SearchBar'
import { Button } from 'antd'
import { FaPlus } from 'react-icons/fa'


const Schools = () => {

  const [date, setDate] = useState('')
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
    console.log('we are here')
    sendRequest({
        url: `center?limit=${limit}&page=${page}&search=${query}&date=${date}`
    }, result => {
      setData(result.data.docs)
      setPageDetails({ ...result.data, docs: [] })
    })
  }

  useEffect(() => {
    getData()
  }, [limit, page, query,date])

  useEffect(() => {
    setPage(1)
  }, [query,date])


  const handleActive = (id, activeStatus) => {
    sendRequest({
      url: `centers/${id}/edit`,
      method: 'PUT',
      body: { active: !activeStatus }
    }, result => {
      getData()
    }, true)
  }

  const columns = schoolColumn(handleActive)

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 25
        }}
      >
        <PageHeader heading={'Schools List'} >
          <Button onClick={()=>navigate('add')} type='primary' icon={<FaPlus/>}  >Add School</Button>
        </PageHeader>

        {/* <SearchBar func={setQuery} value={query} placeholder={'Search Schools by name'} /> */}
        <h4 style={{ color: 'var(--color_black_2)', fontWeight: '500' }}>
          {pageDetails?.totalDocs ?? 0} Results</h4>
        <MyTable data={data} columns={columns} />
        <MyPagination {...paginationObject} />
      </div>
    </>
  )
}

export default Schools
