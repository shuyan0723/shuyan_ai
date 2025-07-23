import { useState,useEffect,lazy,Suspense } from 'react'
import {Routes,Route} from 'react-router-dom';
import './App.css'
import NavBar from './components/NavBar';

const Home =lazy(()=>import('./views/Home'));
const Login=lazy(()=>import('./views/Login'));
const Pay =lazy(()=>import('./views/Pay'));
const RequiredAuth=lazy(()=>import('./components/RequiredAuth'));

function App() {
   useEffect(()=>{
    
   },[])
  return (
    <>
     
     <NavBar />
     <Suspense>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pay" element={
          <RequiredAuth>
            <Pay />
          </RequiredAuth>
        } />
        {/* <Route path="/required-auth" element={<RequiredAuth />} /> */}

     </Routes>
     </Suspense>
    </>
  )
}

export default App
