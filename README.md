This is guide to set up PMC Field App Project.

### Step 1: Install Required Software

1. **Node.js and npm**: Ensure you have Node.js and npm installed. You can download them from [Node.js official website](https://nodejs.org/).

2. **Android Studio**: Download and install [Android Studio](https://developer.android.com/studio).

3. JDK - Required to compile Java code.

### Step 2: Set Up Android SDK and Environment Variables

1. **Open Android Studio** and go to **SDK Manager** (`Configure > SDK Manager`).

2. **Install Android SDK**:

   - Ensure you have Android SDK Platform 33 (or the latest version) installed.
   - Check the box for `Android SDK Platform 33` in the SDK Platforms tab.
   - Click `Apply` to install.

3. **Set Up Environment Variables**:
   - Open your terminal and set the `ANDROID_HOME` environment variable to the Android SDK location.

### Step 3: Create and Start an Android Emulator

1. **Open Android Studio** and go to **AVD Manager** (`Configure > AVD Manager`).

2. **Create a new virtual device**:

   - Click on `Create Virtual Device`.
   - Select a device definition (e.g., Pixel 3) and click `Next`.
   - Select a system image (e.g., Q) and click `Next`.
   - Click `Finish` to create the virtual device.

3. **Start the Emulator**:
   - Click on the `Play` button next to your newly created virtual device in the AVD Manager to start the emulator.

### Step 4: Verify and Fix Issues Using `npx react-native doctor`

1. **Run the Doctor Command**:

   ```sh
   npx react-native doctor
   ```

2. **Fix Errors**:

   - If you see the error `Adb - No devices and/or emulators connected`, ensure that your emulator is running.
   - If you see the error `Android SDK - Required for building and installing your app on Android`, ensure that the Android SDK is properly installed and the `ANDROID_HOME` environment variable is set correctly & For this Error go to `Android Studio > More Action > SDK Manager > SDK Tools >  Android SDK Command Line Tools` (install & restart PC).

3. **Try to Fix Issues Automatically**:
   - Press `f` to try to fix issues automatically.
   - Press `e` to try to fix errors.

### Step 5: Initialize and Start Your React Native Project

1. **Initialize a New React Native Project**:

   ```sh
   git clone https://github.com/highway-pmc/pmcfieldapp.git
   cd pmcfieldapp
   ```

2. **Start the Metro Server**:

   ```sh
   npm start
   ```

3. **Run the Android App**:

   ```sh
   npm run android
   ```
## emulator -list-avds
## emulator -avd name-of-your-emulator
## adb -s RZ8M931M24D reverse tcp:8081 tcp:8081   # run on device

### npx react-native bundle --platform android --dev true --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
### cd android && ./gradlew assembleRelease
### https://stackoverflow.com/questions/35935060/how-can-i-generate-an-apk-that-can-run-without-server-with-react-native
