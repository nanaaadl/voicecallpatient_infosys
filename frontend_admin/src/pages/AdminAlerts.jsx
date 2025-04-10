
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get('/api/request/recent')
      .then(res => setAlerts(res.data))
      .catch(err => console.error("Error loading alerts", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Fulfilled Requests</h2>
      <div className="bg-white shadow rounded-lg overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Patient</th>
              <th className="py-2 px-4">Nurse</th>
              <th className="py-2 px-4">Room</th>
              <th className="py-2 px-4">Fulfilled At</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, i) => (
              <tr key={i} className="border-b">
                <td className="py-2 px-4">{alert.patientName}</td>
                <td className="py-2 px-4">{alert.nurseName}</td>
                <td className="py-2 px-4">{alert.room}</td>
                <td className="py-2 px-4">{new Date(alert.fulfilledAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAlerts;

