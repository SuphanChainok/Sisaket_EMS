'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import '@/styles/table.css';

// Type Definitions
interface TransferItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

interface Transfer {
  _id: string;
  docNo: string;
  destination: string;
  items: TransferItem[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Center { _id: string; name: string; }
interface Product { _id: string; name: string; quantity: number; unit: string; }

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);

  // State สำหรับ Modal และ Form
  const [showModal, setShowModal] = useState(false);
  const [centers, setCenters] = useState<Center[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  
  const [formData, setFormData] = useState({
    centerId: '',
    productId: '',
    quantity: 1
  });

  // โหลดข้อมูลทั้งหมด (ใบเบิก, ศูนย์, สินค้า)
  useEffect(() => {
    fetchTransfers();
    fetch('/api/centers').then(res => res.json()).then(setCenters).catch(console.error);
    fetch('/api/inventory').then(res => res.json()).then(setInventory).catch(console.error);
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await fetch('/api/transfers');
      const data = await res.json();
      if (Array.isArray(data)) setTransfers(data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    }
  };

  // ฟังก์ชันส่งใบเบิก (จาก Modal)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. หาข้อมูลศูนย์และสินค้าที่เลือก
      const selectedCenter = centers.find(c => c._id === formData.centerId);
      const selectedProduct = inventory.find(p => p._id === formData.productId);

      if (!selectedCenter || !selectedProduct) {
        alert('ข้อมูลไม่ถูกต้อง กรุณาเลือกใหม่');
        setLoading(false);
        return;
      }

      // 2. เตรียมข้อมูลส่ง API
      const payload = {
        destination: selectedCenter.name,
        centerId: selectedCenter._id,
        centerName: selectedCenter.name,
        items: [{
          productId: selectedProduct._id,
          productName: selectedProduct.name,
          quantity: Number(formData.quantity),
          unit: selectedProduct.unit
        }]
      };

      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('สร้างใบเบิกไม่สำเร็จ');

      alert('✅ สร้างใบเบิกสำเร็จ!');
      setShowModal(false); // ปิด Modal
      setFormData({ centerId: '', productId: '', quantity: 1 }); // รีเซ็ตฟอร์ม
      fetchTransfers(); // อัปเดตตาราง

    } catch (error: any) {
      alert('❌ เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(action === 'approve' ? 'ยืนยันการอนุมัติและตัดสต็อก?' : 'ต้องการปฏิเสธคำขอนี้?')) return;
    try {
      const res = await fetch(`/api/transfers/${id}/${action}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(`✅ ดำเนินการเรียบร้อย`);
      fetchTransfers();
    } catch (error: any) {
      alert(`❌ เกิดข้อผิดพลาด: ${error.message}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="status-badge" style={{background:'#fff3e0', color:'#ef6c00'}}>⏳ รออนุมัติ</span>;
      case 'approved': return <span className="status-badge active" style={{background:'#e8f5e9', color:'#2e7d32'}}>✅ อนุมัติแล้ว</span>;
      case 'rejected': return <span className="status-badge inactive" style={{background:'#ffebee', color:'#c62828'}}>❌ ปฏิเสธ</span>;
      default: return <span>-</span>;
    }
  };

  return (
    <div className="page-container">
      <Header title=" รายการเบิกจ่ายพัสดุ" subtitle="จัดการการขนส่งและกระจายสินค้า" />

      {/* ปุ่มเปิด Modal */}
      <div className="filter-section">
        <div style={{color: 'var(--text-secondary)'}}>รายการเบิกจ่ายล่าสุด</div>
        <button className="btn-import" onClick={() => setShowModal(true)}>
          + สร้างใบเบิก
        </button>
      </div>

      {/* ตารางแสดงข้อมูล */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>เลขที่เอกสาร</th>
              <th>ปลายทาง</th>
              <th>รายการสินค้า</th>
              <th>วันที่ขอ</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t) => (
              <tr key={t._id}>
                <td style={{fontWeight:'bold', color:'var(--accent-purple)'}}>{t.docNo || '-'}</td>
                <td>{t.destination}</td>
                <td>
                  {t.items.map((item, i) => (
                    <div key={i} style={{fontSize:'0.9rem'}}>
                      • {item.productName} ({item.quantity} {item.unit})
                    </div>
                  ))}
                </td>
                <td style={{fontSize:'0.85rem', color:'var(--text-secondary)'}}>
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString('th-TH') : '-'}
                </td>
                <td>{getStatusBadge(t.status)}</td>
                <td>
                  {t.status === 'pending' ? (
                    <div className="action-buttons">
                      <button onClick={() => handleAction(t._id, 'approve')} className="btn-action" title="อนุมัติ" style={{color:'white', background:'#2e7d32', border:'none', width:'32px', height:'32px', borderRadius:'6px', cursor:'pointer', marginRight:'5px'}}>✓</button>
                      <button onClick={() => handleAction(t._id, 'reject')} className="btn-action" title="ปฏิเสธ" style={{color:'white', background:'#c62828', border:'none', width:'32px', height:'32px', borderRadius:'6px', cursor:'pointer'}}>✕</button>
                    </div>
                  ) : (
                    <span style={{fontSize:'0.8rem', color:'#999'}}>ดำเนินการแล้ว</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transfers.length === 0 && <div className="no-results" style={{padding:'40px', textAlign:'center', color:'#888'}}>ไม่มีรายการเบิกจ่าย</div>}
      </div>

      {/* 🟢 MODAL: สร้างใบเบิก */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowModal(false)}>
          
          <div style={{
            background: 'var(--bg-card)', padding: '30px', borderRadius: '16px',
            width: '100%', maxWidth: '500px', border: '1px solid var(--border-color)'
          }} onClick={e => e.stopPropagation()}>
            
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>สร้างใบเบิกพัสดุ</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* เลือกศูนย์ปลายทาง */}
              <div>
                <label style={{marginBottom:'5px', display:'block'}}>ปลายทาง (ศูนย์พักพิง)</label>
                <select 
                  className="search-input-table" 
                  required
                  value={formData.centerId}
                  onChange={(e) => setFormData({...formData, centerId: e.target.value})}
                  style={{width: '100%'}}
                >
                  <option value="">-- เลือกศูนย์พักพิง --</option>
                  {centers.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* เลือกสินค้า */}
              <div>
                <label style={{marginBottom:'5px', display:'block'}}>สินค้าที่จะเบิก</label>
                <select 
                  className="search-input-table" 
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                  style={{width: '100%'}}
                >
                  <option value="">-- เลือกสินค้า --</option>
                  {inventory.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} (คงเหลือ: {p.quantity} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* ระบุจำนวน */}
              <div>
                <label style={{marginBottom:'5px', display:'block'}}>จำนวน</label>
                <input 
                  type="number" 
                  className="search-input-table" 
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                  style={{width: '100%'}}
                />
              </div>

              {/* ปุ่ม Action */}
              <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{flex:1, padding:'10px', borderRadius:'8px', border:'1px solid #ddd', background:'transparent', cursor:'pointer'}}
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="btn-import"
                  style={{flex:1}}
                  disabled={loading}
                >
                  {loading ? 'กำลังบันทึก...' : 'ยืนยันการเบิก'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}