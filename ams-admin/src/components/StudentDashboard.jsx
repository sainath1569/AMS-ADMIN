// components/dashboards/StudentDashboard.jsx
import React, { useState } from 'react';

const StudentDashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample Data - Replace with actual API calls later
  const studentData = {
    totalStudents: 1240,
    branchDistribution: [
      { name: "CSE", value: 200, color: "#8B0000" },
      { name: "ECE", value: 180, color: "#FF6B6B" },
      { name: "EEE", value: 150, color: "#4ECDC4" },
      { name: "MECH", value: 160, color: "#45B7D1" },
      { name: "CIVIL", value: 170, color: "#96CEB4" },
      { name: "CHEM", value: 140, color: "#FFEAA7" },
      { name: "MME", value: 120, color: "#DDA0DD" }
    ],
    yearDistribution: {
      '1st Year': 310,
      '2nd Year': 300,
      '3rd Year': 320,
      '4th Year': 310
    },
    attendanceDistribution: [
      { range: "90-100%", count: 558, percentage: 45, color: "#28a745" },
      { range: "75-90%", count: 372, percentage: 30, color: "#ffc107" },
      { range: "60-75%", count: 186, percentage: 15, color: "#fd7e14" },
      { range: "Below 60%", count: 124, percentage: 10, color: "#dc3545" }
    ],
    monthlyTrend: [
      { month: "Jan", CSE: 92, ECE: 87, EEE: 85, MECH: 78, CIVIL: 80, CHEM: 88, MME: 82 },
      { month: "Feb", CSE: 91, ECE: 88, EEE: 84, MECH: 79, CIVIL: 81, CHEM: 87, MME: 83 },
      { month: "Mar", CSE: 93, ECE: 86, EEE: 86, MECH: 80, CIVIL: 82, CHEM: 89, MME: 84 },
      { month: "Apr", CSE: 90, ECE: 89, EEE: 83, MECH: 77, CIVIL: 79, CHEM: 86, MME: 81 }
    ],
    branchYearData: {
      CSE: { '1st Year': 89, '2nd Year': 91, '3rd Year': 92, '4th Year': 90 },
      ECE: { '1st Year': 85, '2nd Year': 86, '3rd Year': 87, '4th Year': 88 },
      EEE: { '1st Year': 83, '2nd Year': 84, '3rd Year': 85, '4th Year': 86 },
      MECH: { '1st Year': 76, '2nd Year': 78, '3rd Year': 79, '4th Year': 80 },
      CIVIL: { '1st Year': 78, '2nd Year': 80, '3rd Year': 81, '4th Year': 82 },
      CHEM: { '1st Year': 86, '2nd Year': 87, '3rd Year': 88, '4th Year': 89 },
      MME: { '1st Year': 80, '2nd Year': 81, '3rd Year': 82, '4th Year': 83 }
    }
  };

  // Smart filtering logic
  const getChartData = () => {
    if (selectedBranch === 'All' && selectedYear === 'All') {
      // Show heatmap: Branch × Year
      return { type: 'heatmap', data: studentData.branchYearData };
    } else if (selectedBranch === 'All' && selectedYear !== 'All') {
      // Show branch comparison for selected year
      const branchData = Object.keys(studentData.branchYearData).map(branch => ({
        branch,
        attendance: studentData.branchYearData[branch][selectedYear]
      }));
      return { type: 'branchComparison', data: branchData };
    } else if (selectedBranch !== 'All' && selectedYear === 'All') {
      // Show year comparison for selected branch
      const yearData = Object.entries(studentData.branchYearData[selectedBranch]).map(([year, attendance]) => ({
        year,
        attendance
      }));
      return { type: 'yearComparison', data: yearData };
    } else {
      // Show section-wise data for specific branch and year
      return { 
        type: 'sectionDetail', 
        data: [
          { section: 'A', attendance: 92 },
          { section: 'B', attendance: 88 },
          { section: 'C', attendance: 85 }
        ]
      };
    }
  };

  const chartConfig = getChartData();

  return (
    <div style={styles.container}>
      {/* Search and Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search student ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>
        <select 
          value={selectedBranch} 
          onChange={(e) => setSelectedBranch(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="All">All Branches</option>
          <option value="CSE">Computer Science</option>
          <option value="ECE">Electronics</option>
          <option value="EEE">Electrical</option>
          <option value="MECH">Mechanical</option>
          <option value="CIVIL">Civil</option>
          <option value="CHEM">Chemical</option>
          <option value="MME">Metallurgy</option>
        </select>
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="All">All Years</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👨‍🎓</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statValue}>{studentData.totalStudents}</h3>
            <p style={styles.statLabel}>Total Students</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statValue}>87%</h3>
            <p style={styles.statLabel}>Avg Attendance</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⭐</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statValue}>45%</h3>
            <p style={styles.statLabel}>Excellent (&gt;90% )</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚠️</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statValue}>10%</h3>
            <p style={styles.statLabel}>At Risk (&lt;60%)</p>
          </div>
        </div>
      </div>

      <div style={styles.chartsGrid}>
        {/* Branch Distribution */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Student Distribution by Branch</h3>
          <div style={styles.donutChart}>
            {studentData.branchDistribution.map((branch, index) => (
              <div key={branch.name} style={styles.donutItem}>
                <div style={{...styles.donutColor, backgroundColor: branch.color}}></div>
                <span style={styles.donutLabel}>{branch.name}</span>
                <span style={styles.donutValue}>{branch.value} students</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Distribution */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Attendance Status Distribution</h3>
          <div style={styles.attendanceDistribution}>
            {studentData.attendanceDistribution.map(item => (
              <div key={item.range} style={styles.distributionItem}>
                <div style={styles.distributionHeader}>
                  <span style={styles.distributionRange}>{item.range}</span>
                  <span style={styles.distributionCount}>{item.percentage}% ({item.count} students)</span>
                </div>
                <div style={styles.distributionBar}>
                  <div 
                    style={{
                      ...styles.distributionFill,
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Comparative Chart */}
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <h3 style={styles.chartTitle}>
            {chartConfig.type === 'heatmap' && 'Branch × Year Attendance Heatmap'}
            {chartConfig.type === 'branchComparison' && `Branch Comparison - ${selectedYear}`}
            {chartConfig.type === 'yearComparison' && `Year-wise Trend - ${selectedBranch}`}
            {chartConfig.type === 'sectionDetail' && `Section Performance - ${selectedBranch} ${selectedYear}`}
          </h3>
          <div style={styles.chartFilters}>
            <span style={styles.filterInfo}>
              Showing: {selectedBranch} • {selectedYear}
            </span>
          </div>
        </div>

        {chartConfig.type === 'heatmap' && (
          <div style={styles.heatmap}>
            <div style={styles.heatmapHeader}>
              <div style={styles.heatmapCorner}></div>
              {Object.keys(studentData.branchYearData.CSE).map(year => (
                <div key={year} style={styles.heatmapYear}>{year}</div>
              ))}
            </div>
            {Object.entries(chartConfig.data).map(([branch, years]) => (
              <div key={branch} style={styles.heatmapRow}>
                <div style={styles.heatmapBranch}>{branch}</div>
                {Object.entries(years).map(([year, attendance]) => (
                  <div
                    key={year}
                    style={{
                      ...styles.heatmapCell,
                      backgroundColor: getHeatmapColor(attendance)
                    }}
                    title={`${branch} ${year}: ${attendance}%`}
                  >
                    {attendance}%
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {chartConfig.type === 'branchComparison' && (
          <div style={styles.barChart}>
            {chartConfig.data.map((item, index) => (
              <div key={item.branch} style={styles.barItem}>
                <div style={styles.barLabel}>{item.branch}</div>
                <div style={styles.barContainer}>
                  <div 
                    style={{
                      ...styles.barFill,
                      width: `${item.attendance}%`,
                      backgroundColor: studentData.branchDistribution.find(b => b.name === item.branch)?.color || '#8B0000'
                    }}
                  >
                    <span style={styles.barValue}>{item.attendance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {chartConfig.type === 'yearComparison' && (
          <div style={styles.barChart}>
            {chartConfig.data.map((item, index) => (
              <div key={item.year} style={styles.barItem}>
                <div style={styles.barLabel}>{item.year}</div>
                <div style={styles.barContainer}>
                  <div 
                    style={{
                      ...styles.barFill,
                      width: `${item.attendance}%`,
                      backgroundColor: getYearColor(item.year)
                    }}
                  >
                    <span style={styles.barValue}>{item.attendance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {chartConfig.type === 'sectionDetail' && (
          <div style={styles.sectionChart}>
            {chartConfig.data.map((section, index) => (
              <div key={section.section} style={styles.sectionItem}>
                <div style={styles.sectionHeader}>
                  <span style={styles.sectionName}>Section {section.section}</span>
                  <span style={styles.sectionAttendance}>{section.attendance}%</span>
                </div>
                <div style={styles.sectionBar}>
                  <div 
                    style={{
                      ...styles.sectionFill,
                      width: `${section.attendance}%`,
                      backgroundColor: section.attendance >= 90 ? '#28a745' : 
                                     section.attendance >= 75 ? '#ffc107' : 
                                     section.attendance >= 60 ? '#fd7e14' : '#dc3545'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Trend */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Monthly Attendance Trend</h3>
        <div style={styles.trendChart}>
          <div style={styles.trendLegend}>
            {studentData.branchDistribution.map(branch => (
              <div key={branch.name} style={styles.trendLegendItem}>
                <div style={{...styles.trendColor, backgroundColor: branch.color}}></div>
                <span>{branch.name}</span>
              </div>
            ))}
          </div>
          <div style={styles.trendLines}>
            {studentData.monthlyTrend.map((monthData, index) => (
              <div key={monthData.month} style={styles.trendMonth}>
                <div style={styles.trendMonthLabel}>{monthData.month}</div>
                <div style={styles.trendBars}>
                  {studentData.branchDistribution.map(branch => (
                    <div
                      key={branch.name}
                      style={{
                        ...styles.trendBar,
                        height: `${monthData[branch.name]}%`,
                        backgroundColor: branch.color,
                        opacity: selectedBranch === 'All' || selectedBranch === branch.name ? 1 : 0.3
                      }}
                      title={`${branch.name}: ${monthData[branch.name]}%`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers & At Risk */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>🎯 Top Performers (&gt;95%)</h3>
          <div style={styles.studentList}>
            {[
              { id: 'S001', name: 'Amit Sharma', branch: 'CSE', year: 3, attendance: 98 },
              { id: 'S002', name: 'Priya Patel', branch: 'ECE', year: 2, attendance: 97 },
              { id: 'S003', name: 'Rahul Kumar', branch: 'MECH', year: 4, attendance: 96 },
              { id: 'S004', name: 'Sneha Reddy', branch: 'CSE', year: 2, attendance: 95 }
            ].map(student => (
              <div key={student.id} style={styles.studentItem}>
                <div style={styles.studentAvatar}>👤</div>
                <div style={styles.studentInfo}>
                  <div style={styles.studentName}>{student.name}</div>
                  <div style={styles.studentDetails}>
                    {student.branch} • Year {student.year} • ID: {student.id}
                  </div>
                </div>
                <div style={styles.attendanceExcellent}>{student.attendance}%</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>⚠️ At Risk Students (&lt;75%)</h3>
          <div style={styles.studentList}>
            {[
              { id: 'S101', name: 'Raj Malhotra', branch: 'CIVIL', year: 1, attendance: 65 },
              { id: 'S102', name: 'Anita Das', branch: 'EEE', year: 2, attendance: 58 },
              { id: 'S103', name: 'Vikram Singh', branch: 'MECH', year: 3, attendance: 72 },
              { id: 'S104', name: 'Pooja Mehta', branch: 'CHEM', year: 4, attendance: 68 }
            ].map(student => (
              <div key={student.id} style={styles.studentItem}>
                <div style={styles.studentAvatar}>👤</div>
                <div style={styles.studentInfo}>
                  <div style={styles.studentName}>{student.name}</div>
                  <div style={styles.studentDetails}>
                    {student.branch} • Year {student.year} • ID: {student.id}
                  </div>
                </div>
                <div style={styles.attendancePoor}>{student.attendance}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getHeatmapColor = (attendance) => {
  if (attendance >= 90) return '#28a745';
  if (attendance >= 80) return '#90EE90';
  if (attendance >= 70) return '#ffc107';
  if (attendance >= 60) return '#fd7e14';
  return '#dc3545';
};

const getYearColor = (year) => {
  const colors = {
    '1st Year': '#8B0000',
    '2nd Year': '#FF6B6B', 
    '3rd Year': '#4ECDC4',
    '4th Year': '#45B7D1'
  };
  return colors[year] || '#8B0000';
};

// Styles (similar to FacultyDashboard with some additions)
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
    minWidth: '120px'
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
  chartFilters: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  filterInfo: {
    fontSize: '0.9rem',
    color: '#6c757d',
    background: '#f8f9fa',
    padding: '0.5rem 1rem',
    borderRadius: '20px'
  },
  donutChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  donutItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem'
  },
  donutColor: {
    width: '16px',
    height: '16px',
    borderRadius: '4px'
  },
  donutLabel: {
    flex: 1,
    fontWeight: '500',
    color: '#2c3e50'
  },
  donutValue: {
    fontWeight: '600',
    color: '#8B0000',
    fontSize: '0.9rem'
  },
  attendanceDistribution: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  distributionItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  distributionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  distributionRange: {
    fontWeight: '500',
    color: '#2c3e50'
  },
  distributionCount: {
    fontSize: '0.8rem',
    color: '#6c757d'
  },
  distributionBar: {
    background: '#f8f9fa',
    borderRadius: '4px',
    overflow: 'hidden',
    height: '8px'
  },
  distributionFill: {
    height: '100%',
    transition: 'width 0.5s ease',
    borderRadius: '4px'
  },
  heatmap: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  heatmapHeader: {
    display: 'flex',
    background: '#f8f9fa',
    borderBottom: '1px solid #e9ecef'
  },
  heatmapCorner: {
    width: '100px',
    padding: '1rem',
    fontWeight: '600',
    color: '#2c3e50'
  },
  heatmapYear: {
    flex: 1,
    padding: '1rem',
    textAlign: 'center',
    fontWeight: '600',
    color: '#2c3e50',
    borderLeft: '1px solid #e9ecef'
  },
  heatmapRow: {
    display: 'flex',
    borderBottom: '1px solid #e9ecef',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  heatmapBranch: {
    width: '100px',
    padding: '1rem',
    fontWeight: '600',
    color: '#2c3e50',
    background: '#f8f9fa',
    display: 'flex',
    alignItems: 'center'
  },
  heatmapCell: {
    flex: 1,
    padding: '1rem',
    textAlign: 'center',
    borderLeft: '1px solid #e9ecef',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
    width: '100px',
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
  sectionChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  sectionItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionName: {
    fontWeight: '600',
    color: '#2c3e50'
  },
  sectionAttendance: {
    fontWeight: '600',
    color: '#8B0000'
  },
  sectionBar: {
    background: '#f8f9fa',
    borderRadius: '4px',
    overflow: 'hidden',
    height: '12px'
  },
  sectionFill: {
    height: '100%',
    transition: 'width 0.5s ease',
    borderRadius: '4px'
  },
  trendChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  trendLegend: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  trendLegendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem'
  },
  trendColor: {
    width: '12px',
    height: '12px',
    borderRadius: '2px'
  },
  trendLines: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '200px',
    padding: '1rem 0'
  },
  trendMonth: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1
  },
  trendMonthLabel: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#6c757d'
  },
  trendBars: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '2px',
    height: '150px',
    width: '100%'
  },
  trendBar: {
    flex: 1,
    borderRadius: '2px 2px 0 0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    minHeight: '20px'
  },
  studentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  studentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease'
  },
  studentAvatar: {
    fontSize: '1.5rem',
    padding: '0.5rem',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  studentInfo: {
    flex: 1
  },
  studentName: {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.25rem'
  },
  studentDetails: {
    fontSize: '0.8rem',
    color: '#6c757d'
  },
  attendanceExcellent: {
    background: '#d4edda',
    color: '#155724',
    padding: '0.5rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  attendancePoor: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '0.5rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600'
  }
};

// Add CSS animations
const studentStyle = document.createElement('style');
studentStyle.textContent = `
  .student-dashboard .stat-card:hover {
    transform: translateY(-2px);
  }
  
  .student-dashboard .student-item:hover {
    background: #e9ecef;
  }
  
  .student-dashboard .heatmap-cell:hover {
    transform: scale(1.05);
    z-index: 1;
    position: relative;
  }
  
  .student-dashboard .trend-bar:hover {
    opacity: 0.8 !important;
  }
`;
document.head.appendChild(studentStyle);

export default StudentDashboard;