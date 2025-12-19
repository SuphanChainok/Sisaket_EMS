'use client';

import { useState, useEffect } from 'react';
import { Center } from '@/types';
import Header from '@/components/layout/Header';
import '@/styles/table.css';

export default function CentersPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchCenters();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [centers, searchText, statusFilter, typeFilter]);

  const fetchCenters = async () => {
    try {
      const res = await fetch('/api/centers');
      const data = await res.json();
      setCenters(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...centers];

    // Filter by search text
    if (searchText) {
      const keyword = searchText.toLowerCase().trim();
      results = results.filter(center => 
        center.name?.toLowerCase().includes(keyword) ||
        center.location?.toLowerCase().includes(keyword) ||
        center.contact?.toLowerCase().includes(keyword)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      results = results.filter(center => center.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      results = results.filter(center => center.type === typeFilter);
    }

    setFilteredCenters(results);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบศูนย์นี้?')) return;
    
    try {
      const res = await fetch(`/api/centers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('ลบสำเร็จ');
        fetchCenters();
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาด');
    }
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        const res = await fetch('/api/centers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData),
        });

        if (res.ok) {
          alert('นำเข้าข้อมูลสำเร็จ');
          fetchCenters();
        } else {
          alert('เกิดข้อผิดพลาด');
        }
      } catch (error) {
        alert('ไฟล์ JSON ไม่ถูกต้อง');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Get unique types for filter
  const uniqueTypes = Array.from(new Set(centers.map(c => c.type)));

  // Pagination calculations
  const totalPages = Math.ceil(filteredCenters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCenters = filteredCenters.slice(startIndex, endIndex);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="page-container">
      <Header 
        title="จัดการศูนย์พักพิง" 
        subtitle={`ทั้งหมด ${centers.length} ศูนย์`}
      />

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="ค้นหา (ชื่อศูนย์, สถานที่, รายละเอียด)"
              className="search-input-table"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">สถานะความพร้อมทั้งหมด</option>
            <option value="active">รองรับได้</option>
            <option value="inactive">เต็ม/ปิด</option>
          </select>

          <select 
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">เลือกอำเภอ</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <button className="btn-search">
            <span>🔍</span> ค้นหา
          </button>

          <button className="btn-reset" onClick={() => {
            setSearchText('');
            setStatusFilter('all');
            setTypeFilter('all');
          }}>
            ↻
          </button>
        </div>

        <label className="btn-import">
          <input 
            type="file" 
            accept=".json" 
            style={{ display: 'none' }} 
            onChange={handleImportJSON} 
          />
          + เพิ่มศูนย์ใหม่
        </label>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <span className="results-text">
          จำนวนศูนย์พักพิงที่พบ: <strong className="results-count">{filteredCenters.length}</strong> รายการ
        </span>
        <span className="results-page">หน้า {currentPage} จาก {totalPages}</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-container">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ชื่อศูนย์ / สถานที่</th>
                <th>ตำบล / อำเภอ</th>
                <th>เบอร์โทรติดต่อ</th>
                <th>ความจุ</th>
                <th>สถานะความพร้อม</th>
                <th>วันที่สร้าง</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {currentCenters.map((center) => (
                <tr key={center._id}>
                  <td>
                    <div className="center-name">
                      <strong>{center.name}</strong>
                      <div className="center-location">
                        📍 {center.location}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="center-type">
                      📍 {center.type}
                    </div>
                  </td>
                  <td className="center-contact">{center.contact}</td>
                  <td className="center-capacity">
                    <strong>{center.population.toLocaleString()}</strong>
                  </td>
                  <td>
                    <span className={`status-badge ${center.status}`}>
                      {center.status === 'active' ? 'รองรับได้' : 'เต็ม/ปิด'}
                    </span>
                  </td>
                  <td className="center-date">
                    {new Date().toLocaleDateString('th-TH')}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action btn-edit" title="แก้ไข">
                        ✏️
                      </button>
                      <button 
                        className="btn-action btn-delete" 
                        title="ลบ"
                        onClick={() => handleDelete(center._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCenters.length === 0 && (
            <div className="no-results">
              ❌ ไม่พบข้อมูลศูนย์พักพิงที่ค้นหา
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredCenters.length > 0 && (
        <div className="pagination-container">
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            ‹‹
          </button>
          
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
            ) : (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page as number)}
              >
                {page}
              </button>
            )
          ))}

          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>

          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            ››
          </button>
        </div>
      )}
    </div>
  );
}