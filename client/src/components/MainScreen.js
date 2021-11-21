import React from "react";
import "./mainPage.css";


export const MainScreen =()=>{
    return(
        <div className="div-home">
             <section id="about-info" className="bg-light py-3">
    <div className="container">
      <div className="info-left">
        <h1 className="l-heading"><span className="text-primary">Welcome to</span> Bank of The Future </h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veritatis illo, similique labore voluptate nulla animi dolorum eius laborum illum, nesciunt quod reprehenderit dicta autem vel nobis minima sit deleniti!</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. A velit voluptatem impedit voluptate. Doloribus, voluptas dolore! Cupiditate aliquid sequi deserunt.</p>
      </div>
      <div className="info-right">
        <img src="https://wallpaperbat.com/down/241932-open-banking-will-change-everythingeventually" alt="hotel"/>
      </div>
    </div>
  </section>
  <div className="clr"></div>
  <section id="testimonials" className="py-3">
    <div className="container">
      <h2 className="l-heading">What Our costumers Say</h2>
      <div className="testimonial bg-primary">
        <img src="https://wallpaperbat.com/down/264163-fictitious-assets-ailing-irans-banking-sector" alt="Samantha"/>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam eligendi quibusdam, dolorum maxime cum numquam quisquam, deleniti eum incidunt, velit non consectetur. Facere, ipsa maxime, ullam id amet odio laboriosam sit iusto tempore fugit exercitationem, a dolore quo maiores nisi!</p>
      </div>
      <div className="testimonial bg-primary">
          <img src="https://wallpaperbat.com/down/340169-reasons-you-hate-your-bank" alt="Jen"/>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam eligendi quibusdam, dolorum maxime cum numquam quisquam, deleniti eum incidunt, velit non consectetur. Facere, ipsa maxime, ullam id amet odio laboriosam sit iusto tempore fugit exercitationem, a dolore quo maiores nisi!</p>
        </div>
    </div>
  </section> 
  
        </div>
    )
}

export default MainScreen