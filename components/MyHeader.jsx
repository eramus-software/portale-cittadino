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
            <h2>Portale del cittadino</h2>
            <h3>Comune di {s}</h3>
          </HeaderBrand>
          <HeaderRightZone>
            <HeaderSocialsZone label="Seguici su">
              <ul>
                <li>
                  <a aria-label="Facebook" href="#" target="_blank">
                    <Icon icon="it-facebook" />
                  </a>
                </li>
                <li>
                  <a aria-label="Github" href="#" target="_blank">
                    <Icon icon="it-github" />
                  </a>
                </li>
                <li>
                  <a aria-label="Twitter" href="#" target="_blank">
                    <Icon icon="it-twitter" />
                  </a>
                </li>
              </ul>
            </HeaderSocialsZone>
            <HeaderSearch iconName="it-search" label="Cerca" />
          </HeaderRightZone>
        </HeaderContent>
      </Header>
    )
}