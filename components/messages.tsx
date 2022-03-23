import { SelfServiceFlow } from "../utils/kratos";

export const Messages = ({
  flowData,
  group,
}: {
  flowData: SelfServiceFlow;
  group?: string;
}) => {
  const messages: { id: number; text: string; type: string }[] = [];
  if (flowData.ui.messages) {
    messages.push(
      ...flowData.ui.messages.map((m) => ({
        id: m.id,
        text: m.text,
        type: m.type,
      }))
    );
  }
  flowData.ui.nodes.forEach((n) => {
    if (group == null || n.group === group) {
      messages.push(
        ...n.messages.map((m) => ({
          id: m.id,
          text: `${n.meta.label.text} ${m.text}`,
          type: m.type,
        }))
      );
    }
  });
  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.type == "error"
              ? "bg-red-100 p-4 rounded-xl"
              : "bg-green-100 p-4 rounded-xl"
          }
        >
          <p
            className={
              message.type == "error" ? "text-red-500" : "text-green-500"
            }
          >
            {message.text}
          </p>
        </div>
      ))}
    </>
  );
};
