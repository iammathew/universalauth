import { InputHTMLAttributes } from "react";
import { SelfServiceFlow } from "../utils/kratos";

export const CSRFToken = ({ flowData }: { flowData: SelfServiceFlow }) => {
  const nodes = flowData.ui.nodes
    .filter((node) => node.group === "default")
    .map((node) => {
      return (
        <input
          {...(node.attributes as InputHTMLAttributes<HTMLInputElement>)}
          key="csrf_token"
        />
      );
    });
  return <>{nodes}</>;
};
