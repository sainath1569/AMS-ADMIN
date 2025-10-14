// components/dashboards/FacultyDashboard.jsx
import React, { useState } from 'react';

const FacultyDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample Data - Replace with actual API calls later
  const facultyData = {
    totalFaculty: 85,
    branchDistribution: [
      { name: "CSE", value: 15, color: "#8B0000" },
      { name: "ECE", value: 12, color: "#FF6B6B" },
      { name: "EEE", value: 10, color: "#4ECDC4" },
      { name: "MECH", value: 8, color: "#45B7D1" },
      { name: "CIVIL", value: 7, color: "#96CEB4" },
      { name: "CHEM", value: 6, color: "#FFEAA7" },
      { name: "MME", value: 5, color: "#DDA0DD" }
    ],
    yearDistribution: {
      labels: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      datasets: [
        { name: 'CSE', data: [4, 4, 4, 3] },
        { name: 'ECE', data: [3, 3, 3, 3] },
        { name: 'EEE', data: [3, 2, 3, 2] },
        { name: 'MECH', data: [2, 2, 2, 2] },
        { name: 'CIVIL', data: [2, 2, 2, 1] },
        { name: 'CHEM', data: [2, 2, 1, 1] },
        { name: 'MME', data: [1, 1, 2, 1] }
      ]
    },
    activeClasses: [
      { id: 1, faculty: "Dr. Rajesh Kumar", subject: "Data Structures", time: "10:00-11:00", venue: "Lab-101", department: "CSE", year: 2, section: "A", status: "active" },
      { id: 2, faculty: "Dr. Priya Singh", subject: "Digital Electronics", time: "11:00-12:00", venue: "Room-205", department: "ECE", year: 3, section: "B", status: "active" },
      { id: 3, faculty: "Prof. Amit Kumar", subject: "Thermodynamics", time: "09:00-10:00", venue: "Mech-Lab", department: "MECH", year: 2, section: "C", status: "completed" }
    ],
    monthlyWorkload: [
      { faculty: "Dr. Rajesh Kumar", department: "CSE", classes: 45 },
      { faculty: "Dr. Priya Singh", department: "ECE", classes: 38 },
      { faculty: "Prof. Amit Kumar", department: "MECH", classes: 42 },
      { faculty: "Dr. Sunita Rao", department: "CSE", classes: 40 },
      { faculty: "Prof. Ravi Shankar", department: "EEE", classes: 36 }
    ],
    semesterWorkload: [
      { faculty: "Dr. Rajesh Kumar", department: "CSE", classes: 120 },
      { faculty: "Dr. Priya Singh", department: "ECE", classes: 110 },
      { faculty: "Prof. Amit Kumar", department: "MECH", classes: 115 },
      { faculty: "Dr. Sunita Rao", department: "CSE", classes: 105 },
      { faculty: "Prof. Ravi Shankar", department: "EEE", classes: 95 }
    ]
  };

  const filteredClasses = facultyData.activeClasses.filter(cls => 
    (selectedDepartment === 'All' || cls.department === selectedDepartment) &&
    (searchTerm === '' || cls.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
     cls.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      {/* Search and Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search faculty or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>
        <select 
          value={selectedDepartment} 
          onChange={(e) => setSelectedDepartment(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="All">All Departments</option>
          <option value="CSE">Computer Science</option>
          <option value="ECE">Electronics</option>
          <option value="EEE">Electrical</option>
          <option value="MECH">Mechanical</option>
          <option value="CIVIL">Civil</option>
          <option value="CHEM">Chemical</option>
          <option value="MME">Metallurgy</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👨‍🏫</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statValue}>{facultyData.totalFaculty}</h3>
            <p style={styles.statLabel}>Total Faculty</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📚</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statValue}>{facultyData.activeClasses.filter(c => c.status === 'active').length}</h3>
            <p style={styles.statLabel}>Active Classes</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏰</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statValue}>87%</h3>
            <p style={styles.statLabel}>Avg. Punctuality</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statValue}>92%</h3>
            <p style={styles.statLabel}>Schedule Adherence</p>
          </div>
        </div>
      </div>

      <div style={styles.chartsGrid}>
        {/* Faculty Distribution */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Faculty Distribution by Branch</h3>
          <div style={styles.pieChart}>
            {facultyData.branchDistribution.map((branch, index) => (
              <div key={branch.name} style={styles.pieItem}>
                <div style={styles.pieColor} ></div>
                <span style={styles.pieLabel}>{branch.name}</span>
                <span style={styles.pieValue}>{branch.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Classes Today */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Active Classes Today</h3>
            <span style={styles.liveBadge}>● LIVE</span>
          </div>
          <div style={styles.classesList}>
            {filteredClasses.map(cls => (
              <div key={cls.id} style={styles.classItem}>
                <div style={styles.classInfo}>
                  <div style={styles.classFaculty}>{cls.faculty}</div>
                  <div style={styles.classDetails}>
                    {cls.subject} • {cls.department} Year {cls.year} • Sec {cls.section}
                  </div>
                  <div style={styles.classTimeVenue}>
                    ⏰ {cls.time} • 📍 {cls.venue}
                  </div>
                </div>
                <div style={{
                  ...styles.statusBadge,
                  ...(cls.status === 'active' ? styles.statusActive : styles.statusCompleted)
                }}>
                  {cls.status === 'active' ? 'Active' : 'Completed'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workload Analytics */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Monthly Class Distribution</h3>
          <div style={styles.barChart}>
            {facultyData.monthlyWorkload.map((faculty, index) => (
              <div key={faculty.faculty} style={styles.barItem}>
                <div style={styles.barLabel}>{faculty.faculty}</div>
                <div style={styles.barContainer}>
                  <div 
                    style={{
                      ...styles.barFill,
                      width: `${(faculty.classes / 50) * 100}%`,
                      backgroundColor: facultyData.branchDistribution.find(b => b.name === faculty.department)?.color || '#8B0000'
                    }}
                  >
                    <span style={styles.barValue}>{faculty.classes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Semester Workload</h3>
          <div style={styles.horizontalBarChart}>
            {facultyData.semesterWorkload.map((faculty, index) => (
              <div key={faculty.faculty} style={styles.hBarItem}>
                <div style={styles.hBarLabel}>{faculty.faculty}</div>
                <div style={styles.hBarContainer}>
                  <div 
                    style={{
                      ...styles.hBarFill,
                      width: `${(faculty.classes / 150) * 100}%`,
                      backgroundColor: facultyData.branchDistribution.find(b => b.name === faculty.department)?.color || '#8B0000'
                    }}
                  >
                    <span style={styles.hBarValue}>{faculty.classes} classes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Year-wise Distribution */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Year-wise Teaching Distribution</h3>
        <div style={styles.stackedBarChart}>
          <div style={styles.stackedLegend}>
            {facultyData.branchDistribution.map(branch => (
              <div key={branch.name} style={styles.legendItem}>
                <div style={{...styles.legendColor, backgroundColor: branch.color}}></div>
                <span>{branch.name}</span>
              </div>
            ))}
          </div>
          <div style={styles.stackedBars}>
            {facultyData.yearDistribution.labels.map((year, yearIndex) => (
              <div key={year} style={styles.stackedBarGroup}>
                <div style={styles.stackedBarLabel}>{year}</div>
                <div style={styles.stackedBar}>
                  {facultyData.yearDistribution.datasets.map((dept, deptIndex) => (
                    <div
                      key={dept.name}
                      style={{
                        ...styles.stackedSegment,
                        width: `${(dept.data[yearIndex] / 15) * 100}%`,
                        backgroundColor: facultyData.branchDistribution.find(b => b.name === dept.name)?.color || '#8B0000'
                      }}
                      title={`${dept.name}: ${dept.data[yearIndex]} faculty`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '0 1.5rem',
  },
  filterBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    alignItems: 'center'
  },
  searchBox: {
    position: 'relative',
    flex: 1,
    maxWidth: '400px'
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.5rem',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6c757d'
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '0.9rem',
    outline: 'none',
    background: 'white',
    minWidth: '150px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  statCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'transform 0.3s ease'
  },
  statIcon: {
    fontSize: '2rem',
    padding: '0.5rem',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #8B0000, #FF6347)',
    color: 'white'
  },
  statInfo: {
    flex: 1
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#2c3e50',
    margin: '0'
  },
  statLabel: {
    color: '#6c757d',
    margin: '0',
    fontSize: '0.9rem'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  chartCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  chartTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0'
  },
  liveBadge: {
    background: '#dc3545',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    animation: 'pulse 2s infinite'
  },
  pieChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  pieItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem'
  },
  pieColor: {
    width: '16px',
    height: '16px',
    borderRadius: '4px'
  },
  pieLabel: {
    flex: 1,
    fontWeight: '500',
    color: '#2c3e50'
  },
  pieValue: {
    fontWeight: '600',
    color: '#8B0000'
  },
  classesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxHeight: '400px',
    overflowY: 'auto'
  },
  classItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease'
  },
  classInfo: {
    flex: 1
  },
  classFaculty: {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.25rem'
  },
  classDetails: {
    fontSize: '0.9rem',
    color: '#6c757d',
    marginBottom: '0.25rem'
  },
  classTimeVenue: {
    fontSize: '0.8rem',
    color: '#8B0000',
    fontWeight: '500'
  },
  statusBadge: {
    padding: '0.35rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  statusActive: {
    background: '#d4edda',
    color: '#155724'
  },
  statusCompleted: {
    background: '#e2e3e5',
    color: '#383d41'
  },
  barChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  barItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  barLabel: {
    width: '150px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#2c3e50'
  },
  barContainer: {
    flex: 1,
    background: '#f8f9fa',
    borderRadius: '4px',
    overflow: 'hidden',
    height: '30px'
  },
  barFill: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 0.5rem',
    transition: 'width 0.5s ease'
  },
  barValue: {
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  horizontalBarChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  hBarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  hBarLabel: {
    width: '150px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#2c3e50'
  },
  hBarContainer: {
    flex: 1,
    background: '#f8f9fa',
    borderRadius: '4px',
    overflow: 'hidden',
    height: '25px'
  },
  hBarFill: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 0.5rem',
    transition: 'width 0.5s ease'
  },
  hBarValue: {
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  stackedBarChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  stackedLegend: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem'
  },
  legendColor: {
    width: '12px',
    height: '12px',
    borderRadius: '2px'
  },
  stackedBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  stackedBarGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  stackedBarLabel: {
    width: '80px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#2c3e50'
  },
  stackedBar: {
    flex: 1,
    display: 'flex',
    height: '30px',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  stackedSegment: {
    height: '100%',
    transition: 'width 0.5s ease',
    cursor: 'pointer'
  }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
  
  .faculty-dashboard .stat-card:hover {
    transform: translateY(-2px);
  }
  
  .faculty-dashboard .class-item:hover {
    background: #e9ecef;
  }
  
  .faculty-dashboard .stacked-segment:hover {
    opacity: 0.8;
  }
`;
document.head.appendChild(style);

export default FacultyDashboard;