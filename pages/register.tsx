import { SelfServiceRegistrationFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { InputHTMLAttributes, useState } from "react";
import { CSRFToken } from "../components/csrf-token";
import { Layout } from "../components/layout";
import { LogoCard } from "../components/logocard";
import { Messages } from "../components/messages";
import { KRATOS_API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const RegisterPage = ({
  flowData,
}: {
  flowData: SelfServiceRegistrationFlow;
}) => {
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  return (
    <Layout>
      <Head>
        <title>Register</title>
      </Head>
      <LogoCard title="Sign up">
        {flowData && (
          <>
            <Messages flowData={flowData} />
            <form
              className="mt-8 space-y-6"
              method="POST"
              action={flowData.ui.action}
            >
              <CSRFToken flowData={flowData} />
              <div>
                <label htmlFor="traits.email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="traits.email"
                  name="traits.email"
                  autoComplete="email"
                  defaultValue={
                    (flowData.ui.nodes[1].attributes as any).value as string
                  }
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>

              <div className="rounded-md shadow-sm -space-y-px">
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="repeat-password" className="sr-only">
                    Repeat Password
                  </label>
                  <input
                    name="repeat-password"
                    type="password"
                    id="repeat-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Repeat Password"
                    value={repeatedPassword}
                    onChange={(e) => setRepeatedPassword(e.target.value)}
                  />
                </div>
                <div
                  className={
                    "w-full px-3 py-1 rounded-b-md " +
                    (password === repeatedPassword
                      ? "bg-green-500"
                      : "bg-red-500")
                  }
                ></div>
              </div>

              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="password_identifier" className="sr-only">
                    User name
                  </label>
                  <input
                    type="text"
                    id="traits.username"
                    name="traits.username"
                    required
                    defaultValue={
                      (flowData.ui.nodes[3].attributes as any).value as string
                    }
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="User name"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Display name
                  </label>
                  <input
                    type="text"
                    id="traits.displayname"
                    name="traits.displayname"
                    required
                    defaultValue={
                      (flowData.ui.nodes[4].attributes as any).value as string
                    }
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Display name"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  name="method"
                  value="password"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
              <div className="h-[1px] bg-gray-300" />
              <div>
                <Link href="/login">
                  <a className="group relative w-full flex justify-center py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Back to login
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
  const allCookies = context.req.headers.cookie;
  const flowId = context.query.flow;

  if (!flowId) {
    return {
      redirect: {
        destination: `${KRATOS_API_URL}/self-service/registration/browser`,
      },
    };
  }

  let flowData: SelfServiceRegistrationFlow | void;

  if (allCookies && flowId) {
    const data = await kratos
      .getSelfServiceRegistrationFlow(flowId.toString(), allCookies)
      .then(({ data: flow }) => {
        return flow;
      })
      .catch((err) => {
        console.log("err", err);
      });
    flowData = data;
  }

  return {
    props: {
      flowData: flowData ? flowData : null,
    },
  };
}

export default RegisterPage;
