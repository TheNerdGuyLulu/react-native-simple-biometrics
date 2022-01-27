/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect } from "react";
 import { Button, NativeEventEmitter, NativeModules, SafeAreaView, StyleSheet, Text } from "react-native";
 import { AuthenticationPolicy, ReactNativeSimpleBiometrics } from "react-native-simple-biometrics";
 
 const App = () => {
   const [timeFailed, setTimesFailed] = React.useState(0);
   const auth = ReactNativeSimpleBiometrics.of(AuthenticationPolicy.Biometric);
 
   const verify = async () => {
     setTimesFailed(0); // Reset times failed
     try {
       const can = await auth.canAuthenticate();
       if (can) {
         try {
           const success = await auth
             .setConfirmationRequired(false)
             .authenticate("Title", "Message", "Negative");
           console.log(success);
         } catch (err) {
           console.log(err);
         }
       }
     } catch (canError) {
       console.log(canError);
     }
   };
 
   useEffect(() => {
     // Listen for authentication failures
     const eventEmitter = new NativeEventEmitter(NativeModules.RNBiometrics);
     const eventListener = eventEmitter.addListener(
       'AuthenticationFailed',
       event => {
         setTimesFailed(times => times + 1); // Increment times failed
       },
     );
     return () => {
       eventListener.remove();
     };
   }, []);
 
   return (
     <SafeAreaView style={styles.container}>
       <Text>Times failed: {timeFailed}</Text>
       <Button title={"AUTHENTICATE"} onPress={verify} />
     </SafeAreaView>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: "center",
     alignItems: "center",
   },
 });
 
 export default App;
 