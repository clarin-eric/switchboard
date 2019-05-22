package eu.clarin.switchboard.app;

import eu.clarin.switchboard.core.ToolRegistry;
import eu.clarin.switchboard.health.AppHealthCheck;
import eu.clarin.switchboard.resources.MiscResource;
import eu.clarin.switchboard.resources.StorageResource;
import eu.clarin.switchboard.resources.ToolsResource;
import io.dropwizard.Application;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.server.DefaultServerFactory;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.apache.tika.exception.TikaException;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.Map;

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
    public void run(Config configuration, Environment environment) throws IOException, TikaException, SAXException {
        String appContextPath = ((DefaultServerFactory) configuration.getServerFactory()).getApplicationContextPath();
        assets.setAppContextPathSubstitutions("index.html", appContextPath);

        ToolRegistry toolRegistry = new ToolRegistry(configuration.getToolRegistryPath());

        Map<String, String> gitProperties = GitProperties.load("switchboard");

        MiscResource miscResource = new MiscResource(toolRegistry, gitProperties);
        StorageResource storageResource = new StorageResource(configuration.getTikaConfPath());
        ToolsResource toolsResource = new ToolsResource(toolRegistry);

        environment.getApplicationContext().setErrorHandler(new HttpErrorHandler());
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(miscResource);
        environment.jersey().register(storageResource);
        environment.jersey().register(toolsResource);
        environment.jersey().setUrlPattern("/api/*");

        environment.healthChecks().register("switchboard", new AppHealthCheck());
    }
}
