package eu.clarin.switchboard.app;

import eu.clarin.switchboard.core.*;
import eu.clarin.switchboard.health.AppHealthCheck;
import eu.clarin.switchboard.resources.DataResource;
import eu.clarin.switchboard.resources.InfoResource;
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
import java.nio.file.Files;
import java.nio.file.Path;
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
        Config.SwitchboardConfig switchboardConfig = configuration.getSwitchboard();
        System.out.println("" + switchboardConfig);

        String appContextPath = ((DefaultServerFactory) configuration.getServerFactory()).getApplicationContextPath();
        assets.setAppContextPathSubstitutions("index.html", appContextPath);

        DefaultStoragePolicy storagePolicy = new DefaultStoragePolicy(switchboardConfig.getMaximumDataSize());

        ToolRegistry toolRegistry = new ToolRegistry(switchboardConfig.getToolRegistryPath());
        storagePolicy.setAllowedMediaTypes(toolRegistry.getAllMediatypes());
        toolRegistry.onUpdate(() -> {
            storagePolicy.setAllowedMediaTypes(toolRegistry.getAllMediatypes());
        });

        Map<String, String> gitProperties = GitProperties.load("switchboard");
        Path dataStoreRoot = Files.createTempDirectory("switchboard");
        DataStore dataStore = new DataStore(dataStoreRoot, storagePolicy);

        Profiler profiler = new Profiler();
        Converter converter = new Converter(switchboardConfig.getTikaConfigPath());
        MediaLibrary mediaLibrary = new MediaLibrary(dataStore, profiler, converter, storagePolicy);

        InfoResource infoResource = new InfoResource(toolRegistry, gitProperties, switchboardConfig.getMaximumDataSize());
        DataResource dataResource = new DataResource(mediaLibrary);
        ToolsResource toolsResource = new ToolsResource(toolRegistry);

        environment.getApplicationContext().setErrorHandler(new HttpErrorHandler());

        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(StoragePolicyExceptionMapper.class);
        environment.jersey().register(infoResource);
        environment.jersey().register(dataResource);
        environment.jersey().register(toolsResource);

        environment.jersey().setUrlPattern("/api/*");

        environment.healthChecks().register("switchboard", new AppHealthCheck());
    }
}
