export default RNBiometrics;
declare namespace RNBiometrics {
    export enum AuthenticationPolicy {
        Biometric = "LAPolicyDeviceOwnerAuthenticationWithBiometrics",
        BiometricOrPasscode = "LAPolicyDeviceOwnerAuthentication"
    }

    /**
     * request biometric authentication
     *
     * note: promise will resolve when successful
     * but will be rejected when not with an error message
     *
     * @param {string} promptTitle - title of prompt (can be empty)
     * @param {string} promptMessage - The app-provided reason for requesting authentication, which displays in the authentication dialog presented to the user.
     * @param {"LAPolicyDeviceOwnerAuthenticationWithBiometrics" | "LAPolicyDeviceOwnerAuthentication"} policy - The policy of authentication to use.
     * * @returns {Promise<boolean>}
     */
    export function requestBioAuth(promptTitle: string, promptMessage: string, policy?: "LAPolicyDeviceOwnerAuthenticationWithBiometrics" | "LAPolicyDeviceOwnerAuthentication"): Promise<boolean>;

    /**
     * check if authentication is possible
     *
     * @param {"LAPolicyDeviceOwnerAuthenticationWithBiometrics" | "LAPolicyDeviceOwnerAuthentication"} policy - The policy of authentication to use.
     * @returns {Promise<boolean>} result
     */
    export function canAuthenticate(policy?: "LAPolicyDeviceOwnerAuthenticationWithBiometrics" | "LAPolicyDeviceOwnerAuthentication"): Promise<boolean>;
}
