import { Button } from "design-react-kit";
import dynamic from "next/dynamic";

export default function MyButton(props) {
  /*const Button = dynamic(() =>
    import("design-react-kit").then((module) => module.Button), {ssr: false}
  );*/

  return (
    <Button onClick={props.onClick} type={props.type} color={props.color}>
      {props.title}
    </Button>
  );
}
