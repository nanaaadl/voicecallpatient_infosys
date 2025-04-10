import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const Statistics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/request/stats')
      .then(res => {
        const formatted = Object.entries(res.data).map(([day, count]) => ({ day, count }));
        setData(formatted);
      })
      .catch(err => console.error("Stats load error", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Weekly Fulfilled Requests</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;
