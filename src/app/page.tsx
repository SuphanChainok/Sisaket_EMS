'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/dashboard.css';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading || !data) return <div style={{ padding: 40 }}>กำลังโหลดข้อมูล Dashboard...</div>;

  const { stats, topCenters, chartData } = data;

  // คำนวณเปอร์เซ็นต์สำหรับกราฟวงกลม
  const pendingPercent = chartData.total > 0 ? (chartData.pending / chartData.total) * 100 : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: '#7986cb' }}>ศรีสะเกษพร้อม</h1>
        <p style={{ color: '#888' }}>ระบบบริหารจัดการสภาวะวิกฤติของจังหวัดศรีสะเกษ</p>
        
        {/* เมนูแท็บ (Mockup ตามรูป) */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button style={{ background: '#ffca28', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>⚙️ ศูนย์อำนวยการ</button>
          <button style={{ background: '#2c2f33', color: '#888', border: '1px solid #444', padding: '8px 16px', borderRadius: '20px' }}>🏠 ศูนย์พักพิง</button>
          <button style={{ background: '#2c2f33', color: '#888', border: '1px solid #444', padding: '8px 16px', borderRadius: '20px' }}>📦 สิ่งของบริจาค</button>
        </div>
      </div>

      {/* 1. การ์ด 4 ใบ (Top Cards) */}
      <div className="dashboard-grid">
        {/* การ์ด 1: ศูนย์อพยพ */}
        <div className="stat-card-modern bg-purple">
          <div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>ศูนย์อพยพทั้งหมด</div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{stats.centers}</div>
          </div>
          <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '5px 10px', borderRadius: '4px', width: 'fit-content' }}>
            เปิดใช้งาน: {stats.centers}
          </div>
          <div className="card-icon">🏠</div>
        </div>

        {/* การ์ด 2: ประชากร */}
        <div className="stat-card-modern bg-cyan">
          <div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>ประชากรผู้อพยพรวม</div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{stats.population.toLocaleString()}</div>
          </div>
          <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '5px 10px', borderRadius: '4px', width: 'fit-content' }}>
            รองรับได้สูงสุด: ไม่ระบุ
          </div>
          <div className="card-icon">👥</div>
        </div>

        {/* การ์ด 3: คำร้องด่วน */}
        <Link href="/transfers" style={{ textDecoration: 'none' }}>
            <div className="stat-card-modern bg-pink" style={{ cursor: 'pointer' }}>
            <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>คำร้องด่วนทั้งหมด</div>
                <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{stats.pending}</div>
            </div>
            <div style={{ fontSize: '0.8rem', background: 'white', color: '#ef5350', padding: '5px 10px', borderRadius: '4px', width: 'fit-content', fontWeight: 'bold' }}>
                รออนุมัติ: {stats.pending}
            </div>
            <div className="card-icon">📄</div>
            </div>
        </Link>

        {/* การ์ด 4: อนุมัติแล้ว */}
        <div className="stat-card-modern bg-lavender">
          <div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>อนุมัติ/ส่งของแล้ว</div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{stats.completed}</div>
          </div>
          <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '5px 10px', borderRadius: '4px', width: 'fit-content' }}>
            จำนวน: {stats.completed}
          </div>
          <div className="card-icon">🚚</div>
        </div>
      </div>

      {/* 2. ส่วนล่าง: 5 อันดับ & กราฟวงกลม */}
      <div className="bottom-section">
        
        {/* ซ้าย: 5 อันดับศูนย์ที่มีการส่งของมากที่สุด */}
        <div className="content-box">
          <div className="box-header">
            <h3 style={{ margin: 0 }}>5 อันดับศูนย์ที่มีคำร้องมากที่สุด</h3>
            <span style={{ backgroundColor: '#0070f3', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>Top 5 Centers</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topCenters.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', marginTop: '50px' }}>ยังไม่มีข้อมูลการเบิกจ่าย</p>
            ) : (
                topCenters.map((center: any, index: number) => (
                    <div key={index} className="top-center-item">
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <div className="rank-badge">{index + 1}</div>
                            <div>{center._id}</div>
                        </div>
                        <div className="progress-bar-bg">
                            {/* คำนวณความยาวกราฟแท่งเทียบกับอันดับ 1 */}
                            <div 
                                className="progress-bar-fill" 
                                style={{ width: `${(center.count / topCenters[0].count) * 100}%` }}
                            ></div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: 'var(--accent-green)' }}>{center.count} ครั้ง</div>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* ขวา: สถานะคำร้องด่วน (Donut Chart) */}
        <div className="content-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
             <h3 style={{ margin: 0 }}>สถานะของคำร้องด่วน</h3>
             <span style={{ background: '#333', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>ทั้งหมด {chartData.total}</span>
          </div>

          {/* CSS Donut Chart */}
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '20px 0' }}>
            <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: `conic-gradient(
                    #ffca28 0% ${pendingPercent}%, 
                    #2c2f33 ${pendingPercent}% 100%
                )`
            }}></div>
            {/* รูตรงกลาง */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '160px', height: '160px', borderRadius: '50%', backgroundColor: 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffca28' }}>
                        {pendingPercent.toFixed(0)}%
                    </div>
                    <div style={{ color: '#888' }}>รออนุมัติ</div>
                </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', background: '#ffca28', borderRadius: '2px' }}></div>
                <span style={{ color: '#ffca28' }}>รออนุมัติ ({chartData.pending})</span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '12px', height: '12px', background: '#333', borderRadius: '2px' }}></div>
                <span style={{ color: '#888' }}>อนุมัติแล้ว ({chartData.approved})</span>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}