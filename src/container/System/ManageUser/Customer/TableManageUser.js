import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCustomer } from '../../../../redux/selectors/customer';
import "./TableManageUser.scss";
import  * as actions from '../../../../redux/actions/customerAction';

export default function TableManageUser() {
     
  const [customer, setCustomer] = React.useState({
     phone: '',
     email: '',
     name: '',
     default_address:''
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
     dispatch(actions.getCustomers.getCustomersRequest());
     console.log('test action')
   }, [dispatch]);

  const customers = useSelector(getCustomer);
  console.log("CHECK getCustomer  ",customers);

return (
     <React.Fragment>
          <table id="tablemanageuser">
               <tbody>
                    <tr>
                         <th>Email</th>
                         <th>name</th>
                         <th>phone</th>
                         <th>default_address</th>
                         <th>Actions</th>
                    </tr>
                    {customers &&
                         customers.length > 0 &&
                         customers.map((item, index) => {
                              return (
                                   <tr key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.name}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.default_address}</td>
                                        
                                        {/* <td>
                                             <button
                                                  className="btn-edit"
                                                  onClick={() => this.handleEditUser(item)}
                                             >
                                                  <i className="fas fa-pencil-alt"></i>
                                             </button>
                                             <button
                                                  onClick={() => this.handleDeleteUser(item)}
                                                  className="btn-delete"
                                                  // onClick={() => this.handleDeleteUser(item)}
                                             >
                                                  <i className="fas fa-trash"></i>
                                             </button>
                                        </td> */}
                                   </tr>
                              );
                         })}
               </tbody>
          </table>
          {/* <MdEditor
               style={{ height: "500px" }}
               renderHTML={(text) => mdParser.render(text)}
               onChange={handleEditorChange}
          /> */}
     </React.Fragment>
);
}
