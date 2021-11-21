import React from "react";
import axios from "axios";
import UserInfo from "./UserInfo";
import logo from './user.png'


const AllCostumers = () => {
  const [costumers, setCostumers] = React.useState([]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
        getUsers()
        
      }, 1000) // in milliseconds
      return () => clearInterval(intervalId)
  }, []);

  const getUsers = () => {
    axios.get("http://localhost:5000/api/bank/").then((res) => {
      
      setCostumers(res.data);
    });
  };
  return (
    <div className="users__container">
      {costumers.map((usr) => {
        return (
          <div className="users__left" key ={usr.accountNumber}>
            <h5>
              Account Number:{" "}
              <UserInfo
                accountNumber={usr.accountNumber}
                name={usr.accountNumber}
              />
            </h5>
            <img
              alt="user"
              className="userImage"
              src={logo}
              style={{ width: "5%", height: "5%", borderRadius: "50%" }}
            ></img>
            <span style={{color:'blue'}}> {usr.costumerName} </span>
            Account Balance : {usr.firstDeposit} ש"ח
            <h6>Costumer id: {usr._id}</h6>
          </div>
        );
      })}
    </div>
  );
};

export default AllCostumers;
