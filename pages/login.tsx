import { SelfServiceLoginFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import Link from "next/link";
import Head from "next/head";
import { LockClosedIcon } from "@heroicons/react/solid";
import { Layout } from "../components/layout";
import { LogoCard } from "../components/logocard";
import { Messages } from "../components/messages";
import { KRATOS_API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";
import { CSRFToken } from "../components/csrf-token";
import { getFlowAndCookies, redirect } from "../utils/kratos-next";

const LoginPage = ({ flowData }: { flowData: SelfServiceLoginFlow }) => {
  return (
    <Layout>
      <Head>
        <title>Sign In</title>
      </Head>
      <LogoCard title="Sign in to your account">
        {flowData && (
          <>
            <Messages flowData={flowData} />
            <form
              className="mt-8 space-y-6"
              method="POST"
              action={flowData.ui.action}
            >
              <CSRFToken flowData={flowData} />
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="password_identifier" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="password_identifier"
                    type="text"
                    name="password_identifier"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    value="true"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/recovery">
                    <a className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot your password?
                    </a>
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  name="method"
                  value="password"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                  </span>
                  Sign in
                </button>
              </div>
              <div className="h-[1px] bg-gray-300" />
              <div>
                <Link href="/register">
                  <a className="group relative w-full flex justify-center py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Sign up
                  </a>
                </Link>
              </div>
            </form>
          </>
        )}
      </LogoCard>
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { cookies, flowId } = getFlowAndCookies(context);

  if (!flowId) return redirect(`${KRATOS_API_URL}/self-service/login/browser`);

  let flowData = (
    await kratos.getSelfServiceLoginFlow(flowId.toString(), cookies)
  ).data;

  if (flowData == null)
    return redirect(`${KRATOS_API_URL}/self-service/login/browser`);

  return {
    props: {
      flowData,
    },
  };
}

export default LoginPage;
