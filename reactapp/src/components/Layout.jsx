import React from "react";







export default function Layout({ children }) {



    return (



        <div



            style={{



                minHeight: "100vh",



                background:



                    "linear-gradient(120deg, rgba(99,102,241,0.08), rgba(16,185,129,0.08))",



            }}



        >



            <div className="container py-4">{children}</div>



        </div>



    );



}