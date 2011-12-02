IMPORTANT NOTICE!

Web browsers do not like it when files try to open other files on your computer that are not in the same directory as the file doing the opening. Because we would like to use heirarchy to store our scene assets we must turn off this saftey percaution on whichever browser you are going to be doing local testing. Once the files are on the server the requests will be work since it isn't trying to open a local file.

Chrome:
1) Close all instances of chrome running on your machine.
2) Locate your chrome.exe (windows usually located at C:\Users\USER_NAME\AppData\Local\Google\Chrome\Applicaltion\chrome.exe)
3) Now run command "chrome.exe --allow-file-access-from-files". This instance of chrome now will allow jquery to open local files in folders!!!

Firefox:
1) Open Firefox.
2) Go to "about:Config" in the address bar.
3) Click "I'll be careful, I promise!"
4) Change "security.fileuri.strict_origin_policy" to "false".
Firefox now will allow jquery to open local files in folders!!!

