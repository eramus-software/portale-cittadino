import {
    Icon,
    Header,
    HeaderBrand,
    HeaderRightZone,
    HeaderContent,
    HeaderSocialsZone,
    HeaderSearch,
  } from "design-react-kit";

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