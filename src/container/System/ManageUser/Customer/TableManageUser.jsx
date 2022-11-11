import React,{useState ,useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { getCustomer } from '../../../../redux/selectors/customer';
import "./TableManageUser.scss";
import  * as actions from '../../../../redux/actions/customerAction';
import { Table,Row } from 'reactstrap';

export default function TableManageUser() {
     
  const [customer, setCustomer] = useState({
     phone: '',
     email: '',
     name: '',
     default_address:''
  });
  const dispatch = useDispatch();
  const customers = useSelector(getCustomer);
  console.log("<<<<<<<<<<<<< CHECK USERRRRRRRRR",customers);

  React.useEffect(() => {
     dispatch(actions.getCustomers.getCustomersRequest());
   }, [dispatch]);

  
return (
<>
<Table className='table-manage-user'>
  <thead>
  <tr>
     <th>Email</th>
     <th>Name</th>
     <th>Phone</th>
     <th>Address</th>
     <th>Actions</th>
</tr>
  </thead>
  <tbody>
     {customers && customers.length >0 && customers.map((item,index)=>{
          return (
               <tr key={index} >
                    <td className="table-success"> {item.email}</td>
                    <td className="table-primary "> {item.name}</td>
                    <td className="table-secondary"> {item.phone}</td>
                    <td className="table-danger"> {item.default_address}</td>
                    <td>											
                                                       <button
												className="btn-edit"
                                                          
											>		
                                                          <i className="uil uil-edit-alt "></i>
                                                             
											</button>
											<button
												className="btn-delete"
											>
												<i class="uil uil-trash"></i>
											</button>
										</td>
               </tr>
          )
     })}

  </tbody>

</Table>

</>
 

);
}
