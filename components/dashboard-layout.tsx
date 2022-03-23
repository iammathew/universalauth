import {
  CogIcon,
  HomeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/solid";
import { ReactNode } from "react";
import { NavItem } from "./nav-item";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <header className="py-3 flex bg-white text-center">
        <img
          className="ml-4 my-1 mr-0 h-10 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <span className=" my-1 text-xl justify-center align-middle font-bold px-3 h-auto">
          Account
        </span>
        <input
          className="bg-gray-100 w-96 pl-4 py-2 border-xl ml-4 rounded-xl focus:bg-white focus:border-[1px] focus:border-gray-200 focus:shadow-xl focus-visible: outline-0 transition-all tracking-wider text-gray-700"
          placeholder="Search account"
        />
        <span className="flex-1"></span>
        <div className="bg-gray-400 h-12 w-12 mx-2 rounded-xl text-white shrink-0">
          profile
        </div>
      </header>
      <div className="flex-1 flex">
        <aside className="w-14 lg:w-44 pt-6 shrink-0">
          <NavItem href="/dashboard" text="Home" icon={HomeIcon} />
          <NavItem href="/profile" text="Profile" icon={UserIcon} />
          <NavItem href="/security" text="Security" icon={LockClosedIcon} />
          <NavItem href="/settings" text="Settings" icon={CogIcon} />
        </aside>
        <main className="flex-1 overflow-y-auto px-4 md:px-16 sm:px-8 my-6 flex flex-col w-full items-center">
          {children}
        </main>
      </div>
    </div>
  );
};
