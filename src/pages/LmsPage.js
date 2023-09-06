import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

function LmsPage() {
  let {user} = useContext(AuthContext)

  const [data, setData] = useState([]);
  const [monthTotals, setMonthTotals] = useState([]);

  useEffect(() => {
    // Fetch data from your Django backend here
    // For this example, I'm using mock data
    const fetchedData = [
      { start_date: '2023-01-13', end_date: '2023-01-13', days_applied: 1 },
      // ... other data
    ];
    async function fetchLeaves() {
      try {
        const response = await fetch('http://localhost:8000/tp_lms/'
      );
        const data = await response.json();
        // console.log(data)
        const activeuserleaves = data.filter(employee => employee.emp_id === user);
          console.log(activeuserleaves);

        setData(activeuserleaves);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    }

    fetchLeaves();

  }, []);

  useEffect(() => {
    // Process data and calculate month-wise totals
    const monthTotalsMap = new Map();

    data.forEach(entry => {
      const fromMonth = new Date(entry.start_date).getMonth();
      const toMonth = new Date(entry.end_date).getMonth();

      for (let month = fromMonth; month <= toMonth; month++) {
        const daysToAdd = month === fromMonth ? entry.days_applied : 0;
        monthTotalsMap.set(month, (monthTotalsMap.get(month) || 0) + daysToAdd);
      }
    });

    const result = Array.from(monthTotalsMap.entries()).map(([month, totalDays]) => ({
      name: new Date(2023, month).toLocaleString('default', { month: 'long' }),
      value: totalDays,
    }));
    //  console.log(result);
    setMonthTotals(result);
    // console.log(monthTotals);
  }, [data]);
  //  
  console.log(monthTotals);
  
  // const transformedData = Object.entries(leavesByMonth).map(([month, count]) => ({
  //   name: month,
  //   days: count,
  // }));

  return (
    <div>
      <h1>Monthly Total Days</h1>
      <ul>
        {monthTotals.map((month, index) => (
          <il key={index}>
            {month.name}: {month.value} days
          </il>
        ))}
      </ul>
     
    </div>
  );
}
export default LmsPage