'use client';

import { useState } from 'react';
// import { useTheme } from '@/context/ThemeContext'; // ❌ ไม่ต้องใช้แล้วเพราะลบปุ่มออก
import '@/styles/layout.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  onSearch?: (text: string) => void;
}

export default function Header({ title, subtitle, showSearch = false, onSearch }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  // const { theme, toggleTheme } = useTheme(); // ❌ ลบออก

  return (
    <header className="page-header">
      {/* ฝั่งซ้าย: หัวข้อ */}
      <div className="header-content">
        <div className="header-title-section">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        
        {/* ฝั่งขวา: เครื่องมือต่างๆ */}
        <div className="header-actions">
          
          {/* 1. ช่องค้นหา */}
          {showSearch && (
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="ค้นหาข้อมูล..." 
                className="search-input"
                onChange={(e) => onSearch && onSearch(e.target.value)}
              />
            </div>
          )}

          {/* (ลบปุ่มสลับโหมดออกไปแล้ว) */}

          {/* 2. ปุ่มกระดิ่งแจ้งเตือน */}
          <div className="notification-wrapper">
            <button 
              className={`notification-button ${showNotifications ? 'active' : ''}`}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="notification-icon">🔔</span>
              <span className="notification-badge"></span>
            </button>
            
            {/* Dropdown แจ้งเตือน */}
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>การแจ้งเตือน</h3>
                  <span className="notification-count-badge">3</span>
                </div>
                <div className="notification-list">
                  <div className="notification-item unread">
                    <div className="notification-icon-box warn">📦</div>
                    <div className="notification-text">
                      <p className="notif-title">คลังสินค้าใกล้หมด</p>
                      <p className="notif-time">5 นาทีที่แล้ว</p>
                    </div>
                  </div>
                  <div className="notification-item unread">
                    <div className="notification-icon-box danger">🆘</div>
                    <div className="notification-text">
                      <p className="notif-title">คำขอความช่วยเหลือใหม่</p>
                      <p className="notif-time">15 นาทีที่แล้ว</p>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon-box success">✅</div>
                    <div className="notification-text">
                      <p className="notif-title">การโอนสำเร็จ</p>
                      <p className="notif-time">1 ชั่วโมงที่แล้ว</p>
                    </div>
                  </div>
                </div>
                <button className="notification-view-all">ดูทั้งหมด</button>
              </div>
            )}
          </div>

          {/* 3. User Profile */}
          <div className="user-profile">
            <div className="user-info">
              <div className="user-name">Admin Officer</div>
              <div className="user-status">
                <span className="status-indicator"></span>
                <span className="status-text">ออนไลน์</span>
              </div>
            </div>
            <div className="user-avatar">AD</div>
          </div>
        </div>
      </div>
    </header>
  );
}