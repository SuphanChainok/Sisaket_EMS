'use client';

import { useEffect, useState } from 'react';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import StockLevel from './StockLevel';
import { Product } from '@/types';

export default function InventoryTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);
  const fetchProducts = async () => {
    setLoading(true);
    try { const res = await fetch('/api/products'); const data = await res.json(); setProducts(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {loading ? <div style={{ padding: 20 }}>กำลังโหลดข้อมูล...</div> : (
        <Table>
          <thead>
            <tr>
              <th>สินค้า</th>
              <th>หมวด</th>
              <th>คงเหลือ</th>
              <th>ระดับเตือน</th>
              <th style={{ textAlign: 'right' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.quantity} {p.unit}</td>
                <td style={{ width: 220 }}>
                  <StockLevel quantity={p.quantity} minAlert={p.minAlert} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Button variant="ghost">แก้ไข</Button>
                  <Button variant="danger" style={{ marginLeft: 8 }}>ลบ</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
