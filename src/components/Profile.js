import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import './Profile.css'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

import AuthContext from '../context/AuthContext';


function Profile(props) {

  let {user} = useContext(AuthContext)
  

  const [employees, setEmployees] = useState([]);
    // const user=5

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
    },[]);

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
      </div>
  
<div className='con'>
{employees.map(emp => (
          <div key={emp.id} className="employee-info">
              <div className="employee-details">
              
                <p >Gender</p>
                <p className="employee-id">{emp.emp_gender}</p>
              
              </div>

        
          </div>
      ))}
   

     {employees.map(emp => (
          <><div key={emp.id} className="employee-info">
         <div className="employee-details">

           <p >Designation</p>
           <p className="employee-id">{emp.designation}</p>

         </div>


       </div>
       <div key={emp.id} className="employee-info">
           <div className="employee-details">

             <p >Date of Joining</p>
             <p className="employee-id">{emp.doj}</p>

           </div>


         </div>
         
         <div key={emp.id} className="employee-info">
           <div className="employee-details">

             <p >Date of Birth</p>
             <p className="employee-id">{emp.dob}</p>

           </div>


         </div> 

          <div className="employee-info">
          <div className="employee-details">
            
            <p >Mail</p>
            <p className="employee-id">{emp.emp_mail}</p>
          </div>
        </div>        
         </>
      ))}

</div>


    <div className='con'>
   {employees.map(emp => (
       <div className='leav'>
       <div className="Leaves-info">
             <div className="leaves-details">
             <p >Study Leaves</p>
             <p className="noofleavs"> {emp.study_leaves}</p>
             </div> 
       </div>
       <div className="Leaves-info">
             <div className="leaves-details">
             <p >Maternity Leaves</p>
             <p className="noofleavs">{emp.maternity_leaves}</p>
             </div> 
       </div>
       <div className="Leaves-info">
             <div className="leaves-details">
             <p>Paternity Leaves</p>
             <p className="noofleavs">{emp.paternity_leaves}</p>
             </div> 
       </div>
       <div className="Leaves-info">
             <div className="leaves-details">
             <p>Bereavement Leaves</p>
             <p className="noofleavs">{emp.bereavement_leaves}</p>
             </div> 
       </div>
       </div>
 ))}
 </div>



 

 </>
  )

 }

export default Profile