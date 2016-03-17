# Provider
* Providers are the receptionist. We are assuming that receptionist puts a computer on the counter of their office to allow incoming visitors to check into their appointments. Behind the desk, the receptionist has his or her own computer to manage their dashboard and visitor queue. This is the repo for that site.

## Getting Started
* This is the Google Drive of the designs: https://drive.google.com/open?id=0B8EQqP8JqXojYThXYm9HcGdtSHM
* Make your own branch

# Instructions
1. Delete your current project folder, and everything in it.
2. Navigate to your desired folder, and create a new folder for this project (i.e. fourtify-provider)
3. cd into the folder: `cd fourtify-api`
4. Clone the repo into this folder: `git clone https://github.com/Fourtify/fourtify-provider.git .`
5. `npm install` or `sudo npm install`
6. `bower install`
7. Make a file called ".env" -- `vim .env`
8. Paste the following content:
```

EXPRESS_SECRET=FOURTIFY
NODE_ENV=development
PORT=3003
NODE_TLS_REJECT_UNAUTHORIZED=0

```
9. `npm start`

10.  Follow the instructions to start the api here: https://github.com/Fourtify/fourtify-api

11.  You can test locally by opening "domain.localhost:3003" where "domain" is an existing provider name on fourtify.us
## Resources
* Font- Open Sans: https://www.google.com/fonts#UsePlace:use/Collection:Open+Sans
* Ion icons: http://ionicons.com/

## Team Members
* Winnie Xu
* Jessica Cui
