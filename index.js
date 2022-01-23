import {NativeModules} from "react-native";

const {RNBiometrics: RNBiometricsNative} = NativeModules;


const AuthenticationPolicy = {
    Biometric: "LAPolicyDeviceOwnerAuthenticationWithBiometrics",
    BiometricOrPasscode: "LAPolicyDeviceOwnerAuthentication"
}

/**
 * check if authentication is possible
 *
 * @param {"LAPolicyDeviceOwnerAuthenticationWithBiometrics" | "LAPolicyDeviceOwnerAuthentication"} policy - The policy of authentication to use.
 * @returns {Promise<boolean>} result
 */
const canAuthenticate = (policy = AuthenticationPolicy.BiometricOrPasscode) => {
    return RNBiometricsNative.canAuthenticate(policy);
};

/**
 * request biometric authentication
 *
 * note: promise will resolve when successful
 * but will be rejected when not with an error message
 *
 * @param {string} promptTitle - title of prompt (can be empty)
 * @param {string} promptMessage - The app-provided reason for requesting authentication, which displays in the authentication dialog presented to the user.
 * @param {"LAPolicyDeviceOwnerAuthenticationWithBiometrics" | "LAPolicyDeviceOwnerAuthentication"} policy - The policy of authentication to use.
 * @returns {Promise<boolean>}
 */
const requestBioAuth = (promptTitle, promptMessage, policy = AuthenticationPolicy.BiometricOrPasscode) => {
    if (typeof promptTitle !== "string" || !promptTitle) {
        throw new Error("prompt title must be a non empty string");
    }

    if (typeof promptMessage !== "string" || !promptMessage) {
        throw new Error("prompt message must be a non empty string");
    }

    return RNBiometricsNative.requestBioAuth(promptTitle, promptMessage, policy);
};

const RNBiometrics = {
    AuthenticationPolicy,
    requestBioAuth,
    canAuthenticate,
};

export default RNBiometrics;
