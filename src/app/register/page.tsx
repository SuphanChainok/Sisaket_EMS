'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/auth.css'; // ใช้ CSS ธีมเดิม

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          role: 'staff' // ค่าเริ่มต้นให้เป็น staff (ถ้าอยากได้ admin ให้แก้ตรงนี้ หรือไปแก้ใน DB ทีหลัง)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'สมัครสมาชิกไม่สำเร็จ');
      }

      alert('✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      router.push('/login'); // เด้งไปหน้า Login

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📝</div>
          <h1 className="auth-title">สมัครสมาชิก</h1>
          <p className="auth-subtitle">สำหรับเจ้าหน้าที่ใหม่</p>
        </div>

        {error && (
          <div style={{ 
            background: '#ffebee', color: '#c62828', padding: '10px', 
            borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>ชื่อ-นามสกุล (Display Name)</label>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="เช่น สมชาย ใจดี" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>ชื่อผู้ใช้งาน (Username)</label>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="ตั้งชื่อผู้ใช้ภาษาอังกฤษ" 
              required 
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              className="auth-input" 
              placeholder="ตั้งรหัสผ่าน" 
              required 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '⏳ กำลังบันทึก...' : 'ยืนยันการสมัคร'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link href="/login" style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'none' }}>
            มีบัญชีอยู่แล้ว? <b>เข้าสู่ระบบ</b>
          </Link>
        </div>
      </div>
    </div>
  );
}