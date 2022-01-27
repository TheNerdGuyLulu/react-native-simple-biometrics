package com.smallcase.rnbiometrics;

import android.app.Activity;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.concurrent.Executor;

public class RNBiometricsModule extends ReactContextBaseJavaModule {
    static final int BIOMETRIC_AUTH = BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.BIOMETRIC_WEAK;
    static final int PASSCODE_AUTH = BiometricManager.Authenticators.DEVICE_CREDENTIAL;
    static final int BIOMETRIC_OR_PASSCODE_AUTH = BIOMETRIC_AUTH | PASSCODE_AUTH;

    public RNBiometricsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNBiometrics";
    }

    @ReactMethod
    public void canAuthenticate(final String authenticators, final Promise promise) {
        try {
            final ReactApplicationContext context = getReactApplicationContext();
            final BiometricManager biometricManager = BiometricManager.from(context);

            int authType = 0;

            switch (authenticators) {
                case "Biometric":
                    authType = BIOMETRIC_AUTH;
                    break;
                case "BiometricOrPasscode":
                    authType = BIOMETRIC_OR_PASSCODE_AUTH;
                    break;
                case "Passcode":
                    authType = PASSCODE_AUTH;
            }

            final int res = biometricManager.canAuthenticate(authType);
            final boolean can = res == BiometricManager.BIOMETRIC_SUCCESS;

            promise.resolve(can);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void requestBioAuth(final String title, final String subtitle, final String negativeButton, final boolean isConfirmationRequired, final String authenticators, final Promise promise) {
        UiThreadUtil.runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        try {
                            final ReactApplicationContext context = getReactApplicationContext();
                            final Activity activity = getCurrentActivity();
                            final Executor mainExecutor = ContextCompat.getMainExecutor(context);
                            final BiometricPrompt.AuthenticationCallback authenticationCallback = new BiometricPrompt.AuthenticationCallback() {
                                @Override
                                public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                                    super.onAuthenticationError(errorCode, errString);
                                    promise.reject(new Exception(errString.toString()));
                                }

                                @Override
                                public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                                    super.onAuthenticationSucceeded(result);
                                    promise.resolve(result.getAuthenticationType());
                                }

                                @Override
                                public void onAuthenticationFailed() {
                                    super.onAuthenticationFailed();
                                    context
                                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                            .emit("AuthenticationFailed", "Failed");
                                }
                            };

                            if (activity != null) {
                                final BiometricPrompt prompt = new BiometricPrompt((FragmentActivity) activity, mainExecutor, authenticationCallback);

                                final BiometricPrompt.PromptInfo.Builder promptInfo = new BiometricPrompt.PromptInfo.Builder()
                                        .setTitle(title)
                                        .setConfirmationRequired(isConfirmationRequired)
                                        .setSubtitle(subtitle);

                                switch (authenticators) {
                                    case "Biometric":
                                        promptInfo.
                                                setNegativeButtonText(negativeButton)
                                                .setAllowedAuthenticators(BIOMETRIC_AUTH);
                                        break;
                                    case "BiometricOrPasscode":
                                        promptInfo.
                                                setAllowedAuthenticators(BIOMETRIC_OR_PASSCODE_AUTH);
                                        break;
                                    case "Passcode":
                                        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.Q) {
                                            promptInfo
                                                    .setAllowedAuthenticators(PASSCODE_AUTH);
                                        } else {
                                            throw new Exception("Passcode only available for Android 10 and up");
                                        }
                                        break;
                                }

                                prompt.authenticate(promptInfo.build());
                            } else {
                                throw new Exception("null activity");
                            }
                        } catch (Exception e) {
                            promise.reject(e);
                        }
                    }
                }
        );
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
    }
}