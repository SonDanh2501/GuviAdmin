import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import "./UserManage.scss";
import TableManageUser from "./TableManageUser.js";

export default function UserManage() {
     

return (
     <React.Fragment>
<div className="user-redux-container">
				<div className="title">User Redux Drake</div>
				<div className="user-redux-body">
					<div className="container">
						<div className="row">							
							<div className="col-12 mb-5">
								<TableManageUser/>
							</div>
						</div>
					</div>
				</div>
			</div>
     </React.Fragment>
);
}
