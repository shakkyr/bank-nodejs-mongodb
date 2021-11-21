import React from "react";
import axios from "axios";
import BankingButtons from "./BankingButtons";

const UserInfo = ({ accountNumber, name }) => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = React.useState([]);
  const [trans, setTrans] = React.useState(false);

  const fetchUser = () => {
    // axios.get(`api/bank`).then(res=>{
    axios.get(`http://localhost:${process.env.PORT}/api/bank`).then((res) => {
      setUser(res.data);
      setTrans(!trans);
    });
  };

  return (
    <div>
      <input
        className="account__number"
        type="button"
        value={accountNumber}
        name={name}
        onClick={fetchUser}
      />
      <div>
        {!trans ? "" : <BankingButtons accountNumber={accountNumber} />}
      </div>
    </div>
  );
};

export default UserInfo;
