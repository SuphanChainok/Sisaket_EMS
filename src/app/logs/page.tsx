'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import '@/styles/table.css';

interface LogEntry {
  _id: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // ดึงข้อมูลจริงจาก API
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch(err => console.error(err));
  }, []);

  const getActionColor = (action: string) => {
    if (action.includes('DELETE') || action.includes('REJECT')) return '#ef5350'; // แดง
    if (action.includes('APPROVE') || action.includes('CREATE')) return '#66bb6a'; // เขียว
    if (action.includes('UPDATE')) return '#ffa726'; // ส้ม
    return 'var(--text-primary)';
  };

  return (
    <div className="page-container">
      <Header title=" ประวัติการใช้งานระบบ" subtitle="Activity Logs (100 รายการล่าสุด)" />

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{width: '180px'}}>วัน-เวลา</th>
              <th style={{width: '150px'}}>ผู้ใช้งาน</th>
              <th style={{width: '150px'}}>การกระทำ</th>
              <th>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {new Date(log.timestamp).toLocaleString('th-TH')}
                </td>
                <td style={{ fontWeight: 'bold' }}>{log.user}</td>
                <td>
                  <span style={{ 
                    color: getActionColor(log.action),
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {log.action}
                  </span>
                </td>
                <td>{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {logs.length === 0 && (
          <div className="no-results">ยังไม่มีประวัติการใช้งาน</div>
        )}
      </div>
    </div>
  );
}