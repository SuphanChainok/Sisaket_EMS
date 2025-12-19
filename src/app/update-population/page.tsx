'use client';

import { useState, useEffect } from 'react';
import { Center } from '@/types';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import '@/styles/components.css';

export default function UpdatePopulationPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [population, setPopulation] = useState<number>(0);
  
  useEffect(() => {
    fetch('/api/centers').then(res => res.json()).then(setCenters);
  }, []);

  const handleUpdate = async () => {
    if(!selectedCenter) return alert('เลือกศูนย์ก่อนครับ');

    // ส่งค่าไปอัปเดตที่ Database ทันที
    const res = await fetch('/api/centers/update-pop', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ centerId: selectedCenter, population })
    });

    if(res.ok) alert('✅ อัปเดตยอดคนเรียบร้อยแล้ว');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
        <h2 style={{ color: '#26c6da', textAlign: 'center' }}>👥 อัปเดตยอดผู้อพยพ</h2>
        
        <Card>
            <label>เลือกศูนย์:</label>
            <select className="input-base" onChange={e => setSelectedCenter(e.target.value)}>
                <option value="">-- เลือกศูนย์ --</option>
                {centers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
        </Card>

        <Card>
            <label>จำนวนคนปัจจุบัน (คน):</label>
            <input 
                type="number" 
                className="input-base" 
                style={{ fontSize: '2rem', textAlign: 'center', color: '#26c6da' }}
                onChange={e => setPopulation(parseInt(e.target.value))}
            />
            <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '10px' }}>
                * กรอกเฉพาะยอดรวมเพื่อใช้คำนวณอาหารและของใช้
            </p>
        </Card>

        <Button variant="primary" style={{ width: '100%', padding: '15px' }} onClick={handleUpdate}>
            บันทึกยอดล่าสุด
        </Button>
    </div>
  );
}