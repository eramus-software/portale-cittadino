import dynamic from "next/dynamic";
import { Alert } from "design-react-kit";

export default function MyAlert(props) {
  /*const Alert = dynamic(() =>
    import("design-react-kit").then((module) => module.Alert),
    { ssr: false }
  );*/

  return (
    <Alert color={props.color}>
      {props.title}
    </Alert>
  );
}
