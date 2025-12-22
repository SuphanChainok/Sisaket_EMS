'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import '@/styles/table.css';

interface Product {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minLevel: number;
  location: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('all');
  
  // State สำหรับ Modal และ Form
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'food',
    quantity: 0,
    unit: 'ชิ้น',
    minLevel: 10,
    location: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const res = await fetch('/api/inventory');
    const data = await res.json();
    setProducts(data);
  };

  const getStockStatus = (qty: number, min: number) => {
    if (qty === 0) return { label: 'หมดสต็อก', class: 'inactive' };
    if (qty <= min) return { label: 'ต้องเติมด่วน', class: 'inactive' };
    if (qty <= min * 1.5) return { label: 'เริ่มน้อย', class: 'active' };
    return { label: 'ปกติ', class: 'active' };
  };

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  // ฟังก์ชันปรับยอด (+/-)
  const updateStock = async (product: Product, change: number) => {
    const newQty = Math.max(0, product.quantity + change);
    const updatedList = products.map(p => p._id === product._id ? { ...p, quantity: newQty } : p);
    setProducts(updatedList);

    await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: product._id, quantity: newQty })
    });
  };

  // ฟังก์ชันสร้างสินค้าใหม่ (Create)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // ส่งข้อมูลไปสร้างใหม่ (ไม่มี _id)
      });

      if (!res.ok) throw new Error('Failed to create');

      alert('✅ เพิ่มสินค้าเรียบร้อย');
      setShowModal(false); // ปิด Modal
      setFormData({ name: '', category: 'food', quantity: 0, unit: 'ชิ้น', minLevel: 10, location: '' }); // ล้างค่า
      fetchInventory(); // โหลดข้อมูลใหม่
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="page-container">
      <Header 
        title=" คลังสินค้าและเวชภัณฑ์" 
        subtitle={`รายการพัสดุทั้งหมด ${products.length} รายการ`} 
      />

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <div className="search-box">
             <span className="search-icon">🔍</span>
             <input type="text" className="search-input-table" placeholder="ค้นหาพัสดุ..." />
          </div>
          <select 
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">หมวดหมู่ทั้งหมด</option>
            <option value="food">อาหารและน้ำดื่ม</option>
            <option value="medicine">ยาและเวชภัณฑ์</option>
            <option value="equipment">อุปกรณ์กู้ภัย</option>
            <option value="clothing">เครื่องนุ่งห่ม</option>
          </select>
        </div>
        {/* ✅ เปลี่ยน onClick ให้เปิด Modal */}
        <button className="btn-import" onClick={() => setShowModal(true)}>
           + เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* Inventory Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ชื่อรายการ</th>
              <th>หมวดหมู่</th>
              <th>สถานที่จัดเก็บ</th>
              <th>คงเหลือ</th>
              <th>สถานะ</th>
              <th>ปรับยอดด่วน</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item) => {
              const status = getStockStatus(item.quantity, item.minLevel);
              return (
                <tr key={item._id}>
                  <td>
                    <div className="center-name">
                      <strong>{item.name}</strong>
                      <div className="center-location">Min: {item.minLevel} {item.unit}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                      background: 'var(--hover-color)', color: 'var(--text-secondary)'
                    }}>
                      {item.category === 'food' ? ' อาหาร' : 
                       item.category === 'medicine' ? ' ยา' : 
                       item.category === 'equipment' ? ' อุปกรณ์' : ' อื่นๆ'}
                    </span>
                  </td>
                  <td className="center-location"> {item.location}</td>
                  <td className="center-capacity" style={{ fontSize: '1.1rem' }}>
                    {item.quantity.toLocaleString()} {item.unit}
                  </td>
                  <td>
                    <span className={`status-badge ${status.class}`}>
                      {status.label}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => updateStock(item, -10)} className="btn-action btn-delete" title="ลด (-10)">-</button>
                      <button onClick={() => updateStock(item, 10)} className="btn-action btn-edit" title="เพิ่ม (+10)">+</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {products.length === 0 && (
           <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              ยังไม่มีสินค้าในระบบ กรุณากดปุ่มเพิ่มสินค้าใหม่
           </div>
        )}
      </div>

      {/* 🟢 MODAL: หน้าต่างเพิ่มสินค้า (ส่วนที่เพิ่มเข้ามา) */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--bg-card)', padding: '30px', borderRadius: '16px',
            width: '100%', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>เพิ่มสินค้าใหม่เข้าคลัง</h2>
            
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>ชื่อสินค้า</label>
                <input 
                  type="text" required className="search-input-table" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="เช่น ปลากระป๋อง, ยาแก้ปวด..."
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>หมวดหมู่</label>
                <select 
                  className="search-input-table"
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="food">อาหารและน้ำดื่ม</option>
                  <option value="medicine">ยาและเวชภัณฑ์</option>
                  <option value="equipment">อุปกรณ์กู้ภัย</option>
                  <option value="clothing">เครื่องนุ่งห่ม</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>จำนวนเริ่มต้น</label>
                  <input 
                    type="number" required className="search-input-table"
                    value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>หน่วยนับ</label>
                  <input 
                    type="text" required className="search-input-table"
                    value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}
                    placeholder="เช่น ชิ้น, กล่อง, แพ็ค"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>จุดแจ้งเตือนขั้นต่ำ</label>
                  <input 
                    type="number" required className="search-input-table"
                    value={formData.minLevel} onChange={e => setFormData({...formData, minLevel: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>สถานที่เก็บ</label>
                  <input 
                    type="text" className="search-input-table"
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="เช่น โซน A, ตู้ยา 1"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="btn-import"
                  style={{ flex: 1 }}
                >
                  บันทึกสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}