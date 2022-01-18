export default RNBiometrics;
declare namespace RNBiometrics {
    export { requestBioAuth };
    export { canAuthenticate };
}
/**
 * request biometric authentication
 *
 * note: promise will resolve when successful
 * but will be rejected when not with an error message
 *
 * @param {string} promptTitle - title of prompt (can be empty)
 * @param {string} promptMessage - The app-provided reason for requesting authentication, which displays in the authentication dialog presented to the user.
 * @returns {Promise<boolean>}
 */
declare function requestBioAuth(promptTitle: string, promptMessage: string): Promise<boolean>;
/**
 * check if authentication is possible
 *
 * @returns {Promise<boolean>} result
 */
declare function canAuthenticate(): Promise<boolean>;
