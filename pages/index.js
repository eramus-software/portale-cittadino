import Head from 'next/head'
import { useEffect, useState } from "react";
import packageJson from "../package.json";
import { useAppContext } from "../context/appContext";
import Login from './login';

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