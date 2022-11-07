import dynamic from "next/dynamic";
import { Row } from "design-react-kit";

export default function MyRow(props) {
  /*const Row = dynamic(() =>
    import("design-react-kit").then((module) => module.Row),
    { ssr: false }
  );*/

  return (
    <Row>
    </Row>
  );
}