# Operation Manual


## Deployment

You can run this bash script on your local machine where you dev your code.

`$ bin/deploy`

You will need your `~/.ssh/config` setup properly, and using `ssh-add` to setup your keys will be convenient.


## Running the Web Server

SSH into the production box, machine.chuuni.me

`$ npm start`

You will need sudo permissions.  Also, if the webserver is currently running, you may have to kill the `nodemon`
process being run by others.


## Synchronizing the Database

`$ npm run sync_models`

Should take less than 1 second to run.  You can Ctrl+C out of it when done.
