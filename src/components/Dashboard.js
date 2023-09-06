import React, { useState, useEffect,useContext }  from 'react'
import Calendar from 'react-calendar'
// import 'react-calendar/dist/Calendar.css' 
import axios from 'axios';
import './Dashboard.css'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Label } from 'recharts';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
  } from "recharts";
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import AuthContext from '../context/AuthContext';



function Dashboard(props) {

  let {user} = useContext(AuthContext)
  
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  
  const [datesdata, setDatesdata] = useState([]);
  const [monthTotals, setMonthTotals] = useState([]);
   
  const [leavesByMonth, setLeavesByMonth] = useState(initializeLeavesByMonth()); 

  function initializeLeavesByMonth() {
    const months = [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"
    ];
    const initialData = {};
    months.forEach(month => {
      initialData[month] = 0;
    });
    return initialData;
  }

  function FormattedLeaveType(str) {

    // converting first letter to uppercase
    const formatted = str.charAt(0).toUpperCase() + str.slice(1).replace('_',' ');
  
    return formatted;
  }

  useEffect(()=> {
    //  getEmployee()
    async function fetchEmployees() {
      try {
        const response = await fetch('http://localhost:8000/tp_lms/employee/'
      );
        const data = await response.json();
        // console.log(data)
        const activeuser = data.filter(employee => employee.id === user)
        // console.log(activeuser)

        setEmployees(activeuser);
    
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    }

    fetchEmployees();

    async function fetchLeaves() {
      try {
        // Fetch leave history data
        const response = await fetch(`http://localhost:8000/tp_lms/`);
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
          const updatedLeavesByMonth = { ...leavesByMonth };
          const activeUserLeaves = data.filter(employee => employee.emp_id === user);
          setLeaves(activeUserLeaves);
          // console.log(activeUserLeaves)
          // Process leave data to create a dictionary with month-wise counts
      
          activeUserLeaves.forEach(leave => {
            const startDate = new Date(leave.start_date);
            const endDate = new Date(leave.end_date);
          
            const currentYear = new Date().getFullYear();
          
            if (!isNaN(startDate) && !isNaN(endDate) && startDate.getFullYear() === currentYear) {
              const startMonth = startDate.getMonth();
              const endMonth = endDate.getMonth();
              const endDay = endDate.getDate();
          
              for (let month = startMonth; month <= endMonth; month++) {
                const currentMonth = new Date(currentYear, month, 1);
                const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
          
                let leaveDaysInMonth = 0;
          
                if (month === startMonth) {
                  if (month === endMonth) {
                    leaveDaysInMonth = endDay - startDate.getDate() + 1;
                  } else {
                    leaveDaysInMonth = daysInMonth - startDate.getDate() + 1;
                  }
                } else if (month === endMonth) {
                  leaveDaysInMonth = endDay;
                } else {
                  leaveDaysInMonth = daysInMonth;
                }
          
                const monthName = currentMonth.toLocaleString('en-us', { month: 'short' });
          
                if (!leavesByMonth[monthName]) {
                  leavesByMonth[monthName] = 0;
                }
                leavesByMonth[monthName] += leaveDaysInMonth;
              }
            }
          });
          setLeavesByMonth(updatedLeavesByMonth); 

          // Now you have a dictionary with month names and leave counts
        } else {
          // Handle empty or unexpected data
          console.log('No data available')
        }
    
        // Handle loading and errors as before
      } catch (error) {
        // Handle specific error cases
        console.error('Error fetching employee data:', error);
      }
    }
    
    // Call the function with the employee ID and handle authentication appropriately
    // Replace with the actual employee ID


    fetchLeaves();
    }, []);
   

    const transformedData = Object.entries(leavesByMonth).map(([month, count]) => ({
      name: month,
      days: count,
    }));

    // const data1 = [
    //   {name: "Jan",days: 5},
    //   {name: "Feb",days: 3},
    //   {name: "Mar",days: 2},
    //   {name: "Apr",days: 4},
    //   {name: "May",days: 5},
    //   {name: "Jun",days: 3},
    //   {name: "Jul",days: 2},
    //   {name: "Aug",days: 0},
    //   {name: "Sep",days: 0},
    //   {name: "Oct",days: 0},
    //   {name: "Nov",days: 0},
    //   {name: "Dec",days: 0},
    // ];

    const data = [
    { name: 'Total Leaves' },
    { name: 'Casual Leaves'},
    { name: 'Earned Leaves' },
    { name: 'Maternity Leaves' },
    { name: 'Paternity Leaves' },
    { name: 'Study Leaves' },
    { name: 'Brewment Leaves' },
    
    ];



    const COLORS = [ '#1AA260','#0088FE',  '#2F0909', '#00BFFF','	#FA2A55','#F6BE00','#00008B' ];

    // const [selectedDate, setSelectedDate] = useState(new Date());

    // const handleDateChange = (date) => {
    //     setSelectedDate(date);
    // };
  return (
    <>
    <div className='con'>
  
     <div  className='emp'>
     {employees.map(emp => (
          <div key={emp.id} className="employee-info">
              <div className="employee-avatar">
                {emp.emp_name.charAt(0)}
              </div>
              <div className="employee-details">
              
                <p className="employee-name">{emp.emp_name}</p>
                <p className="employee-id">Employee ID: {emp.emp_id}</p>
              
              </div>
        
          </div>
      ))}


      </div>
      {employees.map(emp => (
          <div className='leav'>
          <div className="Leaves-info">
                <div className="leaves-details">
                <p >Total Leaves</p>
                <p className="noofleavs"> { emp.total_leaves}</p>
                </div> 
          </div>
          <div className="Leaves-info">
                <div className="leaves-details">
                <p >Casual Leaves</p>
                <p className="noofleavs">{emp.casual_leaves}</p>
                </div> 
          </div>
          <div className="Leaves-info">
                <div className="leaves-details">
                <p>Earned Leaves</p>
                <p className="noofleavs">{emp.earned_leaves}</p>
                </div> 
          </div>
          </div>
    ))}
    </div>
    <div className='con-chart'>
    <div className='chart-con1'>
        <p>Leave Statistics</p>
       
    <BarChart
      width={600}
      height={300}
      barCategoryGap={30}
      data={transformedData}
      margin={{
        top:10,
        right: 10,
        left: 5,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis max={30} />
      <Tooltip />
      <Legend />

      <Bar dataKey="days" fill= "#1338be" />
    </BarChart>
    </div>
    <span className='span'> </span>
    {employees.map(emp => (
    <div className='chart-con2'>
      {/* <ResponsiveContainer width="100%" height="100%"> */}
              <PieChart width={300} height={300} >
                  <Pie
                    data={[
                            { name: 'Total Leaves', value: emp.total_leaves },
                            { name: 'Casual Leaves', value: emp.casual_leaves },
                            { name: 'Earned Leaves', value: emp.earned_leaves},
                            { name: 'Maternity Leaves',value: emp.maternity_leaves },
                            { name: 'Paternity Leaves', value: emp.paternity_leaves },
                            { name: 'Study Leaves',value: emp.study_leaves },
                            { name: 'Bereavement Leaves',value: emp.bereavement_leaves },
                          ]}
                    cx={120}
                    cy={120}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={0}
                    dataKey="value"
                    label
                    // labelLine={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Label /> 
                </PieChart>
                {/* </ResponsiveContainer> */}
        <div className='lea'>
        <p style={{color:'#1AA260'}}><i style={{color:'#1AA260',fontSize:'28px'} } class="bi bi-dot"/>Total Leave</p>
        <p style={{color:'#0088FE'}}><i style={{color:'#0088FE',fontSize:'28px'} } class="bi bi-dot"/>Casual Leave</p>
        <p style={{color:'#2F0909'}}><i style={{color:'#2F0909',fontSize:'28px'} } class="bi bi-dot"/>Earned Leave</p>
        <p style={{color:'#00BFFF'}}><i style={{color:'#00BFFF',fontSize:'28px'} } class="bi bi-dot"/>Maternity Leaves  </p>
        <p style={{color:'#FA2A55'}}><i style={{color:'#FA2A55',fontSize:'28px'} } class="bi bi-dot"/>Paternity Leaves</p>
        <p style={{color:'#F6BE00'}}><i style={{color:'#F6BE00',fontSize:'28px'} } class="bi bi-dot"/>Study Leaves</p>
        <p style={{color:'#00008B'}}><i style={{color:'#00008B',fontSize:'28px'} } class="bi bi-dot"/>Bereavement Leaves</p>
        {/* <p><i class="bi bi-dot"/>Annual Leave</p> */}
      </div>
     
    </div>
    ))}
    </div>
    <div className=' con-chart1'>
    <div className='chart-con1'>
        <p>Leave Requests  </p> 
        
        <table className="leave-table">
      <thead>
          <th>Type</th>
          <th>Duration</th>
          <th>Reason</th>
          <th>From</th>
          <th>To</th>
          <th> <Link className='style-none' to='/list' style={{color:'Blue'}}> View All</Link> </th>
      </thead>
     
      <tbody >
        {leaves.map((leave) => (
          <tr key={leave.id}>
              <td> {FormattedLeaveType(leave.leave_type)}</td>
              <td>{leave.days_applied} Day(s)</td>
              <td>{leave.reason}</td>
              <td>{leave.start_date}</td>
              <td>{leave.end_date}</td>

          </tr>  
        ))}
      </tbody>
      </table>
      
    </div>
    {/* <span className='span'> </span>
    <div className="calendar-container">
      <div className="calendar">
        <p>Calendar</p>
        <Calendar onChange={handleDateChange} value={selectedDate} />
      </div>
    </div> */}
    </div>
    </>
  )
}

export default Dashboard