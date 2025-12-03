// index.js

import Head from "next/head";
import { useEffect, useState } from "react";
import packageJson from "../package.json";
import { useAppContext } from "../context/appContext";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
// ... (altri import CSS)

import dynamic from "next/dynamic";

// Carica l'intera pagina di selezione dinamicamente con ssr: false
const DynamicSelectionPage = dynamic(() => import("./scelta_app"), {
  ssr: false,
});

export default function Home() {
  // ... (Logica useEffect e Context)

  // Sostituisci <SelectionPage /> con <DynamicSelectionPage />
  return <DynamicSelectionPage />;
}
