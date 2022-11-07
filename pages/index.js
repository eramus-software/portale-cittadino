import Head from 'next/head'
import { useEffect, useState } from "react";
import packageJson from "../package.json";
import { useAppContext } from "../context/appContext";
import Login from './Login';
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";

export default function Home() {

  const [subdomain, setSubdomain] = useState('')

  useEffect(() => {
    const s = localStorage.getItem('subdomain');
    setSubdomain(s)
  }, [subdomain])
  
  const { currentUser } = useAppContext();
  console.log(currentUser)

  return (
    <Login/>
  )
}