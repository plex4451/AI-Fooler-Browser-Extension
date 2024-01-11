# AI-Fooler-Browser-Extension

## Installation
Since there is currently no release version of the extension available, installation is done in developer mode in a browser.

1. Download the entire source code.
2. Extract the archive to a location of your choice.
3. Open Chrome or a Chromium browser.
4. Enter `chrome://extensions` in the address bar and press Enter.
5. Enable developer mode by toggling the switch in the upper right corner.
6. The 'Load unpacked' option will now appear.
7. Click on 'Load unpacked' and select the extension folder.
8. The extension should now be visible in the list of extensions.

Next, communication with the Python script needs to be established using the Native Messaging Host.
The file `ai_detector_fooler.json` in the extension folder must be placed in a specific location depending on the operating system.
Before that, open the file and replace the path `"/path/to/browser_communication.py"` in the script for 'AI-Detector-Fooler'
with the correct path to `"browser_communication.py"`, which is in the Python script folder. If you haven't downloaded the script yet,
you can find it [here](https://gitlab.uni-hannover.de/informaticup-2024/gruppe-7/ai-dector-fooler).

After successfully changing the path, follow the steps according to your operating system.

**Windows**
On Windows, the manifest file can be located anywhere in the file system. The app installer needs to create a registry key and set the default value of this key to the full path of the manifest file. Use the following command, for example:
```bash
REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\ai_detector_fooler" /ve /t REG_SZ /d "C:\path\to\ai_detector_fooler.json" /f
```
**macOS & Linux**

On macOS and Linux, the location of the native messaging host's manifest file varies depending on the browser (Google Chrome or Chromium). Move the file to the correct location for you.

**macOS:**
- Google Chrome: `/Library/Google/Chrome/NativeMessagingHosts/ai_detector_fooler.json`
- Chromium: `/Library/Application Support/Chromium/NativeMessagingHosts/ai_detector_fooler.json`

**Linux (systemwide):**
- Google Chrome: `/etc/opt/chrome/native-messaging-hosts/ai_detector_fooler.json`
- Chromium: `/etc/chromium/native-messaging-hosts/ai_detector_fooler.json`

Congratulations! The extension is now successfully installed.


