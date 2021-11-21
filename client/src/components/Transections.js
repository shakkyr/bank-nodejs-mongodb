import React from 'react'
import axios from 'axios';

const Transections = ()=> {
    const [transes, setTranses] = React.useState([]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
        getTranses()
        
      }, 1000) // in milliseconds
      return () => clearInterval(intervalId)
  }, []);

  const getTranses =async () => {
   await axios.get("api/bank/trans").then((res) => {
        setTranses(res.data);
    });
  };
  return (
    <div className="users__transes">
      {transes.map((usr,index) => {
        return (
            <div className="users__left" key ={index}>
            <h5>
              From account :<span style={{color:'brown'}}>  {usr.fromWho}</span>
            </h5>
            <h5>
              to Account :<span style={{color:'blue'}}>  {usr.toWho}</span>
            </h5>
            <h4>
              to Amount of  :<span style={{color:'green'}}>  {usr.transfer}</span>
            </h4>
            
            <h6>at: {usr.transictionTime}</h6>
          </div>
        )
      })}
    </div>
  );
};

export default Transections

// "fromWho": 143222,
//         "transfer": 2000,
//         "toWho": 143111,
//         "transictionTime": "2021-11-14 2:32:39"