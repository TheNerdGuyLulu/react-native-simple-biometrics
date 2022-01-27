"use strict";
exports.__esModule = true;
exports.ReactNativeSimpleBiometrics = exports.AuthenticationResultType = exports.AuthenticationPolicy = void 0;
var react_native_1 = require("react-native");
var RNBiometricsNative = react_native_1.NativeModules.RNBiometrics;
var AuthenticationPolicy;
(function (AuthenticationPolicy) {
    AuthenticationPolicy["Biometric"] = "Biometric";
    AuthenticationPolicy["BiometricOrPasscode"] = "BiometricOrPasscode";
    AuthenticationPolicy["Passcode"] = "Passcode";
})(AuthenticationPolicy = exports.AuthenticationPolicy || (exports.AuthenticationPolicy = {}));
var AuthenticationResultType;
(function (AuthenticationResultType) {
    AuthenticationResultType[AuthenticationResultType["Unknown"] = -1] = "Unknown";
    AuthenticationResultType[AuthenticationResultType["Passcode"] = 1] = "Passcode";
    AuthenticationResultType[AuthenticationResultType["Biometric"] = 2] = "Biometric";
})(AuthenticationResultType = exports.AuthenticationResultType || (exports.AuthenticationResultType = {}));
var isIOS = react_native_1.Platform.OS === "ios";
var isAndroid = react_native_1.Platform.OS === "android";
var ReactNativeSimpleBiometrics = /** @class */ (function () {
    function ReactNativeSimpleBiometrics(policy) {
        this.policy = AuthenticationPolicy.BiometricOrPasscode;
        this.confirmationRequired = true;
        this.policy = policy;
    }
    ReactNativeSimpleBiometrics.prototype.canAuthenticate = function () {
        if (isIOS || isAndroid) {
            return RNBiometricsNative.canAuthenticate(this.policy);
        }
        else {
            throw new Error("Unsupported platform");
        }
    };
    ReactNativeSimpleBiometrics.prototype.setConfirmationRequired = function (confirmationRequired) {
        this.confirmationRequired = confirmationRequired;
        return this;
    };
    ReactNativeSimpleBiometrics.prototype.authenticate = function (promptTitle, promptMessage, negativeButtonMessage) {
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
        }
        else if (isAndroid) {
            return RNBiometricsNative.requestBioAuth(promptTitle, promptMessage, negativeButtonMessage, this.confirmationRequired, this.policy);
        }
        else
            throw new Error("Unsupported platform");
    };
    ReactNativeSimpleBiometrics.of = function (policy) {
        if (policy === AuthenticationPolicy.Passcode && isIOS) {
            throw new Error("Passcode authentication is not supported on iOS");
        }
        return new ReactNativeSimpleBiometrics(policy);
    };
    return ReactNativeSimpleBiometrics;
}());
exports.ReactNativeSimpleBiometrics = ReactNativeSimpleBiometrics;
