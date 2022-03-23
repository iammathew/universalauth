import { SelfServiceSettingsFlow } from "@ory/kratos-client";
import { NextPageContext } from "next";
import { InputHTMLAttributes } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { KRATOS_API_URL } from "../utils/config";
import { kratos } from "../utils/kratos";

const SecurityPage = ({ flowData }: { flowData: SelfServiceSettingsFlow }) => {
  return (
    <DashboardLayout>
      <div>
        <h2>Profile</h2>
        {flowData && (
          <form
            method="POST"
            action={flowData.ui.action}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "400px",
              justifyContent: "space-around",
              width: "300px",
            }}
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

            <h2>Change Password?</h2>

            <label>
              <span>New Password</span>
              <input name="password" type="password" placeholder="Password" />
            </label>

            {/* This button is used to upadate the password  */}
            <button name="method" type="submit" value="password">
              Update Password
            </button>
          </form>
        )}
      </div>
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
        destination: `${KRATOS_API_URL}/self-service/settings/browser?return_to=http://127.0.0.1:3000/security`,
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
        throw err;
      });
    flowData = data;
  }

  return {
    props: {
      flowData: flowData ? flowData : null,
    },
  };
}

export default SecurityPage;
