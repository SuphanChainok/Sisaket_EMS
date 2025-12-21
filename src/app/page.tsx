'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import '@/styles/dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    centers: 0,
    people: 0,
    requests: 0,
    alerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCenters, resPeople, resNotifs] = await Promise.all([
          fetch('/api/centers').then(res => res.json()),
          fetch('/api/beneficiaries').then(res => res.json()),
          fetch('/api/notifications').then(res => res.json())
        ]);

        const centersCount = Array.isArray(resCenters) ? resCenters.length : 0;
        const peopleCount = Array.isArray(resPeople) ? resPeople.length : 0;
        
        const pendingRequests = Array.isArray(resNotifs) 
          ? resNotifs.filter((n: any) => n.type === 'request' && !n.read).length 
          : 0;

        const activeAlerts = Array.isArray(resNotifs)
          ? resNotifs.filter((n: any) => n.type === 'emergency').length
          : 0;

        setStats({
          centers: centersCount,
          people: peopleCount,
          requests: pendingRequests,
          alerts: activeAlerts
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = useMemo(() => {
    // Generate some dummy data for the chart
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
  }, []);

  return (
    <div className="page-container">
      <Header 
        title="ภาพรวมสถานการณ์" 
        subtitle={`อัปเดตล่าสุด: ${new Date().toLocaleTimeString('th-TH')}`} 
      />

      {/* Banner Alert */}
      <div className="alert-banner">
        <div className="alert-icon"></div>
        <div className="alert-content">
          <h3>ภาพรวมสถานการณ์</h3>
          <p>มี <strong>12</strong> ศูนย์ที่ต้องการความช่วยเหลือเร่งด่วน</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Link href="/centers" className="stat-card-link">
          <div className="stat-card bg-purple">
            <div className="stat-icon"></div>
            <div className="stat-info">
              <h4>ศูนย์พักพิงทั้งหมด</h4>
              <div className="stat-number">{loading ? '...' : stats.centers}</div>
              <p className="stat-label">แห่ง</p>
            </div>
          </div>
        </Link>

        <Link href="/beneficiaries" className="stat-card-link">
          <div className="stat-card bg-teal">
            <div className="stat-icon"></div>
            <div className="stat-info">
              <h4>รายการสิ่งของทั้งหมด</h4>
              <div className="stat-number">{loading ? '...' : stats.people}</div>
              <p className="stat-label">รายการ</p>
            </div>
          </div>
        </Link>

        <Link href="/notifications" className="stat-card-link">
          <div className="stat-card bg-red">
            <div className="stat-icon"></div>
            <div className="stat-info">
              <h4>ศูนย์ฉุกเฉิน</h4>
              <div className="stat-number">{loading ? '...' : stats.alerts}</div>
              <p className="stat-label">แห่ง วิกฤติ</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Inventory Section */}
      <div className="inventory-section">
        <h3 className="section-title">สิ่งของที่วิกฤตมากที่สุด</h3>
        
        <div className="inventory-grid">
          <div className="inventory-card critical">
            <div className="inventory-header">
              <div className="inventory-icon"></div>
              <div>
                <h4>น้ำดื่ม</h4>
                <div className="inventory-bar">
                  <div className="inventory-fill critical" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
            <div className="inventory-stats">
              <span className="inventory-amount">150 แก้ว</span>
              <button className="btn-critical">วิกฤติ</button>
            </div>
          </div>

          <div className="inventory-card warning">
            <div className="inventory-header">
              <div className="inventory-icon"></div>
              <div>
                <h4>อาหารแห้ง</h4>
                <div className="inventory-bar">
                  <div className="inventory-fill warning" style={{width: '45%'}}></div>
                </div>
              </div>
            </div>
            <div className="inventory-stats">
              <span className="inventory-amount">250 แก้ว</span>
              <button className="btn-warning">เร่งเติมเกลม</button>
            </div>
          </div>

          <div className="inventory-card normal">
            <div className="inventory-header">
              <div className="inventory-icon"></div>
              <div>
                <h4>อาหารแห้ง</h4>
                <div className="inventory-bar">
                  <div className="inventory-fill normal" style={{width: '80%'}}></div>
                </div>
              </div>
            </div>
            <div className="inventory-stats">
              <span className="inventory-amount">วิกฤติ</span>
              <span style={{color: '#4ade80'}}></span>
            </div>
          </div>

          <div className="inventory-card normal">
            <div className="inventory-header">
              <div className="inventory-icon"></div>
              <div>
                <h4>ยา</h4>
                <div className="inventory-bar">
                  <div className="inventory-fill normal" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
            <div className="inventory-stats">
              <span className="inventory-amount">เร่งเติมเกลม</span>
              <span style={{color: '#4ade80'}}></span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <h3 className="section-title">แนวโน้มข้อมูล</h3>
        <div className="chart-container">
          <SimpleLineChart data={chartData} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-grid">
        <div className="card-box">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon"></span>
              <h3>ดูภาพรวมศูนย์พักพิง</h3>
            </div>
            <button className="btn-view">ดูภาพรวมศูนย์พักพิง ▶</button>
          </div>
        </div>

        <div className="card-box">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon"></span>
              <h3>ดูสต็อคสิ่งของ</h3>
            </div>
            <button className="btn-view">ดูสต็อคสิ่งของ ▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}

type SimpleLineChartProps = {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
};

function SimpleLineChart({ data, labels = [], color = '#6366f1', height = 120 }: SimpleLineChartProps) {
  const w = 600;
  const h = height;
  const max = Math.max(...data, 1);

  const { pathD, areaD, points } = useMemo(() => {
    const pts = data.map((v, i) => {
      const x = (i / Math.max(1, data.length - 1)) * (w - 20) + 10;
      const y = h - (v / max) * (h - 20) - 10;
      return { x, y };
    });

    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const area = `${path} L ${w - 10} ${h - 8} L 10 ${h - 8} Z`;
    return { pathD: path, areaD: area, points: pts };
  }, [data, h, max, w]);

  return (
    <div className="chart-card">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className="simple-line-chart">
        <defs>
          <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaD} fill="url(#chartGrad)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} />
        ))}
      </svg>

      <div className="chart-meta">
        <div className="chart-title">สรุป 7 วัน</div>
        <div className="chart-sub">
          {labels.length ? labels[labels.length - 1] : ''}
        </div>
      </div>
    </div>
  );
}