import { NextPageContext } from "next";

export function getFlowAndCookies(ctx: NextPageContext) {
  return {
    cookies: ctx.req.headers.cookie,
    flowId: ctx.query.flow,
  };
}

export function redirect(url: string) {
  return {
    redirect: {
      destination: url,
    },
  };
}
