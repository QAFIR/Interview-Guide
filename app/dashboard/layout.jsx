"use client"
import React from 'react'
import Header from './_components/Header';
import { createContext, useState } from "react";
export const WebCamContext = createContext();

function DashboardLayout({children}) {
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  return (
    <div>
        <Header/>
        <div className='mx-5 md:mx-2= lg:mx-36'>
          <WebCamContext.Provider value={{ webCamEnabled, setWebCamEnabled }}>
            {children}
          </WebCamContext.Provider>
        </div>
        
    </div>
  )
}

export default DashboardLayout