// pages/CrManagement.jsx
import React, { useState, useEffect } from 'react';
import AdminPortal from '../components/AdminPortal';

const CrManagement = () => {
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  
  // --- State Management ---
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [crList, setCrList] = useState([]);
  const [filteredCrList, setFilteredCrList] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCR, setNewCR] = useState({
    id: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Constants ---
  const yearOptions = ['All', 'E1', 'E2', 'E3', 'E4'];
  const branchOptions = ['All', 'CSE', 'ECE', 'EEE', 'CIVIL', 'ME', 'MME', 'CHEM'];
  const batch = {'1': 'E1', '2': 'E2', '3': 'E3', '4': 'E4'};
  const API_BASE_URL = 'https://ams-server-4eol.onrender.com';

  // Fetch CR list on component mount
  useEffect(() => {
    fetchCRListFromBackend();
  }, []);

  // Auto-filter when selections or search query change
  useEffect(() => {
    filterCRs();
  }, [selectedYear, selectedBranch, searchQuery, crList]);

  // Fetch CR list from backend
  const fetchCRListFromBackend = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/crs`, {
        method: 'GET'
      });
      const data = await response.json();
      const crs = data['crs'];

      for (let cr of crs) {
        cr.year = batch[cr.year] || cr.year;
      }
      setCrList(crs);
      setFilteredCrList(crs);
    } catch (error) {
      alert("Failed to fetch CR list");
      console.error("Error fetching CR list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter CRs based on selected filters and search query
  const filterCRs = () => {
    let filtered = [...crList];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(cr => 
        cr.id.toLowerCase().includes(query) || 
        cr.name.toLowerCase().includes(query)
      );
    }
    
    // Apply year filter
    if (selectedYear !== 'All') {
      filtered = filtered.filter(cr => cr.year === selectedYear);
    }
    
    // Apply branch filter
    if (selectedBranch !== 'All') {
      filtered = filtered.filter(cr => cr.branch === selectedBranch);
    }
    
    setFilteredCrList(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedYear('All');
    setSelectedBranch('All');
    setSearchQuery('');
  };

  // Remove CR
  // Remove CR
const removeCR = async (crId) => {
  if (window.confirm("Are you sure you want to remove this CR?")) {
    try {
      const response = await fetch(`${API_BASE_URL}/crs/remove/${crId}`, {
        method: 'DELETE',
      });
      const updatedList = crList.filter(cr => cr.id !== crId);
      setCrList(updatedList);
      alert("CR removed successfully!");
    } catch (error) {
      alert("Failed to remove CR");
    }
  }
};

  // Add new CR
  const addCR = () => {
    setIsAddModalVisible(true);
  };

  // Handle adding new CR
  const handleAddCR = async () => {
    // Validation
    if (!newCR.id) {
      alert("Please enter a student ID");
      return;
    }

    if (!newCR.phone) {
      alert("Please enter a phone number");
      return;
    }

    if (newCR.phone.length !== 10 || isNaN(Number(newCR.phone))) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('id', newCR.id);
      formData.append('mobile', newCR.phone);

      const response = await fetch(`${API_BASE_URL}/crs/add`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const newcr = data['newcr'];

      newcr.year = batch[newcr.year] || newcr.year;

      if (response.ok) {
        // Add the new CR to the list with data returned from backend
        const updatedList = [...crList, newcr];
        setCrList(updatedList);
        
        // Reset form and close modal
        setNewCR({
          id: '',
          phone: ''
        });
        setIsAddModalVisible(false);
        
        alert("CR added successfully!");
      } else {
        alert(data.message || "Failed to add CR");
      }
    } catch (error) {
      alert("Failed to add CR. Please try again.");
      console.error("Error adding CR:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewCR({
      id: '',
      phone: ''
    });
    setIsAddModalVisible(false);
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedYear !== 'All') count++;
    if (selectedBranch !== 'All') count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  };

  // Inline Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f8f9fa',
      padding: '2rem'
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    searchInputContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      background: '#f8f9fa',
      borderRadius: '10px',
      padding: '0.75rem 1rem',
      border: '2px solid #e9ecef',
      transition: 'border-color 0.3s ease'
    },
    searchIcon: {
      marginRight: '0.5rem',
      color: '#600202',
      fontSize: '1.25rem'
    },
    searchInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: '1rem',
      color: '#600202',
      width: '100%'
    },
    filterButtonMain: {
      background: '#495057',
      padding: '0.75rem',
      borderRadius: '10px',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      cursor: 'pointer',
      border: 'none',
      color: 'white',
      transition: 'background-color 0.3s ease'
    },
    filterButtonActive: {
      background: '#343a40'
    },
    filterBadge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      background: '#dc3545',
      borderRadius: '10px',
      minWidth: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    filterBadgeText: {
      color: '#FFF',
      fontSize: '0.75rem',
      fontWeight: 'bold'
    },
    actionButtonsContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      background: '#28a745',
      padding: '0.75rem 1.5rem',
      borderRadius: '10px',
      cursor: 'pointer',
      border: 'none',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'background-color 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    addButtonText: {
      color: '#FFF',
      fontWeight: '600',
      fontSize: '1rem',
      marginLeft: '0.5rem'
    },
    statsContainer: {
      marginBottom: '1rem'
    },
    statsText: {
      color: '#6c757d',
      fontSize: '0.9rem',
      fontStyle: 'italic'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem'
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #600202',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    loadingText: {
      color: '#6c757d',
      marginTop: '1rem',
      fontSize: '1rem'
    },
    listContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    crCard: {
      display: 'flex',
      flexDirection: 'row',
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      alignItems: 'center',
      borderLeft: '6px solid #dd5e5e',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease'
    },
    crInfo: {
      flex: 1
    },
    crHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.75rem'
    },
    crName: {
      color: '#600202',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginRight: '1rem'
    },
    crBadge: {
      background: '#600202',
      padding: '0.25rem 0.75rem',
      borderRadius: '6px'
    },
    crBadgeText: {
      color: '#f5f5f5',
      fontSize: '0.75rem',
      fontWeight: 'bold'
    },
    crDetailsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    crDetails: {
      color: '#600202',
      fontSize: '0.9rem'
    },
    removeButton: {
      background: '#dc3545',
      padding: '0.75rem',
      borderRadius: '6px',
      cursor: 'pointer',
      border: 'none',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease'
    },
    emptyContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      textAlign: 'center'
    },
    emptyText: {
      color: '#6c757d',
      fontSize: '1.5rem',
      fontWeight: '600',
      marginTop: '1rem'
    },
    emptySubText: {
      color: '#6c757d',
      fontSize: '1rem',
      marginTop: '0.5rem',
      opacity: 0.7
    },
    // Modal Styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: '#FFF',
      borderRadius: '15px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'hidden'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem',
      borderBottom: '1px solid #e9ecef'
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#600202'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#600202'
    },
    formContainer: {
      padding: '1.5rem',
      maxHeight: '400px',
      overflowY: 'auto'
    },
    inputGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#600202',
      marginBottom: '0.5rem',
      display: 'block'
    },
    textInput: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '0.75rem',
      fontSize: '1rem',
      background: '#f8f9fa',
      width: '100%',
      boxSizing: 'border-box'
    },
    noteContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      background: '#f8f9fa',
      padding: '1rem',
      borderRadius: '8px',
      marginTop: '-0.5rem'
    },
    noteText: {
      fontSize: '0.9rem',
      color: '#600202',
      marginLeft: '0.5rem',
      flex: 1,
      fontStyle: 'italic'
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1.5rem',
      borderTop: '1px solid #e9ecef',
      gap: '1rem'
    },
    cancelButton: {
      flex: 1,
      padding: '0.75rem',
      borderRadius: '10px',
      background: '#6c757d',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600'
    },
    submitButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem',
      borderRadius: '10px',
      background: '#28a745',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      gap: '0.5rem'
    },
    submitButtonDisabled: {
      background: '#6c757d',
      cursor: 'not-allowed'
    },
    buttonDisabled: {
      opacity: 0.6
    },
    // Filter Modal Styles
    filterModalContent: {
      padding: '1.5rem',
      maxHeight: '400px',
      overflowY: 'auto'
    },
    filterSection: {
      marginBottom: '1.5rem'
    },
    filterLabel: {
      color: '#600202',
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '0.75rem'
    },
    filterButtonsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    filterButton: {
      background: '#e9ecef',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      border: '1px solid #dee2e6',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '50px',
      textAlign: 'center'
    },
    filterButtonSelected: {
      background: '#600202',
      borderColor: '#600202',
      color: 'white'
    },
    filterButtonText: {
      color: '#495057',
      fontWeight: '500',
      fontSize: '0.9rem'
    },
    filterButtonTextSelected: {
      color: '#f5f5f5',
      fontWeight: '600'
    },
    filterActions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1.5rem',
      gap: '1rem'
    },
    clearAllButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#dc3545',
      padding: '0.75rem 1.5rem',
      borderRadius: '10px',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      gap: '0.5rem',
      flex: 1
    },
    applyButton: {
      flex: 1,
      background: '#28a745',
      padding: '0.75rem',
      borderRadius: '10px',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      textAlign: 'center'
    }
  };

  // Hover effects
  const getHoverStyles = (element) => {
    const hoverStyles = {
      crCard: {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      },
      addButton: {
        background: '#218838'
      },
      filterButtonMain: {
        background: '#343a40'
      },
      removeButton: {
        background: '#c82333'
      },
      searchInputContainer: {
        borderColor: '#600202'
      },
      filterButton: {
        background: '#dee2e6'
      },
      cancelButton: {
        background: '#5a6268'
      },
      submitButton: {
        background: '#218838'
      },
      clearAllButton: {
        background: '#c82333'
      },
      applyButton: {
        background: '#218838'
      }
    };
    return hoverStyles[element] || {};
  };

  const crContent = (
    <div style={styles.container}>
      {/* Search and Filter Bar */}
      <div style={styles.searchContainer}>
        <div 
          style={styles.searchInputContainer}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyles('searchInputContainer'))}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.searchInputContainer)}
        >
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search by ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#600202' }}
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Filter Button */}
        <button
          style={{
            ...styles.filterButtonMain,
            ...(getActiveFiltersCount() > 0 ? styles.filterButtonActive : {})
          }}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyles('filterButtonMain'))}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, {...styles.filterButtonMain, ...(getActiveFiltersCount() > 0 ? styles.filterButtonActive : {})})}
          onClick={() => setIsFilterModalVisible(true)}
        >
          ⚙️
          {getActiveFiltersCount() > 0 && (
            <div style={styles.filterBadge}>
              <span style={styles.filterBadgeText}>{getActiveFiltersCount()}</span>
            </div>
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtonsContainer}>
        <button 
          style={styles.addButton}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyles('addButton'))}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.addButton)}
          onClick={addCR}
        >
          👤 Add New CR
        </button>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsContainer}>
        <p style={styles.statsText}>
          Showing {filteredCrList.length} CR{filteredCrList.length !== 1 ? 's' : ''}
          {getActiveFiltersCount() > 0 && ` • ${getActiveFiltersCount()} filter${getActiveFiltersCount() !== 1 ? 's' : ''} active`}
        </p>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading CRs...</p>
        </div>
      )}

      {/* CR List */}
      {!isLoading && (
        <div style={styles.listContainer}>
          {filteredCrList.length > 0 ? (
            filteredCrList.map((cr) => (
              <div 
                key={cr.id} 
                style={styles.crCard}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyles('crCard'))}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.crCard)}
              >
                <div style={styles.crInfo}>
                  <div style={styles.crHeader}>
                    <h3 style={styles.crName}>{cr.name}</h3>
                    <div style={styles.crBadge}>
                      <span style={styles.crBadgeText}>CR</span>
                    </div>
                  </div>
                  <div style={styles.crDetailsContainer}>
                    <div style={styles.detailRow}>
                      <span>🆔</span>
                      <span style={styles.crDetails}>ID: {cr.id}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span>🎓</span>
                      <span style={styles.crDetails}>Year: {cr.year} • Branch: {cr.branch}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span>📚</span>
                      <span style={styles.crDetails}>Section: {cr.section}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span>📞</span>
                      <span style={styles.crDetails}>{cr.phone}</span>
                    </div>
                  </div>
                </div>
                <button 
                  style={styles.removeButton}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyles('removeButton'))}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.removeButton)}
                  onClick={() => removeCR(cr.id)}
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <div style={styles.emptyContainer}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
              <h3 style={styles.emptyText}>No CRs Found</h3>
              <p style={styles.emptySubText}>
                {getActiveFiltersCount() > 0 
                  ? 'Try changing your filters or add a new CR' 
                  : 'No CRs available. Add a new CR to get started'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add CR Modal */}
      {isAddModalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New CR</h2>
              {!isSubmitting && (
                <button 
                  style={styles.closeButton}
                  onClick={() => setIsAddModalVisible(false)}
                >
                  ✕
                </button>
              )}
            </div>

            <div style={styles.formContainer}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Student ID *</label>
                <input
                  style={styles.textInput}
                  type="text"
                  value={newCR.id}
                  onChange={(e) => setNewCR({...newCR, id: e.target.value})}
                  placeholder="Enter student ID"
                  disabled={isSubmitting}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input
                  style={styles.textInput}
                  type="tel"
                  value={newCR.phone}
                  onChange={(e) => setNewCR({...newCR, phone: e.target.value})}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  disabled={isSubmitting}
                />
              </div>

              <div style={styles.noteContainer}>
                <span>ℹ️</span>
                <p style={styles.noteText}>
                  Student details (name, year, branch, section) will be fetched from the database automatically.
                </p>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button 
                style={{
                  ...styles.cancelButton,
                  ...(isSubmitting ? styles.buttonDisabled : {})
                }}
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.submitButton,
                  ...((!newCR.id || !newCR.phone) ? styles.submitButtonDisabled : {}),
                  ...(isSubmitting ? styles.buttonDisabled : {})
                }}
                onClick={handleAddCR}
                disabled={!newCR.id || !newCR.phone || isSubmitting}
              >
                {isSubmitting ? (
                  <div style={{...styles.loadingSpinner, width: '20px', height: '20px'}}></div>
                ) : (
                  <>
                    👤 Add CR
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterModalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Filters</h2>
              <button 
                style={styles.closeButton}
                onClick={() => setIsFilterModalVisible(false)}
              >
                ✕
              </button>
            </div>

            <div style={styles.filterModalContent}>
              {/* Year Filter */}
              <div style={styles.filterSection}>
                <h3 style={styles.filterLabel}>Academic Year:</h3>
                <div style={styles.filterButtonsContainer}>
                  {yearOptions.map((option) => (
                    <button
                      key={option}
                      style={{
                        ...styles.filterButton,
                        ...(selectedYear === option ? styles.filterButtonSelected : {})
                      }}
                      onMouseEnter={(e) => selectedYear !== option && Object.assign(e.currentTarget.style, getHoverStyles('filterButton'))}
                      onMouseLeave={(e) => selectedYear !== option && Object.assign(e.currentTarget.style, styles.filterButton)}
                      onClick={() => setSelectedYear(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Branch Filter */}
              <div style={styles.filterSection}>
                <h3 style={styles.filterLabel}>Department:</h3>
                <div style={styles.filterButtonsContainer}>
                  {branchOptions.map((option) => (
                    <button
                      key={option}
                      style={{
                        ...styles.filterButton,
                        ...(selectedBranch === option ? styles.filterButtonSelected : {})
                      }}
                      onMouseEnter={(e) => selectedBranch !== option && Object.assign(e.currentTarget.style, getHoverStyles('filterButton'))}
                      onMouseLeave={(e) => selectedBranch !== option && Object.assign(e.currentTarget.style, styles.filterButton)}
                      onClick={() => setSelectedBranch(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={styles.filterActions}>
                <button 
                  style={styles.clearAllButton}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyles('clearAllButton'))}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.clearAllButton)}
                  onClick={clearFilters}
                >
                  🗑️ Clear All
                </button>
                
                <button 
                  style={styles.applyButton}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyles('applyButton'))}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.applyButton)}
                  onClick={() => setIsFilterModalVisible(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  return (
    <AdminPortal user={user}>
      {crContent}
    </AdminPortal>
  );
};

export default CrManagement;