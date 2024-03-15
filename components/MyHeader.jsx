import {
    Icon,
    Header,
    HeaderBrand,
    HeaderRightZone,
    HeaderContent,
    HeaderSocialsZone,
    HeaderSearch,
} from "design-react-kit";
import dynamic from 'next/dynamic';

/*const Icon = dynamic(() => import('design-react-kit').then((module) => module.Icon),
{ ssr: false });
const Header = dynamic(() => import('design-react-kit').then((module) => module.Header),
{ ssr: false });
const HeaderBrand = dynamic(() => import('design-react-kit').then((module) => module.HeaderBrand),
{ ssr: false });
const HeaderRightZone = dynamic(() => import('design-react-kit').then((module) => module.HeaderRightZone),
{ ssr: false });
const HeaderContent = dynamic(() => import('design-react-kit').then((module) => module.HeaderContent),
{ ssr: false });
const HeaderSocialsZone = dynamic(() => import('design-react-kit').then((module) => module.HeaderSocialsZone),
{ ssr: false });
const HeaderSearch = dynamic(() => import('design-react-kit').then((module) => module.HeaderSearch),
{ ssr: false });*/

export default function MyHeader() {
  const s = localStorage.getItem('subdomain');
    return (
        <Header theme="" type="center">
        <HeaderContent>
          <HeaderBrand iconName="it-code-circle">
            <h2>Portale cittadino sanzioni CDS</h2>
            {/* <h3>Comune di {s}</h3> */}
          </HeaderBrand>
          
        </HeaderContent>
      </Header>
    )
}