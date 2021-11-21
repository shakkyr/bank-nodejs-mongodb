import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import AllCostumers from './components/AllCostumers';
import AddingUser from './components/AddingUser';
import MainScreen from './components/MainScreen';
import Transections from './components/Transections';


const App = ()=> {
  return (
    <Router>
    <div className="list">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="AllCostumers">List of Costumers</Link></li>
            <li><Link to="AddingUser">Add Costumer</Link></li>
            <li><Link to="Transections">Transections</Link></li>
          </ul>
        </div>
    <Routes>
      <Route path="/" element={<MainScreen />}/>
      <Route path="/AllCostumers" element={<AllCostumers />}/>
      <Route path="/AddingUser" element={<AddingUser />}/>
      <Route path="/Transections" element={<Transections />}/>

  
      
    </Routes>
  </Router>
)
}


export default App;




  // {/* <AddingUser /> */}
  //    {/* <MainScreen/> */}
  //   //  <AllCostumers />