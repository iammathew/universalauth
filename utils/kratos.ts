import {
  Configuration,
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SelfServiceVerificationFlow,
  V0alpha1Api,
} from "@ory/kratos-client";
import { KRATOS_API_URL } from "./config";

const config = new Configuration({ basePath: KRATOS_API_URL });

/**
 * @description This initializes the Kratos client
 */
export const kratos = new V0alpha1Api(config);

export type SelfServiceFlow =
  | SelfServiceRegistrationFlow
  | SelfServiceRecoveryFlow
  | SelfServiceLoginFlow
  | SelfServiceSettingsFlow
  | SelfServiceVerificationFlow;
