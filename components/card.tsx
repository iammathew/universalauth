import { ReactNode } from "react";

export const Card = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="max-w-xl w-full p-4 rounded-xl border border-gray-200 bg-white shadow-xl mb-4">
    <h2 className="text-2xl text-gray-900 font-semibold mb-4">{title}</h2>
    {children}
  </div>
);
