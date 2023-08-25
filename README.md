# Chatter

A chatting app named Chatter.

### Introduction 
This is the front end of the Chatter App. This provides an interactive and eye-catching UI for the users. The Landing Page of the app is the following: 
![landing](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/2b75892c-9583-41e4-874f-d7582097a9f1)
The Sign Up page looks like the following : 
![singup](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/30048e98-9dc1-49e0-aeb5-e8c9bd0b3da7)
Users will not be allowed to sign up with an emaill that is already registered and will be alerted to enter a new one.
![registration](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/f060d523-eccf-46d7-b5f7-bb4be1ccd6d1)
The Sign In page loooks like the following: 
![singin](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/cf1306bb-4324-4786-84ed-0e9a161af21b)
If the user attempts to sign in using an unregistered email, alert will we shown for email not found and similarly if the password do not match
![credentials1](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/38cec121-0b70-4e51-9757-c9d9f026fd10)
![credentials2](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/cfe76093-f1a8-4767-907d-f16da379ef6a)
Upon successful signign in, the user will be routed to the following dashboard page:
![dashboard](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/dc11b12c-8bff-4e63-bb56-202e8ddb0197)
The dashboard displays the user's name and the channels they are a part of. They will be able to add new channels by clicking the + button besides Channels
![channeladd1](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/34110e38-04b0-4fe4-974b-e74d7a2d9123)
![channeladd2](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/59d3b1f2-e3b0-42e8-bed5-4321c477cf38)
After the Channel has been added, the Dashboard will display the added channel.
![channel1](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/6e136d02-0ae9-47d9-9b32-ef2fbd70f4c6)
Users will be able to add Members to the channel by clicking + button besides the channel name. It will open up a search box where the user will have to enter the email of the user they wish to add. As they type, matching emails will be shown below the searchbox and users can click on one of them to select and click on the add button and the user will be added.
![channel2](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/4d2348f8-97ed-4832-abaf-433836b0b3fd)
Upon clicking on a Channel, messages belonging to that channel will populate on the screen. Users can type in and send newer messages. 
![channel3](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/9f49075b-f468-4d07-bde7-78f6af461e24)
The sent message will be rendered on the screen real-time on other logged users screen as seen in the following dahboard of another logged in user:
![channel4](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/108b9178-d119-4423-b53d-178a948e506d)
![channel5](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/786dfab1-619d-437c-a6cb-84312a0eaaea)
![channel6](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/4793be0f-f2c3-4911-b25b-5665d3c0e154)
Users can visit their profile by clicking the Profile button on the Dashboard.
![profile](https://github.com/aniketmu/C-Project-Frontend/assets/135434733/5b4140f0-b851-4cd7-a178-d6f092084918)
Here they can choose to assign themselves an avatar.
Upon clicking the Sign Out button on the dashboard, the user will be logged out and taken to the Sign In page.

### Technologies Used

A list of technologies used within the project:

* [HTML](https://html.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [React.JS](https://nodejs.org/en)
* [Redux](https://redux.js.org/)

## Installation

A little intro about the installation. 
```
$ git clone https://github.com/aniketmu/final-project-frontend.git
$ cd /app
$ npm install
$ npm start

````
### Deployment 
The app has been deployed on [Netlify.com](https://c-project-frontend.onrender.com)
