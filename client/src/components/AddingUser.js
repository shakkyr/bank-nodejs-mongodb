import React from 'react'
import axios from 'axios'
// import { Link } from 'react-router-dom';
const alertMessage = document.querySelector('.alertMessage');
const AddingUser = ()=> {
        const [user, setUser] = React.useState({
            costumerName:'',
            id:'',
            email:'',
            age:'',
            firstDeposit:'',
            accountNumber:'',
        })
        

        const inputHandler = (e)=>{
            setUser({
                ...user,
                [e.target.name]: e.target.value
            })
            console.log(user);
        }

        
        const addNewCostumer = async ()=>{
            try {
            await axios.post(`http://localhost:5000/api/bank/api/bank`,user)
            // alertMessage.innerHTML= "<span style='color:green'>Adding Account Sucseed</span>";
            // <Link to="/AllCostumers">List of Costumers</Link>
            }
            catch (e){
                alertMessage.innerHTML= "<span style='color:red'>Account number already exist!!!</span>";
            }
           }
    return (
        <div className="add__user">
        <p>New bank customer</p>
               <div><input type="text" onChange={inputHandler} name="costumerName"  value={user.costumerName} placeholder='name'/></div>
               <div><input type="text" onChange={inputHandler} name="id"  value={user.id} placeholder='id'/></div>
               <div><input type='email' onChange={inputHandler} name="email"  value={user.email} placeholder='email'/></div>
               <div><input type="number" onChange={inputHandler} name="age"  value={user.age} placeholder='age'/></div>
               <div><input type="number" onChange={inputHandler} name="firstDeposit"  value={user.firstDeposit} placeholder='first deposit'/></div>
               <div><input type="number" onChange={inputHandler} name="accountNumber"  value={user.accountNumber} placeholder='Account Number'/></div>
               <div><input type="button" onClick={addNewCostumer} value='add'/></div>
               <div className="alertMessage"></div>
        </div>
    )
}

export default AddingUser
