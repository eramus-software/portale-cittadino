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

export default function MyHeader() {
  const s =
    typeof window !== "undefined" ? localStorage.getItem("subdomain") : "Ente";
  return (
    <Header theme="" type="center">
      <HeaderContent>
        {/* Avvolgiamo HeaderBrand nel componente Link e impostiamo href="/" */}
        <Link href="/" passHref legacyBehavior>
          <HeaderBrand iconName="it-pa">
            <h2>Portale cittadino sanzioni CDS</h2>
            {/* <h3>Comune di {s}</h3> */}
          </HeaderBrand>
        </Link>
      </HeaderContent>
    </Header>
  );
}
