import { NextPageContext } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { kratos } from "../utils/kratos";

const JsonView = dynamic(import("react-json-view"), { ssr: false });

const DashboardPage = ({ flowData }: { flowData: string }) => {
  const [userIdentity, setUserIdentity] = useState();
  const [errorData, setErrorData] = useState();

  useEffect(() => {
    // Get the info on user who is using the session
    fetch("/api/.ory/sessions/whoami", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setErrorData(data);
        } else if (data.active) {
          setUserIdentity(data);
        }
      });
  }, []);

  if (typeof window === "undefined") {
    return null;
  }

  if (errorData || !userIdentity) {
    return (
      <DashboardLayout>
        <Link href="/login">Login</Link>
        <br />
        <Link href="/register">Register</Link>
        <JsonView
          src={errorData}
          style={{ fontSize: "20px", marginTop: "30px" }}
          enableClipboard={false}
          displayDataTypes={false}
        />
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <h1>Dashboard</h1>

      {userIdentity && (
        <>
          <Link href={flowData}>LOGOUT</Link>
          <br />
          <Link href="/settings">Settings</Link>

          <JsonView
            src={userIdentity}
            style={{ fontSize: "20px", marginTop: "30px" }}
            enableClipboard={false}
            displayDataTypes={false}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const allCookies = context.req.headers.cookie;

  let flowData: string | void;

  if (allCookies) {
    const data = await kratos
      .createSelfServiceLogoutFlowUrlForBrowsers(allCookies)
      .then(({ data }) => {
        return data.logout_url;
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

export default DashboardPage;
