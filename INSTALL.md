# Dependencies

The Switchboard depends on a registry of compatible tools, freely available online at
[https://github.com/clarin-eric/switchboard-tool-registry](https://github.com/clarin-eric/switchboard-tool-registry).
Cloning this repository is required. The default settings require it to have the same parent directory as the switchboard.

# Build and run for production

1. Download the sources from github:

   ```git clone https://github.com/clarin-eric/switchboard.git```

2. Build the application's docker image:

   ```make build-docker-image```

3. Run the Docker image (but replace /PATH/TO with a real path):

   ```docker run --name switchboard -d -p 8080:8080 -v /PATH/TO/switchboard-tool-registry:/switchboard-tool-registry:ro switchboard/switchboard:latest ```

   (this may depend on your local computing environment).

4. Go to [http://localhost:8080](http://localhost:8080) in your browser to get access to the switchboard.

# Build and run for development

1. Download the sources from github, e.g.,

   ```git clone https://github.com/clarin-eric/switchboard.git```

2. Build the application's backend, and start it on port 8080:

   ```make run-backend```

   Alternatively, the backend can be started from an IDE like Eclipse or IntelliJ IDEA.

3. Get the dependencies if it's the first time running the frontend:

   ```make dependencies```

4. Build the frontend with webpack in hot development mode:

   ```make run-webui-dev-server```

5. Go to [http://localhost:8081](http://localhost:8081) in your browser to get access to the switchboard.
   Any change in the frontend code will trigger an automatic recompilation and browser refresh.
   Changing the backend java code requires a restart of the backend.
