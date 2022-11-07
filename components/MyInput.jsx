import dynamic from "next/dynamic";
import { Input } from "design-react-kit";

export default function MyInput(props) {
  /*const Input = dynamic(() =>
    import("design-react-kit").then((module) => module.Input),
    { ssr: false }
  );*/

  return (
    <Input type={props.type} label={props.label} id={props.id} value={props.value} wrapperClass={props.wrapperClass} readOnly>
    </Input>
  );
}