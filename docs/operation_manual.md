# Operation Manual


# PRODUCTION
Production runs off of our production AWS instance, at machine.chuuni.me

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


# DEVELOPMENT
These are steps to running the website on a local OSX machine.


## Install Developer Tools
You will need things like `npm`, `git`, `ssh`, `brew`, etc. These come installed with OSX Developer Tools.
To check if they are installed, you can always use the `which` command.

```bash
$ which npm
/usr/local/bin/npm
```
If not installed, nothing will return


## Get the code
Use git to clone the repository locally. We recommend putting all git repositories in a local folder under `~/repos`

```bash
$ mkdir ~/repos
$ cd ~/repos
$ git clone git@github.com:Ryxias/chuuni.git
$ cd chuuni
```


## Install Dependencies
Chuuni has a large number of 3rd party javascript library dependencies. To install all of them, use `npm` while
in the repository directory:

```bash
$ npm install
```


## Setup your Configuration File
You will need a `config/config.js` file. In the `config/` directory, there is a file called `config.js.example`.
Copy paste it to a new file named `config.js` in the same directory.

## Setup your Database
Chuuni is powered by MySQL for its database. You will need the `mysql-server` process running on your local machine.
First, make sure `homebrew` is installed:

```bash
$ which brew
/usr/local/bin/brew
```
If not installed, nothing will return.
To install `homebrew`, copy/paste and run:

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
...and follow installation prompt.

Second, install `mysql`:

```bash
$ brew install mysql
```

It will show a bunch of installation crap before finishing. Now you need to start up your database server:

```bash
$ brew services start mysql
```

And you're done! You can test it out by attempting to connect to the database server:

```bash
$ mysql --user=root

Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.7.21 Homebrew

Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

Type `exit` to quit out.


## Start your Webserver
Now that all of your system dependencies have been setup, you need to run your webserver on your OSX machine.
Run the following command:

```bash
$ npm run dev
```

This will boot your server and it will begin to listen to requests. To stop your webserver, simply kill the process
with `Ctrl+C`.

**NOTE:** Anytime you want to access your webserver, you will need to run this command. I suggest running this in
separate terminal window. Whenever you make changes to the code, you will need to kill it and restart this process.


## Test out your Webserver
At this point, your webserver should be able to run and listen to incoming requests. Go to the following URL
to test out your application:

```url
http://localhost:8000/health
```

You should see some data regarding the health of your application. If everything is healthy then you're good to go!


## Compile the React App
The main website runs on a single React application. If you go to `http://localhost:8000` without compiling the
React app you may get a blank page.

To compile your react app, run this:

```bash
$ npm run webpack
```

Once compiled, it will create a new file in `public/dist/bundle.js`. It a gigantic ball of nonsense Javascript that
is used to run the React application.


## TROUBLESHOOTING

### This Site can't be reached
Your webserver is probably not running, or has crashed. Make sure to restart
