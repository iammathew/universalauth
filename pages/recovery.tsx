import { SelfServiceRecoveryFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import Link from "next/link";
import { CSRFToken } from "../components/csrf-token";
import { Layout } from "../components/layout";
import { LogoCard } from "../components/logocard";
import { Messages } from "../components/messages";
import { KRATOS_API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const RecoveryPage = ({ flowData }: { flowData: SelfServiceRecoveryFlow }) => {
  return (
    <Layout>
      <LogoCard title="Recover your account">
        {flowData && (
          <>
            <Messages flowData={flowData} />
            <form
              className="mt-8 space-y-6"
              method="POST"
              action={flowData.ui.action}
            >
              <CSRFToken flowData={flowData} />
              <div className="rounded-md shadow-sm">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="text"
                    name="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  name="method"
                  value="link"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Recover
                </button>
              </div>
              <div className="h-[1px] bg-gray-300" />
              <div>
                <Link href="/login">
                  <a className="group relative w-full flex justify-center py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Back to Login
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
        destination: `${KRATOS_API_URL}/self-service/recovery/browser`,
      },
    };
  }

  let flowData: SelfServiceRecoveryFlow | void;

  if (allCookies && flowId) {
    const data = await kratos
      .getSelfServiceRecoveryFlow(flowId.toString(), allCookies)
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

export default RecoveryPage;
