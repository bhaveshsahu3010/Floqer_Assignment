import React from 'react'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'

interface JobDetail {
  title: string
  count: number
}

interface DetailTableProps {
  data: JobDetail[]
}

const DetailTable: React.FC<DetailTableProps> = ({ data }) => {
  const columns: ColumnsType<JobDetail> = [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
  ]

  return <Table columns={columns} dataSource={data} rowKey='title' />
}

export default DetailTable
