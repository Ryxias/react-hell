# Running the Webserver

## Step 0: Get SSH access to the server
Test out your ssh connection:

```bash
$ ssh [username]@machine.chuuni.me
```

You should be able to get in. If this step doesn't work go contact the admins!

## Step 1: Get your code onto the server

There should be some convenience deploy scripts that synchronize the code on your laptop onto
the remote machine:

```bash
$ bin/devsync
```

Or 

```bash
$ bin/kevin/deploy
```

Or w/e

You should see a bunch of files getting transferred back and forth. Yay! They should be located
on the `~/repos/chuuni` directory.


## Step 2: Install Node Packages

SSH onto the webserver machine.

```bash
$ cd ~/repos/chuuni
$ npm install
```

Simple as that

## Step 3: Boot the Webserver

It's easy. Just run 

```bash
$ npm start
```

While you're in the `~/repos/chuuni` directory. This will start the webserver, and the URL 
https://chuuni.me will start responding to your code.


## Step 3.1: Wait... "Error: listen EADDRINUSE :::80" error??
This means someone else is running the webserver (probably).

You can either be nice and text/slack/iMessage them and ask them to turn it off.

Or you can forcefully kick them out :). Use `ps aux | grep node`

```bash
[USER@ip-172-31-31-81 chuuni]$ ps aux | grep node
root     13496  0.0  0.0 186216   648 pts/5    S+   Mar27   0:00 sudo NODE_ENV=production nodemon server/server.js
root     13497  0.0  1.9 1184912 19956 pts/5   Sl+  Mar27   0:01 node /usr/bin/nodemon server/server.js
ryxias   26489  0.0 14.8 1329680 151360 pts/1  Sl+  04:56   0:19 node /usr/bin/webpack --config=webpack.config.js -d --watch
root     27338  0.0  6.5 1245880 66132 pts/5   Sl+  05:40   0:07 node server/server.js
503      29634  0.0  0.1 110468  1996 pts/2    S+   18:57   0:00 grep --color=auto node
```

The SECOND line is what you're looking for (`node /usr/bin/nodemon ...`). Kick them out by running a kill command.

```bash
$ sudo kill 13497
```

Now you should be OK to run `npm start`.


# Onboarding New People

https://www.helicaltech.com/create-multiple-sudo-users-to-ec2-amazon-linux/


## Whitelist their IP Address

Google: "whatsmyipaddress"

## Make a new User

```bash
$ sudo useradd [USERNAME]
```


## Get their SSH Key on `~/.ssh/authorized_keys`

Make sure permissions look like this:
```bash
drwx------   2 USER GROUP 4096 Mar 30 18:32 .ssh
```

```bash 
-rw-------   1 USER GROUP 1490 Mar 30 18:32 authorized_keys
```

## Give them Sudo Privileges

Add the user to this file:

`/etc/sudoers.d/custom`

Use `visudo`

```bash
$ sudo visudo -f /etc/sudoers.d/custom 
```

```bash
ryxias ALL=(ALL) NOPASSWD: ALL
nico ALL=(ALL) NOPASSWD: ALL
thekevinwang ALL=(ALL) NOPASSWD: ALL
```
