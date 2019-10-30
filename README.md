# Convert File Extension

### What ?
It helps to convert Javascript(js) file extension to other given extension name from user provided folder to some random folder name created in same directory as user provided folder.

### Why ?
When i was developing a side project, i was not able to send js files in mail to client. So i have to convert some js files to another format and send it. Manually doing this work, consumes time in respect to daily scenarios. So i wished to make a program for this concern.

### How to use?
**Software needed: Nodejs **

Just place the given index.js next to the to-be converted folder and run "**node index.js to-be-convert-folder extension-without-dot"
  
  Example: if you want to convert Angular folder which is in Desktop. Then place the index.js in Desktop, open the command prompt and change directory to Desktop and 
  > **type "node index.js C:users/Desktop/Angular jsx"**
  
  In seconds, new folder will be created in name of some random number attached to Angular like **Angular6.20** and you can see the all files which are in **js** are converted to **jsx**, even in nested folders. Other file extensions are remain same and copied to same folders as it was placed.

### Note: For now it was tested only in Windows machine.
