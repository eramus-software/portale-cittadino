import React, { useEffect, useState } from "react";
import {
  Icon,
  Header,
  HeaderBrand,
  HeaderRightZone,
  HeaderContent,
  HeaderSocialsZone,
  HeaderSearch,
} from "design-react-kit";
import Link from "next/link"; // Importa il componente Link
import dynamic from "next/dynamic";

export default function MyHeader({ title }) {
  const [computedTitle, setComputedTitle] = useState(
    title || "Portale cittadino"
  );

  useEffect(() => {
    if (title) {
      setComputedTitle(title);
      return;
    }
    if (typeof window !== "undefined") {
      const tipo = localStorage.getItem("tipoRicerca");
      if (tipo === "cds") setComputedTitle("Portale cittadino CDS");
      else if (tipo === "sanzioni")
        setComputedTitle("Portale cittadino sanzioni amministrative");
      else setComputedTitle("Portale cittadino");
    }
  }, [title]);

  return (
    <Header theme="" type="center">
      <HeaderContent>
        {/* Avvolgiamo HeaderBrand nel componente Link e impostiamo href="/" */}
        <Link href="/" passHref legacyBehavior>
          <HeaderBrand iconName="it-pa">
            <h2 style={{ margin: 0 }}>{computedTitle}</h2>
          </HeaderBrand>
        </Link>
      </HeaderContent>
    </Header>
  );
}
