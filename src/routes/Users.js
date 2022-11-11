import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../components/Customer/UserManage"
import Header from "../container/Header/Header";




export default function Users() {
     
	return (
		<React.Fragment>
			<div className="system-container">
				<div className="system-list">
					<Switch>
						<Route path="/system/user-manage" component={UserManage} />

						{/* <Route path="/system/user-redux" component={UserManage} />
						<Route path="/system/manage-doctor" component={ManageDoctor} />
						<Route
							path="/system/manage-specialty"
							component={ManageSpecialty}
						/>
						<Route path="/system/manage-clinic" component={ManageClinic} />
						<Route
							component={() => {
								return <Redirect to={systemMenuPath} />;
							}}
						/> */}
					</Switch>
				</div>
			</div>
		</React.Fragment>
	);
}
