# PM2 Documentation
## Installation
PM2 can be installed via Node package manager (npm) using the following command:

```
npm install pm2 -g
```

### (Optional) CLI Autocompletion 
An optional tool for command autocompletion can be installed:

```
pm2 completion install
```

### Updating PM2
PM2 can be updated via:

```
npm install pm2 -g && pm2 update
```

### Source Map Support
Source map files are automatically detected by default if they are present.

## Process Management
### 1. Starting an Application
To start a node application via PM2:

```
pm2 start <app>.js --name "<name of app>"
```

This command can be added as part of a script command for `npm start` in `package.json`.

#### Auto Restart Application on File Change

### 2. Restarting an Application
To force restart an application managed by PM2:

```
pm2 restart <name of app>
```

This command can be added as part of a custom script command in `package.json`.

This command can be executed on multiple processes simultaneously.

### 3. Removing an Application
To remove an application from the PM2 process list:

```
pm2 delete <name of application>
```

This command can be added as part of a custom script command in `package.json`.

### 4. Listing PM2 Processes
To list all running processes managed by PM2:

```
pm2 ls [list|ls|l|status] [--sort name|id|pid|memory|cpu|status|update][:asc|desc]
```

To get more details on a specific process:

```
pm2 show <process id>
```

### 5. Max Memory Restart
A PM2 application can be automatically restarted based on a memory limit defined by the user:
#### CLI
```
pm2 start <application> --max-memory-restart <memory size>
```
Units can be in `K`(ilobyte), `M`(egabyte), or `G`(igabyte), i.e. `20M`.

### 6. Watch Mode
Watch mode is enabled via:

```
pm2 start <app> --watch
```

**Note: In order to stop a watched process, you must use the following as a simple stop or delete won't stop the watching:**

```
pm2 stop --watch <app>
```

## Monitoring
For detailed monitoring information of all PM2 processes:

```
pm2 monit
```

## Advanced Configuration
### 1. Ecosystem File and Setup
PM2 allows advanced configuration of PM2 functionality via a generated JS/JSON/YAML configuration 'ecosystem file'.

To generate this process file (in root project directory):

```
pm2 init
```

which generates `ecosystem.config.js`:

```
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

PM2 will automatically read the ecosystem file in the root directory for custom configurations.  

To force PM2 to read another ecosystem file:

```
pm2 start /path/to/ecosystem.config.js
```

### 2. Environment Variables

The ecosystem file can be set up with environment variable configurations:

#### Barebone Configuration

```
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {   // default environment
      NODE_ENV: "development",
    },
    env_production: {  // launched via 'pm2 start app --env production'
      NODE_ENV: "production",
    }
  }]
}
```

#### Watch and Restart

```
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    watch: true,
  }]
}
```

## Deployment with PM2
SSH access to the remote machine must be configured for this to work.  Consult your local overlord Derek for setting it up.

The `ecosystem.config.js` should be configured with all the necessary information, similar to the example below:

```
module.exports = {
  apps: [{
    name: "app",
    script: "app.js"
  }],
  deploy: {
    // "production" is the environment name
    production: {
      // SSH key path, default to $HOME/.ssh
      key: "/path/to/some.pem",
      // SSH user
      user: "ubuntu",
      // SSH host
      host: ["192.168.0.13"],
      // SSH options with no command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      ssh_options: "StrictHostKeyChecking=no",
      // GIT remote/branch
      ref: "origin/master",
      // GIT remote
      repo: "git@github.com:Username/repository.git",
      // path in the server
      path: "/var/www/my-repository",
      // Pre-setup command or path to a script on your local machine
      pre-setup: "apt-get install git ; ls -la",
      // Post-setup commands or path to a script on the host machine
      // eg: placing configurations in the shared dir etc
      post-setup: "ls -la",
      // pre-deploy action
      pre-deploy-local: "echo 'This is a local executed command'"
      // post-deploy action
      post-deploy: "npm install",
    },
  }
}
```

Then, you need to set up the deployment for the first time via:

```
pm2 deploy production setup
```

### Useful Deployment Commands
```
# Setup deployment at remote location
pm2 deploy production setup

# Update remote version
pm2 deploy production update

# Revert to -1 deployment
pm2 deploy production revert 1

# execute a command on remote servers
pm2 deploy production exec "pm2 reload all"

# Help
pm2 deploy help
```

For more information on PM2 Deployment, visit the [official documentation](https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh/).


## Installation and Usage in AWS Instance
PM2 will be installed in our AWS instance using the instructions above.  In order to share an advanced configuration for PM2, I will probably need to set up the `ecosystem.config.js` file in a shared folder such as `/etc/config`, which will most likely need `sudo` access to read and modify.  Monitoring and managing processes should be shared for PM2 vs. needing to do an explicit share via `screen`, which can potentially create a vulnerability [(Reference)](http://wiki.networksecuritytoolkit.org/index.php/HowTo_Share_A_Terminal_Session_Using_Screen).



