'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function Home() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    improvement: '',
    decline: '',
    targetRole: '',
    circleRole: '',
    monova: '',
    remarks: ''
  });

  const gradeOptions = [
    "সিনিয়র এক্সিকিউটিভ", "মিড লেভেল ম্যানেজার", "টিম লিডার", "কো-অর্ডিনেটর", "প্রধান সংগঠক",
    "কৌশলগত উপদেষ্টা", "অপারেশনস হেড", "ফিল্ড সুপারভাইজার", "রিসোর্স পার্সন", "নির্বাহী সদস্য",
    "ট্রেইনি লিড", "সেক্টর প্রধান", "প্রকল্প সমন্বয়ক", "সাংগঠনিক সম্পাদক"
  ];

  const targetRoleOptions = [
    "ক্ষেত্র সমীক্ষক", "গেট ম্যানেজার", "কমিউনিটি এনগেজমেন্ট লিড", "প্রশিক্ষণ কো-অর্ডিনেটর",
    "ডাটা অ্যানালিস্ট", "টিম বিল্ডার", "ইভেন্ট ম্যানেজার", "যোগাযোগ বিশেষজ্ঞ", "নিরাপত্তা সমন্বয়ক",
    "তথ্য সংগ্রহকারী", "সাপ্লাই চেইন লিড", "মনিটরিং অফিসার", "সাংগঠনিক টার্গেট লিডার"
  ];

  const circleRoleOptions = [
    "উত্তর সার্কেল লিড", "দক্ষিণ সার্কেল সমন্বয়ক", "পূর্ব সার্কেল হেড", "পশ্চিম সার্কেল কোর",
    "সেন্ট্রাল সার্কেল মডারেটর", "মহিলা নেতৃত্ব সার্কেল", "যুব সার্কেল অ্যাম্বাসেডর", "প্রশাসনিক সার্কেল",
    "গুরুত্বপূর্ণ টাস্ক ফোর্স", "প্রশিক্ষণ সার্কেল কোচ", "ফাস্ট রেসপন্স সার্কেল"
  ];

  const monovaOptions = [
    "উচ্চ প্রেরণা", "স্থিতিস্থাপক", "উদ্যোগী", "সহযোগিতাপরায়ণ", "কৌশলী মস্তিষ্ক",
    "টিম প্লেয়ার", "লিডারশিপ মানসিকতা", "বিশ্লেষণধর্মী", "সৃজনশীল সংগঠক", "শৃঙ্খলাবদ্ধ যোদ্ধা"
  ];

  const fetchMembers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/members?page=${page}&limit=10`);
      const data = await response.json();
      
      if (response.ok) {
        setMembers(data.members);
        setCurrentPage(data.pagination.page);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingMember ? `/api/members/${editingMember._id}` : '/api/members';
      const method = editingMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          improvement: Number(formData.improvement),
          decline: Number(formData.decline)
        }),
      });

      if (response.ok) {
        fetchMembers(currentPage);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      grade: member.grade,
      improvement: member.improvement,
      decline: member.decline,
      targetRole: member.targetRole,
      circleRole: member.circleRole,
      monova: member.monova,
      remarks: member.remarks
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('আপনি কি নিশ্চিত যে আপনি এই সদস্যকে মুছে ফেলতে চান?')) {
      try {
        const response = await fetch(`/api/members/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchMembers(currentPage);
        }
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      grade: '',
      improvement: '',
      decline: '',
      targetRole: '',
      circleRole: '',
      monova: '',
      remarks: ''
    });
    setEditingMember(null);
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="dashboard-wrapper">
      <div className="header-section">
        <div className="title-row">
          <h1>
            📊 সাংগঠনিক রোল & টার্গেট রিপোর্ট 
            <small>উন্নতি-অবনতি বিশ্লেষণ</small>
          </h1>
          <div className="stats-badge">
            👥 মোট সদস্য: {members.length} জন
          </div>
        </div>
        <div className="sub-header">
          🔹 রোল ভিত্তিক মূল্যায়ন | কে কে টার্গেটে নিয়েছে তার রোল | সার্কেল রোল | মনোভা ও মন্তব্য সংবলিত প্রতিবেদন
        </div>
      </div>

      <div style={{ padding: '20px', background: '#f8fafd' }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '10px 20px',
            background: '#0a2f44',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        >
          {showAddForm ? 'ফর্ম বন্ধ করুন' : 'নতুন সদস্য যোগ করুন'}
        </button>

        {showAddForm && (
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#0a2f44' }}>
              {editingMember ? 'সদস্য সম্পাদনা করুন' : 'নতুন সদস্য যোগ করুন'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="নাম"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">মান নির্বাচন করুন</option>
                  {gradeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>

                <input
                  type="number"
                  name="improvement"
                  placeholder="উন্নতি %"
                  value={formData.improvement}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                  style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />

                <input
                  type="number"
                  name="decline"
                  placeholder="অবনতি %"
                  value={formData.decline}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                  style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />

                <select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">টার্গেট রোল নির্বাচন করুন</option>
                  {targetRoleOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>

                <select
                  name="circleRole"
                  value={formData.circleRole}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">সার্কেল রোল নির্বাচন করুন</option>
                  {circleRoleOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>

                <select
                  name="monova"
                  value={formData.monova}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">মনোভা নির্বাচন করুন</option>
                  {monovaOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>

                <input
                  type="text"
                  name="remarks"
                  placeholder="মন্তব্য"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: '#0a2f44',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {editingMember ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '10px 20px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  বাতিল করুন
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="table-responsive">
        <table className="performance-table">
          <thead>
            <tr>
              <th>ক্রমিক</th>
              <th>নাম</th>
              <th>মান<br/>(পদ/মান)</th>
              <th>উন্নতি %</th>
              <th>অবনতি %</th>
              <th>কে কে টার্গেটে নিয়েছে তার রোল</th>
              <th>সার্কেল রোল</th>
              <th>মনোভা</th>
              <th>মন্তব্য</th>
              <th>কার্য</th>
            </tr>
            <tr style={{background: '#eef3fc;'}}>
              <th colSpan="10" style={{textAlign: 'left', fontWeight: 'normal', fontSize: '0.68rem', padding: '6px 12px;'}}>
                📌 সাংগঠনিক কাঠামো অনুযায়ী প্রতিটি কর্মীর রোল, টার্গেট অ্যাসাইনমেন্ট ও সার্কেল রোল নির্ধারিত হয়েছে
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                  লোড হচ্ছে...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                  কোন ডেটা পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              members.map((member, index) => (
                <tr key={member._id}>
                  <td className="serial-cell">
                    {String((currentPage - 1) * 10 + index + 1).padStart(2, '0')}
                  </td>
                  <td>{member.name}</td>
                  <td style={{fontWeight: '500', background: '#f0f5fa', borderRadius: '20px'}}>
                    {member.grade}
                  </td>
                  <td>
                    <span className="progress-up">📈 {member.improvement}%</span>
                  </td>
                  <td>
                    <span className="progress-down">📉 {member.decline}%</span>
                  </td>
                  <td>
                    <span className="target-badge" style={{fontSize: '0.75rem'}}>
                      🎯 {member.targetRole}
                    </span>
                  </td>
                  <td>
                    <span className="circle-role">🔄 {member.circleRole}</span>
                  </td>
                  <td>
                    <span className="monova-tag">🧠 {member.monova}</span>
                  </td>
                  <td>
                    <div className="comment-text">💬 {member.remarks}</div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(member)}
                      style={{
                        padding: '4px 8px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginRight: '5px'
                      }}
                    >
                      সম্পাদনা
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      style={{
                        padding: '4px 8px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      মুছুন
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => fetchMembers(page)}
              style={{
                margin: '0 5px',
                padding: '8px 12px',
                background: currentPage === page ? '#0a2f44' : '#f8fafd',
                color: currentPage === page ? 'white' : '#0a2f44',
                border: '1px solid #0a2f44',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <div className="footer-meta">
        <span>✅ প্রতিটি সদস্যের জন্য টার্গেট রোল, সার্কেল দায়িত্ব ও মনোভা (মেন্টালিটি) সংযোজিত হয়েছে।</span>
        <span>📈 উন্নতি% ও অবনতি% সাম্প্রতিক মূল্যায়ন সূচক অনুযায়ী নির্ধারিত।</span>
      </div>
    </div>
  );
}
