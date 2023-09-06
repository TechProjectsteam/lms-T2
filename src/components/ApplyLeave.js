import React, { useState, useEffect ,useContext} from 'react';
import axios from 'axios';
import './ApplyLeave.css'

import AuthContext from '../context/AuthContext';


export default function ApplyLeave() {

  let {user} = useContext(AuthContext)

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [availableLeaves, setAvailableLeaves] = useState({
    earned_leaves: '',
    casual_leaves: '',
    study_leaves:'',
    maternity_leaves:'',
    paternity_leaves:'',
    bereavement_leaves:'',
  });
  
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [reportingManager, setReportingManager] = useState('');
  const [managers, setManagers] = useState([]);

  const [availableLeavesForType, setAvailableLeavesForType] = useState('');
  // const user = 5;
  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      const response = await fetch('http://localhost:8000/tp_lms/employee/'
    );
      const data = await response.json();
      // console.log(data)
      const activeuser = data.filter(employee => employee.id === user);
      setEmployees(activeuser);
      // console.log(activeuser)
      const manager = data.filter(employee => employee.designation === 'manager');
      
      setManagers(manager);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  }
  
  const handleEmployeeChange = (event) => {
    const empId = event.target.value;
    setSelectedEmployee(empId);
    const selectedEmp = employees.find((employee) => employee.id === user);
    
    if (selectedEmp) {
      setAvailableLeaves({
        earned_leaves: selectedEmp.earned_leaves,
        casual_leaves: selectedEmp.casual_leaves,
        study_leaves:selectedEmp.study_leaves,
        maternity_leaves:selectedEmp.maternity_leaves,
        paternity_leaves:selectedEmp.paternity_leaves,
        bereavement_leaves:selectedEmp.bereavement_leaves,
      });
    }
  };

  useEffect(() => {
    const leavesForSelectedType = availableLeaves[leaveType] || 0;
    setAvailableLeavesForType(leavesForSelectedType);
  }, [leaveType, availableLeaves]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const noOfDays = calculateNoOfDays();
  
   // Required Fields Validation
   if (!selectedEmployee || !leaveType || !fromDate || !toDate || !reason || !reportingManager) {
    alert('Please fill in all the required fields.');
    return;
  }

  // Date Validation
  if (fromDate && toDate) {
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (fromDateObj > toDateObj) {
      alert('Invalid date range. "From" date cannot be after "To" date.');
      return;
    }
  }

  // No. of Days Validation
  if (noOfDays <= 0) {
    alert('Invalid date range. Please select valid "From" and "To" dates.');
    return;
  }

  // Available Leaves Validation
  if (noOfDays > availableLeavesForType) {
    alert('Number of days applied exceeds available leaves.');
    return;
  }

    const updatedEarnedLeaves = Number(availableLeaves.earned_leaves) - (leaveType === 'earned_leaves' ? noOfDays : 0);
    const updatedCasualLeaves = Number(availableLeaves.casual_leaves) - (leaveType === 'casual_leaves' ? noOfDays : 0);
    const updatedStudyLeaves = Number(availableLeaves.study_leaves) - (leaveType === 'study_leaves' ? noOfDays : 0);
    const updatedMaternityLeaves = Number(availableLeaves.maternity_leaves) - (leaveType === 'maternity_leaves' ? noOfDays : 0);
    const updatedPaternityLeaves = Number(availableLeaves.paternity_leaves) - (leaveType === 'paternity_leaves' ? noOfDays : 0);
    const updatedBereavementLeaves = Number(availableLeaves.bereavement_leaves) - (leaveType === 'bereavement_leaves' ? noOfDays : 0);
    const updatedTotalLeaves = updatedEarnedLeaves + updatedCasualLeaves;

    try {
      const response = await axios.post(`http://localhost:8000/tp_lms/`, {
        emp_id: selectedEmployee,
        leave_type: leaveType,
        days_applied: noOfDays,
        start_date: fromDate,
        end_date: toDate,
        reason: reason,
        reporting_manager: reportingManager,
      });

      console.log(response.data);
      alert('Leave submitted successfully!');
      if (response.status === 201) {
        try {
          const selectedEmp = employees.find((employee) => employee.id === parseInt(selectedEmployee));
    
          const updatedEmployee = {
            emp_name: selectedEmp.emp_name,
            emp_id: selectedEmp.emp_id,
            emp_gender: selectedEmp.emp_gender,
            emp_mail: selectedEmp.emp_mail,
            designation: selectedEmp.designation,
            doj: selectedEmp.doj,
            dob: selectedEmp.dob,
            total_leaves: updatedTotalLeaves,
            earned_leaves: updatedEarnedLeaves,
            casual_leaves: updatedCasualLeaves,
            study_leaves:updatedStudyLeaves,
            maternity_leaves:updatedMaternityLeaves,
            paternity_leaves:updatedPaternityLeaves,
            bereavement_leaves:updatedBereavementLeaves,
     
          };
    
          const response = await axios.put(`http://localhost:8000/tp_lms/employee/${selectedEmployee}`, updatedEmployee);
          console.log(response.data);
          setAvailableLeaves({
            earned_leaves: updatedEarnedLeaves,
            casual_leaves: updatedCasualLeaves,
            study_leaves:updatedStudyLeaves,
            maternity_leaves:updatedMaternityLeaves,
            paternity_leaves:updatedPaternityLeaves,
            bereavement_leaves:updatedBereavementLeaves,
          });
    
          setSelectedEmployee('');
          setFromDate('');
          setToDate('');
          setReason('');
          setReportingManager('');
          setLeaveType('');
    
          fetchEmployees();
          alert('Employee leave information updated successfully!');
        } catch (error) {
          console.error('Error updating employee leaves:', error);
        }
      }

        setSelectedEmployee('');
        setFromDate('');
        setToDate('');
        setReason('');
        setReportingManager('');
        setLeaveType('');

        fetchEmployees();
      
    } catch (error) {
      console.error('Error submitting leave:', error);
    }
  };

  const calculateNoOfDays = () => {
    if (fromDate && toDate) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
      const timeDiff = Math.abs(toDateObj - fromDateObj);
      const noOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
      return noOfDays;
    }
    return 0;
  };

  return (
    <div className="leave-form-container">
      <form onSubmit={handleSubmit}>
          <ul className='side1'>
        
        <div className="form-group">
          <label htmlFor="employee">Select Employee <span style={{color:'red'}}>*</span></label>
          <br></br>
            <select
              id="employee"
              name="employee"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.emp_name}
                </option>
              ))}
            </select>
        </div>
        </ul>
<ul className='side'>
        <div className="form-group">
          <label htmlFor="leaveType">Leave Type <span style={{color:'red'}}>*</span></label>
          <select
            id="leaveType"
            name="leaveType"
            value={leaveType}
            onChange={(event) => setLeaveType(event.target.value)}
          >
            <option value="select">select type</option>
            <option value="earned_leaves">Earned Leaves</option>
            <option value="casual_leaves">Casual Leaves/Sick Leaves</option>
            <option value="study_leaves">Study Leaves</option>
            <option value="maternity_leaves">Maternity Leaves</option>
            <option value="paternity_leaves">Paternity Leaves</option>
            <option value="bereavement_leaves">Bereavement Leaves</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="availableLeaves">Available Leaves <span style={{color:'red'}}>*</span></label>
          <input
            type="text"
            id="availableLeaves"
            name="availableLeaves"
            value={availableLeavesForType}
            readOnly
          />
        </div>
        </ul>
        <ul className='side'>
        <div className="form-group">
          <label htmlFor="fromDate">From <span style={{color:'red'}}>*</span></label>
          <input
            type="date"
            id="fromDate"
            name="fromDate"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="toDate">To <span style={{color:'red'}}>*</span></label>
          <input
            type="date"
            id="toDate"
            name="toDate"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>
        </ul>
        <ul className='side'>
        <div className="form-group">
          <label htmlFor="noOfDays">No. of Days <span style={{color:'red'}}>*</span></label>
          <input
            type="text"
            id="noOfDays"
            name="noOfDays"
            value={calculateNoOfDays()}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="reportingManager">Reporting Manager <span style={{color:'red'}}>*</span></label>
          <select
            id="reportingManager"
            name="reportingManager"
            value={reportingManager}
            onChange={(event) => setReportingManager(event.target.value)}
          >
            <option value="">Select Reporting Manager</option>
            {managers
              .map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.emp_name}
                </option>
              ))}
          </select>
        </div>
        
        </ul>
        <ul className='side2'>
        <div className="form-group">
          <label htmlFor="reason">Reason <span style={{color:'red'}}>*</span></label>
         <input className='reason-box'
            id="reason"
            name="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
         
      
        </div>
        </ul>
        <ul className='side-button'>
        <div className="form-group-submit-btn">
          <button className="submit-button" type="submit">Submit</button>
        </div>
        </ul>

      </form>
    </div>
  );
}