'use client';

import { useState, useEffect } from 'react';
import { Center, Product } from '@/types';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import '@/styles/components.css';

export default function RequestPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Form State
  const [selectedCenter, setSelectedCenter] = useState('');
  const [requestItems, setRequestItems] = useState([{ productId: '', qty: 1 }]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // โหลดรายชื่อศูนย์และสินค้า
    fetch('/api/centers').then(res => res.json()).then(setCenters);
    fetch('/api/products').then(res => res.json()).then(setProducts);
  }, []);

  const handleSubmit = async () => {
    if (!selectedCenter) return alert('กรุณาระบุศูนย์ของท่าน');
    
    // กรองข้อมูลสินค้า
    const validItems = requestItems.filter(i => i.productId && i.qty > 0).map(i => {
       const p = products.find(prod => prod._id === i.productId);
       return { 
         productId: i.productId, 
         productName: p?.name || 'Unknown', 
         quantity: i.qty 
       };
    });

    if(validItems.length === 0) return alert('ระบุสินค้าอย่างน้อย 1 อย่าง');

    // ส่งคำร้องไปที่ Server
    const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            centerId: selectedCenter,
            centerName: centers.find(c => c._id === selectedCenter)?.name,
            items: validItems,
            status: 'pending' // สถานะรอแอดมินอนุมัติ
        })
    });

    if(res.ok) setSubmitted(true);
    else alert('ส่งข้อมูลไม่สำเร็จ');
  };

  if (submitted) {
    return (
        <div style={{ padding: 40, textAlign: 'center', backgroundColor: '#1e2124', height: '100vh', color: 'white' }}>
            <h1 style={{ color: '#00e676', fontSize: '3rem' }}>✅ ส่งคำร้องแล้ว</h1>
            <p>กรุณารอการอนุมัติจากส่วนกลาง</p>
            <Button onClick={() => window.location.reload()} variant="primary">ส่งคำร้องเพิ่ม</Button>
        </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <h2 style={{ color: '#ffca28', textAlign: 'center' }}>🆘 แจ้งขอความช่วยเหลือ</h2>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '20px' }}>สำหรับหัวหน้าศูนย์พักพิง</p>

      <Card>
        <label style={{ display: 'block', marginBottom: '10px' }}>1. เลือกศูนย์ของท่าน</label>
        <select 
            className="input-base" 
            value={selectedCenter} 
            onChange={e => setSelectedCenter(e.target.value)}
            style={{ padding: '15px', fontSize: '1.1rem' }}
        >
            <option value="">-- ค้นหาชื่อศูนย์ --</option>
            {centers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </Card>

      <Card>
        <label style={{ display: 'block', marginBottom: '10px' }}>2. สิ่งของที่ขาดแคลน</label>
        {requestItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select 
                    className="input-base" 
                    value={item.productId}
                    onChange={e => {
                        const newItems = [...requestItems];
                        newItems[idx].productId = e.target.value;
                        setRequestItems(newItems);
                    }}
                >
                    <option value="">เลือกสินค้า...</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                <input 
                    type="number" 
                    className="input-base" 
                    style={{ width: '80px' }} 
                    value={item.qty}
                    onChange={e => {
                        const newItems = [...requestItems];
                        newItems[idx].qty = parseInt(e.target.value);
                        setRequestItems(newItems);
                    }}
                />
            </div>
        ))}
        <Button variant="ghost" onClick={() => setRequestItems([...requestItems, { productId: '', qty: 1 }])}>
            + เพิ่มรายการ
        </Button>
      </Card>

      <Button variant="warning" style={{ width: '100%', padding: '15px', fontSize: '1.2rem' }} onClick={handleSubmit}>
        🚀 ยืนยันส่งคำร้อง
      </Button>
    </div>
  );
}