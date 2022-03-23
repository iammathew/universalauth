import Link from "next/link";
import { useRouter } from "next/router";

export const NavItem = ({
  href,
  text,
  icon: Icon,
}: {
  href: string;
  text: string;
  icon: React.ElementType<any>;
}) => {
  const router = useRouter();
  let classNames =
    "block text-gray-600 hover:bg-gray-100 align-middle pl-2 py-3 rounded-r-xl mb-2 flex flex-row";
  if (router.pathname === href) {
    classNames =
      "block text-indigo-600 align-middle bg-indigo-100 pl-2 py-3 rounded-r-xl mb-2 flex flex-row";
  }
  return (
    <Link href={href}>
      <a className={classNames}>
        <Icon className="pl-2 h-6 w-auto inline mr-2 my-auto" />
        <span className="hidden lg:block  align-center">{text}</span>
      </a>
    </Link>
  );
};
