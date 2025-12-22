'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

// Type สำหรับข้อมูลสินค้า
interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minLevel: number;
}

// Type สำหรับข้อมูลประวัติคำขอ (Transfer)
interface TransferRequest {
  _id: string;
  centerName: string;
  status: string;
  requestDate: string;
  items: { productName: string; quantity: number; unit: string }[];
}

export default function StaffDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  
  // State ข้อมูล
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categoryStats, setCategoryStats] = useState<any>({});
  const [criticalItems, setCriticalItems] = useState<InventoryItem[]>([]);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]); // ✅ เพิ่ม State เก็บประวัติ

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // ดึง 2 API: สินค้า (Inventory) และ ประวัติคำขอ (Transfers)
        const [resInventory, resTransfers] = await Promise.all([
          fetch('/api/inventory'),
          fetch('/api/transfers') // ✅ ดึงประวัติมาด้วย
        ]);

        const dataInv = await resInventory.json();
        const dataTransfers = await resTransfers.json();

        // จัดการข้อมูลสินค้า (เหมือนเดิม)
        if (Array.isArray(dataInv)) {
          setItems(dataInv);
          const lowStock = dataInv.filter((i: InventoryItem) => i.quantity <= i.minLevel);
          setCriticalItems(lowStock);

          const stats = { food: 0, medicine: 0, equipment: 0, clothing: 0, other: 0 };
          dataInv.forEach((i: InventoryItem) => {
            if (stats[i.category as keyof typeof stats] !== undefined) {
              stats[i.category as keyof typeof stats] += i.quantity;
            } else {
              stats.other += i.quantity;
            }
          });
          setCategoryStats(stats);
        }

        // จัดการข้อมูลประวัติคำขอ
        if (Array.isArray(dataTransfers)) {
          setTransfers(dataTransfers);
        }

      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'food': return '🍱';
      case 'medicine': return '💊';
      case 'equipment': return '🔦';
      case 'clothing': return '👕';
      default: return '📦';
    }
  };

  const getName = (cat: string) => {
    switch (cat) {
      case 'food': return 'อาหารและน้ำดื่ม';
      case 'medicine': return 'ยาและเวชภัณฑ์';
      case 'equipment': return 'อุปกรณ์กู้ภัย';
      case 'clothing': return 'เครื่องนุ่งห่ม';
      default: return 'อื่นๆ';
    }
  };

  // Helper แปลงสถานะเป็นสีและข้อความ
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { label: '⏳ รออนุมัติ', color: '#f59e0b', bg: '#fffbeb' };
      case 'approved': return { label: '✅ อนุมัติแล้ว', color: '#16a34a', bg: '#f0fdf4' };
      case 'rejected': return { label: '❌ ปฏิเสธ', color: '#dc2626', bg: '#fef2f2' };
      case 'completed': return { label: '🎉 เสร็จสิ้น', color: '#3b82f6', bg: '#eff6ff' };
      default: return { label: status, color: '#666', bg: '#eee' };
    }
  };

  return (
    <div className="page-container">
      <Header 
        title="ภาพรวมคลังสินค้ากลาง" 
        subtitle={`อัปเดตข้อมูลล่าสุด: ${new Date().toLocaleTimeString('th-TH')} น.`} 
      />

      {/* 1. ส่วนแจ้งเตือน (Critical Alert) */}
      {criticalItems.length > 0 && (
        <div style={{ 
          background: '#fee2e2', border: '1px solid #fca5a5', 
          borderRadius: '12px', padding: '20px', marginBottom: '30px',
          display: 'flex', alignItems: 'start', gap: '15px'
        }}>
          <div style={{ fontSize: '2rem', animation: 'pulse 2s infinite' }}>🚨</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#dc2626' }}>แจ้งเตือน: สินค้าขาดแคลน</h3>
            <p style={{ margin: 0, color: '#7f1d1d', fontSize: '0.95rem' }}>
              ขณะนี้มีสินค้า <strong>{criticalItems.length} รายการ</strong> ในคลังกลางที่มีปริมาณต่ำกว่ากำหนด
            </p>
          </div>
        </div>
      )}

      {/* 2. Grid สรุปยอดสินค้า */}
      <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>📊 ปริมาณคงเหลือในคลังกลาง</h3>
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', marginBottom: '40px' 
      }}>
        {['food', 'medicine', 'clothing', 'equipment'].map((cat) => (
          <div key={cat} style={{ 
            background: 'var(--bg-card)', padding: '20px', borderRadius: '16px',
            border: '1px solid var(--border-color)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{getIcon(cat)}</div>
            <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)' }}>{getName(cat)}</h4>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {loading ? '...' : (categoryStats[cat] || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>หน่วยรวม</div>
          </div>
        ))}
      </div>

      {/* 3. ประวัติคำขอเบิกพัสดุ (ส่วนใหม่ที่เพิ่มเข้ามา) */}
      <div style={{ 
        background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', 
        border: '1px solid var(--border-color)', marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>📋 ประวัติคำขอเบิกพัสดุล่าสุด</h3>
          <Link href="/request">
            <button style={{ 
              background: '#ef6c00', color: 'white', border: 'none', padding: '8px 16px', 
              borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
            }}>
              + แจ้งขอเบิกของ
            </button>
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>วันที่ขอ</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>หน่วยงาน/ศูนย์</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>รายการที่ขอ</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {transfers.length > 0 ? (
                transfers.map((req) => {
                  const statusInfo = getStatusBadge(req.status);
                  return (
                    <tr key={req._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                        {new Date(req.requestDate).toLocaleDateString('th-TH', { 
                          day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' 
                        })}
                      </td>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{req.centerName}</td>
                      <td style={{ padding: '12px' }}>
                        {req.items.map((item, i) => (
                          <div key={i} style={{ fontSize: '0.9rem' }}>
                            • {item.productName} ({item.quantity} {item.unit})
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          background: statusInfo.bg, color: statusInfo.color,
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                          display: 'inline-block'
                        }}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    ยังไม่มีรายการคำขอเบิกพัสดุ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}