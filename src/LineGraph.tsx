import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface LineGraphProps {
  data: { year: number; totalJobs: number }[]
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='year' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type='monotone' dataKey='totalJobs' stroke='#82ca9d' activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LineGraph
