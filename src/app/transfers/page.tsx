'use client';

import { useState, useEffect } from 'react';
import { TransferRequest } from '@/types'; // ใช้ Type กลาง
import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import CreateTransferModal from '@/components/transfers/CreateTransferModal';
import '@/styles/dashboard.css'; // ใช้ CSS ของตาราง (data-table)

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // โหลดข้อมูล
  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transfers');
      const data = await res.json();
      setTransfers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันอนุมัติ
  const handleApprove = async (id: string) => {
    if(!confirm('ยืนยันการอนุมัติและตัดสต็อก?')) return;
    
    try {
      const res = await fetch('/api/transfers/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transferId: id }),
      });
      const result = await res.json();
      
      if (res.ok) {
          alert('✅ อนุมัติและตัดสต็อกเรียบร้อย');
          fetchTransfers(); // โหลดข้อมูลใหม่
      } else {
          alert('❌ ผิดพลาด: ' + result.error);
      }
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  return (
    <div>
      {/* 1. ส่วนหัวและปุ่มสร้าง */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Header 
          title="🚚 รายการเบิกจ่ายสินค้า (Stock Transfers)" 
          subtitle="จัดการคำร้องขอเบิกสินค้าจากศูนย์พักพิงต่างๆ"
        />
        <Button variant="warning" onClick={() => setShowModal(true)}>
          + สร้างใบเบิกสินค้า
        </Button>
      </div>

      {/* 2. Modal สร้างใบเบิก (แสดงเมื่อ showModal = true) */}
      {showModal && (
        <CreateTransferModal 
          onClose={() => setShowModal(false)} 
          onSuccess={fetchTransfers} 
        />
      )}

      {/* 3. ตารางข้อมูล */}
      <Card>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>⏳ กำลังโหลดรายการ...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>วันที่/เวลา</th>
                  <th>ศูนย์ที่ขอเบิก</th>
                  <th>รายการสินค้า</th>
                  <th>สถานะ</th>
                  <th style={{ textAlign: 'right' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t) => (
                  <tr key={t._id}>
                    {/* วันที่ */}
                    <td style={{ color: '#aaa', fontSize: '0.9rem' }}>
                      {new Date(t.createdAt).toLocaleDateString('th-TH', {
                        day: 'numeric', month: 'short', year: '2-digit',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    
                    {/* ชื่อศูนย์ */}
                    <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      {t.centerName}
                    </td>

                    {/* รายการของ */}
                    <td>
                      {t.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                          <span style={{ color: '#ccc' }}>• {item.productName}</span> 
                          <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', marginLeft: '6px' }}>
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </td>

                    {/* สถานะ (Badge) */}
                    <td>
                      <Badge status={t.status} />
                    </td>

                    {/* ปุ่ม Action */}
                    <td style={{ textAlign: 'right' }}>
                      {t.status === 'pending' && (
                        <Button 
                          variant="success" 
                          style={{ padding: '5px 10px', fontSize: '0.85rem' }}
                          onClick={() => handleApprove(t._id)}
                        >
                          ✔ อนุมัติ
                        </Button>
                      )}
                      {/* เพิ่มปุ่มดูรายละเอียดได้ในอนาคต */}
                    </td>
                  </tr>
                ))}

                {transfers.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      🚫 ไม่พบรายการเบิกจ่าย
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}