import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Papa, { ParseResult } from 'papaparse'
import LineGraph from './LineGraph'
import DetailTable from './DetailTable'

interface SalaryData {
  work_year: number
  experience_level: string
  employment_type: string
  job_title: string
  salary: number
  salary_currency: string
  salary_in_usd: number
  employee_residence: string
  remote_ratio: number
  company_location: string
  company_size: string
}

interface AggregatedData {
  year: number
  totalJobs: number
  averageSalary: number
}

interface JobDetail {
  title: string
  count: number
}

const App: React.FC = () => {
  const [data, setData] = useState<SalaryData[]>([])
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [jobDetails, setJobDetails] = useState<JobDetail[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/salaries.csv')
        const csvText = await response.text()
        Papa.parse<SalaryData>(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (result: ParseResult<SalaryData>) => {
            // Filter out invalid entries
            const parsedData = result.data.filter(item => item.work_year && item.salary_in_usd)
            setData(parsedData)
            aggregateData(parsedData)
          },
        })
      } catch (error) {
        console.error('Error fetching or parsing CSV file', error)
      }
    }

    fetchData()
  }, [])

  const aggregateData = (data: SalaryData[]) => {
    const result: { [year: number]: { totalJobs: number; totalSalary: number } } = {}

    data.forEach(item => {
      if (!result[item.work_year]) {
        result[item.work_year] = { totalJobs: 0, totalSalary: 0 }
      }
      result[item.work_year].totalJobs += 1
      result[item.work_year].totalSalary += item.salary_in_usd
    })

    const aggregatedArray: AggregatedData[] = Object.keys(result).map(year => {
      const yearNum = parseInt(year)
      const totalJobs = result[yearNum].totalJobs
      const totalSalary = result[yearNum].totalSalary

      if (totalJobs === 0) {
        console.error(`Total jobs for year ${yearNum} is zero, which is unexpected.`)
        return null
      }

      return {
        year: yearNum,
        totalJobs: totalJobs,
        averageSalary: totalSalary / totalJobs,
      }
    }).filter(item => item !== null) as AggregatedData[]

    setAggregatedData(aggregatedArray)
  }

  const handleRowClick = (record: AggregatedData) => {
    setSelectedYear(record.year)
    const details = data
      .filter(item => item.work_year === record.year)
      .reduce<{ [title: string]: number }>((acc, item) => {
        if (!acc[item.job_title]) {
          acc[item.job_title] = 0
        }
        acc[item.job_title] += 1
        return acc
      }, {})

    const detailsArray: JobDetail[] = Object.keys(details).map(title => ({
      title,
      count: details[title],
    }))

    setJobDetails(detailsArray)
  }

  const columns: ColumnsType<AggregatedData> = [
    {
      title: 'Year',
      dataIndex: 'year',
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: 'Number of Jobs',
      dataIndex: 'totalJobs',
      sorter: (a, b) => a.totalJobs - b.totalJobs,
    },
    {
      title: 'Average Salary (USD)',
      dataIndex: 'averageSalary',
      sorter: (a, b) => a.averageSalary - b.averageSalary,
      render: (value: number) => value.toFixed(2),
    },
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={aggregatedData}
        rowKey='year'
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        style={{ cursor: 'pointer' }}
      />
      <LineGraph data={aggregatedData.map(({ year, totalJobs }) => ({ year, totalJobs }))} />
      {selectedYear && <DetailTable data={jobDetails} />}
    </div>
  )
}

export default App
