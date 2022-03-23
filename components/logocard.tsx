import { ReactNode } from "react";

export const LogoCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="max-w-md w-full space-y-8 p-4 rounded-xl border border-gray-200 bg-white">
    <div className="py-6">
      <img
        className="mx-auto h-12 w-auto"
        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
        alt="Workflow"
      />
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {title}
      </h2>
    </div>
    {children}
  </div>
);
