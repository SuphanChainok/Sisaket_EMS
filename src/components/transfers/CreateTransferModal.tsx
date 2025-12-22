'use client';

import { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTransferModal({ onClose, onSuccess }: Props) {
  // State สำหรับเก็บข้อมูล
  const [centers, setCenters] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  // State ของฟอร์ม
  const [selectedCenter, setSelectedCenter] = useState('');
  const [items, setItems] = useState([{ productId: '', qty: 1 }]);
  const [loading, setLoading] = useState(false);

  // 1. โหลดข้อมูลศูนย์และสินค้า เมื่อเปิดหน้าต่าง
  useEffect(() => {
    const fetchData = async () => {
      const [resCenters, resProducts] = await Promise.all([
        fetch('/api/centers'),
        fetch('/api/products')
      ]);
      setCenters(await resCenters.json());
      setProducts(await resProducts.json());
    };
    fetchData();
  }, []);

  // เพิ่มแถวรายการสินค้า
  const addItem = () => {
    setItems([...items, { productId: '', qty: 1 }]);
  };

  // ลบแถวรายการสินค้า
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // อัปเดตค่าในรายการสินค้า
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // ส่งข้อมูล (Submit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCenter) return alert('กรุณาเลือกศูนย์');

    // กรองสินค้าที่ไม่ได้เลือกออก
    const validItems = items.filter(i => i.productId && i.qty > 0).map(i => {
      const product = products.find(p => p._id === i.productId);
      return {
        productId: i.productId,
        productName: product?.name || 'Unknown', // ส่งชื่อไปด้วย
        quantity: i.qty
      };
    });

    if (validItems.length === 0) return alert('กรุณาเลือกสินค้าอย่างน้อย 1 รายการ');

    setLoading(true);
    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          centerId: selectedCenter,
          centerName: centers.find(c => c._id === selectedCenter)?.name,
          items: validItems
        }),
      });

      if (res.ok) {
        alert('✅ สร้างใบเบิกสำเร็จ');
        onSuccess(); // แจ้งหน้าหลักให้รีโหลด
        onClose();   // ปิดหน้าต่าง
      } else {
        alert('❌ สร้างใบเบิกไม่สำเร็จ');
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'var(--accent-purple)' }}>📝 สร้างใบเบิกสินค้าใหม่</h2>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* เลือกศูนย์ */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>เลือกศูนย์ที่ต้องการเบิก:</label>
            <select 
              style={inputStyle} 
              value={selectedCenter} 
              onChange={e => setSelectedCenter(e.target.value)}
              required
            >
              <option value="">-- กรุณาเลือกศูนย์ --</option>
              {centers.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* รายการสินค้า */}
          <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
            <label style={labelStyle}>รายการสินค้า:</label>
            {items.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select 
                  style={{ ...inputStyle, flex: 2 }}
                  value={item.productId}
                  onChange={e => updateItem(index, 'productId', e.target.value)}
                  required
                >
                  <option value="">-- เลือกสินค้า --</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} (คงเหลือ: {p.quantity})
                    </option>
                  ))}
                </select>
                <input 
                  type="number" 
                  style={{ ...inputStyle, flex: 1 }} 
                  min="1"
                  value={item.qty}
                  onChange={e => updateItem(index, 'qty', parseInt(e.target.value))}
                />
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} style={deleteButtonStyle}>ลบ</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addItem} style={addButtonStyle}>+ เพิ่มรายการสินค้า</button>
          </div>

          <div style={{ textAlign: 'right', borderTop: '1px solid #444', paddingTop: '15px' }}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>ยกเลิก</button>
            <button type="submit" disabled={loading} style={submitButtonStyle}>
              {loading ? 'กำลังบันทึก...' : 'บันทึกใบเบิก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- CSS Styles (Inline เพื่อความง่าย) ---
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};
const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#1e2124', padding: '30px', borderRadius: '10px', width: '600px', maxWidth: '90%', color: 'white',
  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
};
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '8px', color: '#ccc' };
const inputStyle: React.CSSProperties = { 
  padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2c2f33', color: 'white', width: '100%' 
};
const closeButtonStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' };
const deleteButtonStyle: React.CSSProperties = { backgroundColor: '#ef5350', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: '0 15px' };
const addButtonStyle: React.CSSProperties = { backgroundColor: 'transparent', color: '#26a69a', border: '1px dashed #26a69a', padding: '8px', width: '100%', borderRadius: '5px', cursor: 'pointer' };
const submitButtonStyle: React.CSSProperties = { backgroundColor: '#26a69a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px', fontWeight: 'bold' };
const cancelButtonStyle: React.CSSProperties = { backgroundColor: 'transparent', color: '#ccc', border: 'none', padding: '10px 20px', cursor: 'pointer' };