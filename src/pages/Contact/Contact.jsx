import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useHttp2 from '../../hooks/useHttp2'
import PageHeader from '../../components/UI/PageHeader'
import MyTable from '../../components/table/MyTable'
import MyPagination from '../../components/table/MyPagination'
import { contactColumn } from '../../utils/Columns'
import SearchBar from '../../components/filter/SearchBar'


const Contact = () => {

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
      url: `contact?limit=${limit}&page=${page}&search=${query}`
    }, result => {
      console.log(result.data.docs)
      setData(result.data.docs)
      setPageDetails({ ...result.data, docs: [] })
    })
  }

  useEffect(() => {
    getData()
  }, [limit, page, query])

  useEffect(() => {
    setPage(1)
  }, [query])

  

  const columns = contactColumn()

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 25
        }}
      >
        <PageHeader heading={'Contacts'} />
        <h4 style={{ color: 'var(--color_black_2)', fontWeight: '500' }}>
          {pageDetails?.totalDocs ?? 0} Results</h4>
        <MyTable data={data} columns={columns} />
        <MyPagination {...paginationObject} />
      </div>
    </>
  )
}

export default Contact
