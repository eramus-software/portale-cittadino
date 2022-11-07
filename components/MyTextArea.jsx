import dynamic from "next/dynamic";
import { TextArea } from "design-react-kit";

export default function MyTextArea(props) {
  /*const TextArea = dynamic(() =>
    import("design-react-kit").then((module) => module.TextArea),
    { ssr: false }
  );*/

  return (
    <TextArea rows={props.rows} label={props.label} placeholder={props.placeholder} value={props.value}>
    </TextArea>
  );
}