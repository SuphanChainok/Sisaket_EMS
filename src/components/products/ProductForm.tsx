'use client';

import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Product } from '@/types';

interface Props { initial?: Partial<Product>; onSuccess?: () => void; onCancel?: () => void; }

export default function ProductForm({ initial = {}, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(initial.name || '');
  const [category, setCategory] = useState(initial.category || 'ทั่วไป');
  const [quantity, setQuantity] = useState<number>(initial.quantity || 0);
  const [unit, setUnit] = useState(initial.unit || 'ชิ้น');
  const [minAlert, setMinAlert] = useState<number>(initial.minAlert || 10);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert('กรุณาระบุชื่อสินค้า');
    setLoading(true);
    try {
      const payload = { name, category, quantity, unit, minAlert };
      const res = await fetch('/api/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (res.ok) { alert('บันทึกเรียบร้อย'); onSuccess?.(); }
      else { const data = await res.json(); alert('ผิดพลาด: ' + (data?.error || 'ไม่ทราบสาเหตุ')); }
    } catch (err) { console.error(err); alert('เกิดข้อผิดพลาด'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="ชื่อสินค้า" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="หมวดหมู่" value={category} onChange={(e) => setCategory(e.target.value)} />
      <div style={{ display: 'flex', gap: 10 }}>
        <Input label="จำนวน" type="number" value={String(quantity)} onChange={(e) => setQuantity(parseInt(e.target.value || '0'))} />
        <Input label="หน่วย" value={unit} onChange={(e) => setUnit(e.target.value)} />
      </div>
      <Input label="ระดับเตือนต่ำสุด" type="number" value={String(minAlert)} onChange={(e) => setMinAlert(parseInt(e.target.value || '0'))} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
        <Button variant="ghost" type="button" onClick={() => onCancel?.()}>ยกเลิก</Button>
        <Button variant="primary" type="submit" disabled={loading}>{loading ? 'กำลังบันทึก...' : 'บันทึก'}</Button>
      </div>
    </form>
  );
}
