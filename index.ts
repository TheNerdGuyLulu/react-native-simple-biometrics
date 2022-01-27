import { NativeModules, Platform } from "react-native";

const { RNBiometrics: RNBiometricsNative } = NativeModules;

export enum AuthenticationPolicy {
  Biometric = "Biometric",
  BiometricOrPasscode = "BiometricOrPasscode",
  Passcode = "Passcode"
}

export enum AuthenticationResultType {
  Unknown = -1,
  Passcode = 1,
  Biometric = 2
}

const isIOS = Platform.OS === "ios";
const isAndroid = Platform.OS === "android";

export class ReactNativeSimpleBiometrics {
  private policy: AuthenticationPolicy = AuthenticationPolicy.BiometricOrPasscode;
  private confirmationRequired: boolean = true;

  private constructor(policy: AuthenticationPolicy) {
    this.policy = policy;
  }

  public canAuthenticate(): Promise<boolean> {
    if (isIOS || isAndroid) {
      return RNBiometricsNative.canAuthenticate(this.policy);
    } else {
      throw new Error("Unsupported platform");
    }
  }

  public setConfirmationRequired(confirmationRequired: boolean): ReactNativeSimpleBiometrics {
    this.confirmationRequired = confirmationRequired;
    return this;
  }

  public authenticate(promptTitle: string, promptMessage: string, negativeButtonMessage?: string): Promise<string | AuthenticationResultType> {
    if (typeof promptTitle !== "string" || !promptTitle) {
      throw new Error("prompt title must be a non empty string");
    }

    if (typeof promptMessage !== "string" || !promptMessage) {
      throw new Error("prompt message must be a non empty string");
    }

    if (this.policy === AuthenticationPolicy.Biometric && typeof negativeButtonMessage !== "string" && !negativeButtonMessage) {
      throw new Error("negative button message must be a non empty string");
    }

    if (isIOS) {
      return RNBiometricsNative.requestBioAuth(promptTitle, promptMessage, this.policy);
    } else if (isAndroid) {
      return RNBiometricsNative.requestBioAuth(promptTitle, promptMessage, negativeButtonMessage, this.confirmationRequired, this.policy);
    } else
      throw new Error("Unsupported platform");
  }

  public static of(policy: AuthenticationPolicy): ReactNativeSimpleBiometrics {
    if (policy === AuthenticationPolicy.Passcode && isIOS) {
      throw new Error("Passcode authentication is not supported on iOS");
    }
    return new ReactNativeSimpleBiometrics(policy);
  }
}