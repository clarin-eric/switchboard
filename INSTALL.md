# Switchboard -- Used Technologies

The CLRS switchboard has been implemented with ReactJs and related technologies such as

- Webpack, a Javascript module bundler, see https://webpack.github.io Nodejs version 5.12.0 (see
- https://nodejs.org/en/), together with the javascript package manager npm (v3.8.6), see https://www.npmjs.com.

For the time being, the github contains all you need without recompiling anything. 
In the future, the directories node_modules/ and build/ will not be hosted on githib. They will be created with
'npm install' and 'webpack', respectively.

# Installation

1. Download the sources from github, e.g.,

      ```git clone https://github.com/clarin-eric/LRSwitchboard.git```

2. Enter the directory LRSwitchboard, and perform

      ```webpack```

   to re-build the build directory (if you need to)

   Opening build/index.html will open the LRS "locally".

3. Copy the contents of the build directory to the html folder of your webserver, e.g. (with clrs
now holding the contents of the build directory).

   ```cp -p build/* /var/www/clrs/```
   
4. Direct your browser to, say,

   ```http://weblicht.sfs.uni-tuebingen.de/clrs```

to have your web server serving the pages.


# DOCKERization

In the current directory (where Dockerfile resides), call:

```docker build --no-cache -t clrs-nginx-java```

This command will build a docker image that includes the entire content of the build directory (the
CLRS webpage).  It runs nginx as web server and has access to Java for running the Tika Apache
tools for language and mimetype identification.

Expose different ports, given your local computing environment.
