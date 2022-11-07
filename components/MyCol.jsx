import dynamic from "next/dynamic";
import { Col } from "design-react-kit";

export default function MyCol(props) {
    
  /*const Col = dynamic(() =>
    import("design-react-kit").then((module) => module.Col),
    { ssr: false }
  );*/

  return (
    <Col>
    </Col>
  );
}