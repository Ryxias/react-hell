# PM2 Documentation
## Introduction
Our current development workflow for this web application is as follows:

1. Commit and push to remote repository at github
2. Check out local master branch and bring it up-to-date
3. Synchronize the updated local files with the files in the instance via `rsync`
4. Shut down all server processes, as they can take up a lot of memory required for updates to run properly (i.e. webpack).
5. If new packages were used, run `npm install` in the instance.
6. Restart the server processes after updates.
7. Run the unit tests if necessary.

Running this entire procedure can be time-consuming and be troublesome if done unproperly.  PM2 Node.js process manager can be used as an automated solution to streamline this workflow process and guarantee that each of these step run in order efficiently with little required interaction by the user.

## Objectives

PM2 provides the following features that can be beneficial for our workflow, which will be explained in further details:

1. Shared process management
2. Auto-restart of server processes upon memory threshold
3. Detailed real-time monitoring

### Shared Process Management

Currently, we use `ps aux | grep` commands to snapshot monitor the server processes.  It provides system information about each process such as process id, CPU/memory usage and more.  The problem with this however is that if one is not familiar with using `ps aux` would not appreciate the spartan user interface that it uses.  PM2 addresses this by providing a clean user interface and removing the extraneous information that the user usually do not use.  `pm2 ls` is the PM2 command replacement for `ps aux`:

```
$ pm2 list
│ App name │ id │ mode │ pid   │ status │ restart │ uptime │ memory      │ watching │
-------------------------------------------------------------------------------------
│ homepage │ 0  │ fork │ 39535 │ online │ 0       │ 31m    │ 86.355 MB   │ disabled │
``` 

#### 1. Starting/Restarting a Process
To start a node application via PM2:

```
pm2 start <app>.js --name <name of process>
```
Note the `<name of process>` .  You can provide a nickname for each process so you can manage it using that nickname instead of its process id.

To restart a server process, instead of using `ps aux | grep <process name>` in order to find the process id and use it to kill the process, you can simply run the following commands:

```
pm2 restart <name of process>
```
where `<name of app>` is the nickname you provided for the application.

You can also automatically restart the processes based on a memory limit:

```
pm2 start <application> --max-memory-restart <memory size>
```
Units for memory size can be in `K`(ilobyte), `M`(egabyte), or `G`(igabyte), i.e. `20M`.

#### 2. Killing/Stopping a Process

To kill a managed process and completely remove it from the PM2 process list, you can simply run:

```
pm2 delete <name of process>
```
where `<name of app>` is the nickname you provided for the application.

You can also stop a process, halting its execution but keeping it in the managed list by running:

```
pm2 stop <name of process>
```
where `<name of app>` is the nickname you provided for the application.

### Monitoring

PM2 can also provide metrics about each process in a clean user interface versus using `ps aux`, which can be an overload of information. Like other monitoring tools, PM2 provides CPU and memory usage.  However, it also provides other metrics for each process not shown in other monitoring tools such as:

1. Number of restarts
2. Process uptime (in seconds)
3. Number of currently active requests
3. Total requests per minute
4. Average HTTP latency

To see the general metrics above, run the following command:

```
pm2 monit
```

![](https://pm2.io/doc/img/runtime/monit.png)

