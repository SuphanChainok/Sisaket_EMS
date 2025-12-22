'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';

export default function StockAlert() {
  const [alerts, setAlerts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/products');
        const data: Product[] = await res.json();
        setAlerts(data.filter(p => p.quantity <= p.minAlert));
      } catch (err) { console.error(err); }
    };
    fetchAlerts();
  }, []);

  if (alerts.length === 0) return <div style={{ padding: 12, color: '#888' }}>✅ ไม่มีสินค้าที่อยู่ในระดับวิกฤต</div>;

  return (
    <div style={{ padding: 12 }}>
      <h4 style={{ margin: '0 0 8px 0' }}>⚠️ สินค้าเตือนจำนวน ({alerts.length})</h4>
      <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
        {alerts.map(a => (
          <li key={a._id} style={{ marginBottom: 6 }}>{a.name} — คงเหลือ {a.quantity} {a.unit} (เตือนที่ {a.minAlert})</li>
        ))}
      </ul>
    </div>
  );
}
