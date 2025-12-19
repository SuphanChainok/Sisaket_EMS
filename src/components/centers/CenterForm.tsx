'use client';

import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Center } from '@/types';

interface Props {
  initial?: Partial<Center>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CenterForm({ initial = {}, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(initial.name || '');
  const [location, setLocation] = useState(initial.location || '');
  const [type, setType] = useState(initial.type || 'ศูนย์พักพิง');
  const [status, setStatus] = useState<'active'|'inactive'>(initial.status || 'active');
  const [contact, setContact] = useState(initial.contact || '');
  const [population, setPopulation] = useState<number>(initial.population || 0);
  const [capacity, setCapacity] = useState<number>(initial.capacity || 100);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return alert('กรุณาระบุชื่อและที่อยู่');

    setLoading(true);
    try {
      const payload = { name, location, type, status, contact, population, capacity };
      const res = await fetch('/api/centers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert('บันทึกเรียบร้อย');
        onSuccess?.();
      } else {
        const data = await res.json();
        alert('ผิดพลาด: ' + (data?.error || 'ไม่ทราบสาเหตุ'));
      }
    } catch (error) {
      console.error(error);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="ชื่อศูนย์" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="ที่อยู่/อำเภอ" value={location} onChange={(e) => setLocation(e.target.value)} required />
      <Input label="ประเภท" value={type} onChange={(e) => setType(e.target.value)} />
      <Input label="เบอร์ติดต่อ" value={contact} onChange={(e) => setContact(e.target.value)} />
      <div style={{ display: 'flex', gap: 10 }}>
        <Input label="จำนวนผู้อพยพ" type="number" value={String(population)} onChange={(e) => setPopulation(parseInt(e.target.value || '0'))} />
        <Input label="ความจุ" type="number" value={String(capacity)} onChange={(e) => setCapacity(parseInt(e.target.value || '0'))} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
        <Button variant="ghost" type="button" onClick={() => onCancel?.()}>ยกเลิก</Button>
        <Button variant="primary" type="submit" disabled={loading}>{loading ? 'บันทึก...' : 'บันทึก'}</Button>
      </div>
    </form>
  );
}
