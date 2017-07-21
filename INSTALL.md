# Switchboard -- Used Technologies

The CLRS switchboard has been implemented with ReactJs and related technologies such as

- Webpack, a Javascript module bundler, see https://webpack.github.io Nodejs version 5.12.0 (see
- https://nodejs.org/en/), together with the javascript package manager npm (v3.8.6), see https://www.npmjs.com.

For the time being, the github contains all the source code for compiling. 
The directories node_modules/ and build/ are not hosted on GitHub. They must be created with
'npm install' and 'webpack', respectively.

# Installation

1. Download the sources from github, e.g.,

   ```git clone https://github.com/clarin-eric/LRSwitchboard.git```

2. Enter the directory LRSwitchboard, and perform

   ```npm install ```

and

   ```webpack ```
   

to build the build directory.

   Opening build/index.html will open the LRS "locally".

3. Copy the contents of the build directory to the html folder of your webserver, e.g. (with clrs
now holding the contents of the build directory).

   ```cp -p build/* /var/www/clrs/```
   
4. Direct your browser to, say,

   ```http://weblicht.sfs.uni-tuebingen.de/clrs ```

to have your web server serving the pages.


# DOCKERization (after the build process)

In the main directory, call

   ```make ```

This command will build a docker image that includes the entire content of the build directory (the
CLRS webpage).  It runs nginx as web server and has access to Java for running the Tika Apache
tools for language and mimetype identification. It uses supervisord to spawn/control the various processes.

Note that the nginx has a number of reverse proxies, see docker/nginx.conf. In particular, it gives access to
the file storage server at the MPG in Garching. All reverse-proxing aims at addressing CORS-related issues.

You can run the Docker image with

   ```docker run --name switchboard -d -p 9001:9001 -p 9998:9998 -p 80:80 clrs ```

or (with the docker image being available in the CLARIN docher hub, see Makefile)

   ```docker run --name switchboard -d -p 9001:9001 -p 9998:9998 -p 80:80 docker.clarin.eu/clrs:1.0.0 ```

(but this may depend on your local computing environment).

Open

   ```http://localhost ```

in your browser to get access to the switchboard.

The address

   ```http://localhost:9001 ```

gives access to the supervisor.

Note that -- for the standalone version of the switchboard (local uploading of resources) -- the host
running the docker container must be accessible from the outside so that tools connected to the
switchboard can fetch the resources from there.

# Current deployment of development server

Currently, the development version of the switchboard (most recent version) is deployed at

	   ```http://weblicht.sfs.uni-tuebingen.de/clrs-dev ```

This is reverse-proxied to

     	   ```<server-name>:4711/clrs-dev ```

On <server-name>, the command

   	   ```docker run --name switchboard -d -p 9001:9001 -p 9998:9998 -p 80:80 clauszinn/switchboard:0.9.8 ```

is run. This fetches the respective (public) Docker image from hub.docker.com and runs it.

