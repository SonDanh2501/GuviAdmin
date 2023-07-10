import { useEffect, useState } from "react";
import "./index.scss";
import FinanceCollaborator from "./FinanceCollaborator";
import FinanceCustomer from "./FinanceCustomer";

const ManageFinance = () => {
  const [tab, setTab] = useState("ctv");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="div-container-finance">
      <FinanceCollaborator />
    </div>
  );
};

export default ManageFinance;
