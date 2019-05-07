package eu.clarin.switchboard.app;

import eu.clarin.switchboard.health.AppHealthCheck;
import eu.clarin.switchboard.resources.MiscResource;
import io.dropwizard.Application;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.server.DefaultServerFactory;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

public class SwitchboardApp extends Application<Config> {
    public static void main(String[] args) throws Exception {
        new SwitchboardApp().run(args);
    }

    TemplatedAssetsBundle assets;

    @Override
    public void initialize(Bootstrap<Config> bootstrap) {
        assets = new TemplatedAssetsBundle("/webui/", "/", "index.html", "static");
        bootstrap.addBundle(assets);
        bootstrap.setConfigurationSourceProvider(new SubstitutingSourceProvider(
                bootstrap.getConfigurationSourceProvider(), new EnvironmentVariableSubstitutor(false)));
    }

    @Override
    public void run(Config configuration, Environment environment) {
        String appContextPath = ((DefaultServerFactory) configuration.getServerFactory()).getApplicationContextPath();
        assets.setAppContextPathSubstitutions("index.html", appContextPath);

        MiscResource miscResource = new MiscResource(GitProperties.load("switchboard"));

        environment.getApplicationContext().setErrorHandler(new HttpErrorHandler());
//        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(miscResource);
        environment.jersey().setUrlPattern("/api/*");

        environment.healthChecks().register("switchboard", new AppHealthCheck());
    }
}
