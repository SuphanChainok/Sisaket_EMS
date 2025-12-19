'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import '@/styles/dashboard.css';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // State สำหรับฟอร์มเพิ่มสินค้า
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 0, unit: 'ชิ้น', category: 'ทั่วไป' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      setProducts(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newProduct)
    });
    if(res.ok) {
        alert('✅ เพิ่มสินค้าเรียบร้อย');
        setShowModal(false);
        setNewProduct({ name: '', quantity: 0, unit: 'ชิ้น', category: 'ทั่วไป' }); // Reset form
        fetchProducts();
    }
  };

  return (
    <div>
      <Header 
        title="📦 คลังสินค้า (Inventory)" 
        subtitle={`รายการสิ่งของสำรองจ่ายทั้งหมด (${products.length} รายการ)`}
        showSearch={true}
        onSearch={(txt) => console.log('Search:', txt)} // เดี๋ยวค่อยทำระบบค้นหาจริง
      />

      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
         <Button variant="primary" onClick={() => setShowModal(true)}>+ เพิ่มสินค้าใหม่</Button>
      </div>

      {/* Modal เพิ่มสินค้า */}
      {showModal && (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
            <div style={{ background: '#1e2124', padding: '30px', borderRadius: '12px', width: '400px', border: '1px solid #333' }}>
                <h2 style={{ margin: '0 0 20px 0' }}>เพิ่มสินค้าใหม่</h2>
                <form onSubmit={handleAddProduct}>
                    <label style={{ display: 'block', marginBottom: '10px' }}>ชื่อสินค้า:</label>
                    <input className="input-base" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="เช่น ข้าวสาร, น้ำดื่ม" />
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label>จำนวน:</label>
                            <input type="number" className="input-base" required value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>หน่วย:</label>
                            <input className="input-base" required value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} placeholder="เช่น ถุง, ขวด" />
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>ยกเลิก</Button>
                        <Button type="submit" variant="success">บันทึก</Button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* ตารางสินค้า */}
      <Card>
        {loading ? <p>กำลังโหลด...</p> : (
            <table className="data-table">
                <thead>
                    <tr>
                        <th>สินค้า</th>
                        <th>หมวดหมู่</th>
                        <th>คงเหลือ</th>
                        <th>สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p._id}>
                            <td style={{ fontWeight: 'bold' }}>{p.name}</td>
                            <td style={{ color: '#888' }}>{p.category}</td>
                            <td style={{ fontSize: '1.1rem' }}>
                                {p.quantity.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#666' }}>{p.unit}</span>
                            </td>
                            <td>
                                {p.quantity <= (p.minAlert || 10) ? (
                                    <Badge status="วิกฤต" type="danger" />
                                ) : (
                                    <Badge status="ปกติ" type="active" />
                                )}
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px' }}>ยังไม่มีสินค้าในคลัง</td></tr>}
                </tbody>
            </table>
        )}
      </Card>
    </div>
  );
}