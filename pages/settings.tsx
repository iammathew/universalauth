import { SelfServiceSettingsFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import Head from "next/head";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { Card } from "../components/card";
import { CSRFToken } from "../components/csrf-token";
import { DashboardLayout } from "../components/dashboard-layout";
import { Messages } from "../components/messages";
import { KRATOS_API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const SettingsPage = ({ flowData }: { flowData: SelfServiceSettingsFlow }) => {
  const [username, setUsername] = useState<string>("");
  const [displayname, setDisplayname] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // This useEffect is to add the values in their respective fields
  useEffect(() => {
    setEmail(flowData.identity.recovery_addresses[0].value);
    setUsername(flowData.identity.traits.username);
    setDisplayname(flowData.identity.traits.displayname);
  }, [flowData]);

  return (
    <DashboardLayout>
      <Head>
        <title>Settings</title>
      </Head>
      <Card title="Profile">
        {flowData && (
          <>
            <Messages flowData={flowData} group="profile" />
            <form
              method="POST"
              action={flowData.ui.action}
              className="flex flex-col"
            >
              <CSRFToken flowData={flowData} />
              <div>
                <label htmlFor="email">E-Mail</label>
                <input
                  id="email"
                  name="traits.email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-Mail"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="traits.username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="displayname">Displayname</label>
                <input
                  id="displayname"
                  name="traits.displayname"
                  type="text"
                  value={displayname}
                  onChange={(e) => setDisplayname(e.target.value)}
                  placeholder="Displayname"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>

              {/* This button will update the email, first and last name  */}
              <button
                name="method"
                type="submit"
                value="profile"
                className="group mt-4 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Profile
              </button>
            </form>
          </>
        )}
      </Card>
      <Card title="Change Password">
        {flowData && (
          <>
            <Messages flowData={flowData} group="password" />
            <form
              method="POST"
              action={flowData.ui.action}
              className="flex flex-col"
            >
              {/* This Adds a hidden input for CSRF Token  */}
              {flowData.ui.nodes
                .filter((node) => node.group === "default")
                .map((node) => {
                  return (
                    <input
                      {...(node.attributes as InputHTMLAttributes<HTMLInputElement>)}
                      key="csrf_token"
                    />
                  );
                })}

              <div>
                <label htmlFor="password">New Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>

              <button
                name="method"
                type="submit"
                value="password"
                className="group mt-4 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Password
              </button>
            </form>
          </>
        )}
      </Card>
    </DashboardLayout>
  );
};

// Server side props for getting the Cookies and flow id etc
export async function getServerSideProps(context: NextPageContext) {
  const allCookies = context.req.headers.cookie;
  const flowId = context.query.flow;

  if (!flowId) {
    return {
      redirect: {
        destination: `${KRATOS_API_URL}/self-service/settings/browser?return_to=http://127.0.0.1:3000/settings`,
        // This url needs to change according to the work you are intending it to do
      },
    };
  }

  let flowData: SelfServiceSettingsFlow | void;

  if (allCookies) {
    const data = await kratos
      .getSelfServiceSettingsFlow(flowId.toString(), undefined, allCookies)
      .then(({ data: flow }) => {
        return flow;
      })
      .catch((err) => {
        console.log(err);
      });
    flowData = data;
  }

  return {
    props: {
      flowData: flowData ? flowData : null,
    },
  };
}

export default SettingsPage;
