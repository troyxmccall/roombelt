This is plan for manual tests run before every release. 

## Preparations
1. Go to https://myaccount.google.com/permissions and remove Roombelt
2. Clear up browser cookies for Roombelt domain

## Sign in
1. Open home page, click "Log in to admin panel". Deny access to your account. You should be redirected back to home page.
2. Open home page, click "Log in to admin panel". Allow access. You should see Roombelt dashboard.

## Admin panel
1. Click "Get help". You should see Roombelt docs.
2. Click "Connect device" and click Close.
3. Click "Connect device" and put some arbitrary connection code. Click "Next". You should see message "Invalid connection code".

### Connect device
1. In another browser (so that it doesn't have Roombelt cookies) open Roombelt and click "Register device".
1. Put this code to connect device in admin panel.
1. Ensure that the device window shows "No calendar has been selected for this device". 
1. Choose some calendar and pick english language. Click "Voila". You should see device on the devices list in admin panel.
1. Ensure that device browser shows calendar view.

### Edit device
1. In admin panel click connected device to edit it. Pick another calendar and click "OK". After 30s ensure that the calendar has changed in the device browser window.
2. In admin panel click connected device to edit it. Pick polish language and click "OK". After 30s ensure that the language has changed in the device browser window.
3. In admin panel click connected device to edit it. Change clock type and click "OK". After 30s ensure that the clock type has changed in the device browser window.

## Device

1. Ensure that displayed time is valid.
### Create & extend
1. Click "15 min" to start a meeting. Ensure that start and end time are valid.
2. Click "End now" and "Cancel". You should see the "Extend" screen.
3. Click "+15 min". Validate that the meeting end time is valid.
4. Click "+1h". Validate that the meeting end time is valid.
5. Click "End now" and "Confirm".

### Create 1h meeting
1. Click "1h". Ensure that start and end time is valid.
2. Click "End now" and "Confirm".
    
### time left - 2h
1. Go to Google Calendar and remove all meetings for today.
2. Create a meeting in Google Calendar in 2h. Wait 30s and validate that this meeting is visible in device screen.
3. Click "Create 15min". Click "Extend 30min" and "Extend 15min". Ensure that only relevant buttons for meeting extension are visible.

### 10 minutes
1. Go to Google Calendar and remove all meetings for today.
2. Create a meeting in Google Calendar in 10 minutes. Wait 30s and validate that this meeting is visible in device screen.
3. Click "Create". Ensure that the 10 minutes meeting has been created.

### Start early 
1. Go to Google Calendar and remove all meetings for today.
2. Create a meeting without a title in Google Calendar in 4 minutes. 
3. Wait 30s and validate that the "Start early" button is visible.
4. Click "Start early".

### Cancel meeting that will start
1. Go to Google Calendar and remove all meetings for today.
2. Create a meeting in Google Calendar in 4 minutes.
3. Wait 30s and validate that the "Check in" button is visible.
4. Click "Cancel meeting" and "Back".
5. Click "Cancel meeting" and "Confirm".

### Check in
0. Ensure that for your device you have "Require check-in" options selected
1. Go to Google Calendar and remove all meetings for today.
2. Create a meeting started 5 minutes ago in Google Calendar.
3. Wait 30s and validate that the "Check in" button is visible.
4. Click "Check in".

### Remove meeting automatically
0. Ensure that for your device you have "Require check-in" options selected
1. Go to Google Calendar and remove all meetings for today.
2. Create a meeting started 9 minutes ago in Google Calendar.
3. Wait till it's 10 minutes after the meeting started, don't check-in
4. The meeting should be removed automatically

### Cancel meeting that already started. 
1. Go to Google Calendar and remove all meetings for today.
2. Create a meeting started 5 minutes ago in Google Calendar.
3. Wait 30s and validate that the "Check in" button is visible.
4. Click "Cancel meeting" and "Back.
5. Click "Cancel meeting" and "Confirm".

### Recurring events
1. Go to Google Calendar and remove all meetings for today.
1. Create a recurring event from the last week starting 10 minutes before now.
1. Wait 30s and validate that the "Check in" button is visible.
1. Check-in to this meeting.
1. Extend the meeting by 30 minutes.
1. Validate that only this instance of recurring meeting is altered.
1. End meeting.
1. Validate that only this instance of recurring meeting is altered.

### Full screen
1. On device window click "Full screen". 
2. The app should move full screen and the "Full screen" link should disappear.
3. Press escape. The browser chrome should be visible and "Full screen" link should appear again.

### Offline - actions
1. Open chrome dev tools and switch to offline. 
2. Click any action button. The "Unable to connect to the server" screen should appear.
3. Click "Refresh page". The offline screen should appear again.
4. Switch to online. Regular device view should appear after 30s.

### Offline - wait
1. Open chrome dev tools and switch to offline. 
2. Wait 30s. Offline screen should appear.
3. Switch back to online. Wait 30s. Online screen should appear.

## Admin panel 2
### Disconnect device
1. Open Admin panel
2. Click actions menu for calendar and select Disconnect.
3. Click cancel.
4. Click actions menu for calendar and select Disconnect.
5. Click "Disconnect"
6. Verify that device browser shows information that the device has been removed.
7. Refresh device browser and verify that the "removed device" message is still shown.
8. Click "OK" and connect device again.
