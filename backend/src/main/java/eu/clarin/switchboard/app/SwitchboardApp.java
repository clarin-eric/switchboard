package eu.clarin.switchboard.app;

import eu.clarin.switchboard.app.config.RootConfig;
import eu.clarin.switchboard.app.config.SwitchboardConfig;
import eu.clarin.switchboard.core.DataStore;
import eu.clarin.switchboard.core.DefaultStoragePolicy;
import eu.clarin.switchboard.core.MediaLibrary;
import eu.clarin.switchboard.core.ToolRegistry;
import eu.clarin.switchboard.core.xc.SwitchboardExceptionMapper;
import eu.clarin.switchboard.health.AppHealthCheck;
import eu.clarin.switchboard.profiler.DefaultProfiler;
import eu.clarin.switchboard.profiler.api.Profiler;
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
import java.nio.file.Paths;
import java.util.Map;

public class SwitchboardApp extends Application<RootConfig> {
    public static final String URL_PATTERN = "/api/*";

    public static void main(String[] args) throws Exception {
        new SwitchboardApp().run(args);
    }

    TemplatedAssetsBundle assets;

    @Override
    public void initialize(Bootstrap<RootConfig> bootstrap) {
        assets = new TemplatedAssetsBundle("/webui/", "/", "index.html", "static");
        bootstrap.addBundle(assets);
        bootstrap.setConfigurationSourceProvider(new SubstitutingSourceProvider(
                bootstrap.getConfigurationSourceProvider(), new EnvironmentVariableSubstitutor(false)));
    }

    @Override
    public void run(RootConfig configuration, Environment environment) throws IOException, SAXException, TikaException {
        SwitchboardConfig switchboardConfig = configuration.getSwitchboard();
        System.out.println("" + switchboardConfig);

        String appContextPath = ((DefaultServerFactory) configuration.getServerFactory()).getApplicationContextPath();
        assets.setAppContextPathSubstitutions("index.html", appContextPath);

        Path dataStoreRoot = switchboardConfig.getDataStore().getLocation() == null ?
                Files.createTempDirectory("switchboard") :
                Paths.get(switchboardConfig.getDataStore().getLocation());

        DefaultStoragePolicy storagePolicy = new DefaultStoragePolicy(switchboardConfig.getDataStore());

        DataStore dataStore = new DataStore(dataStoreRoot, storagePolicy);
        if (configuration.getSwitchboard().getDataStore().isEraseAllStorageOnStart()) {
            dataStore.eraseAllStorage();
        }

        ToolRegistry toolRegistry = new ToolRegistry(switchboardConfig.getTools().getToolRegistryPath());
        storagePolicy.setAllowedMediaTypes(toolRegistry.getAllMediatypes());
        toolRegistry.setOnUpdate(() -> {
            storagePolicy.setAllowedMediaTypes(toolRegistry.getAllMediatypes());
        });

        Map<String, String> gitProperties = GitProperties.load("switchboard");

        Profiler profiler = new DefaultProfiler();
        MediaLibrary mediaLibrary = new MediaLibrary(dataStore, profiler, storagePolicy, switchboardConfig.getUrlResolver());

        InfoResource infoResource = new InfoResource(toolRegistry, gitProperties,
                switchboardConfig.getDataStore().getMaxSize(), switchboardConfig.getContactEmail());
        DataResource dataResource = new DataResource(mediaLibrary);
        ToolsResource toolsResource = new ToolsResource(toolRegistry, switchboardConfig.getTools());

        environment.jersey().setUrlPattern(URL_PATTERN);
        HttpErrorHandler httpErrorHandler = new HttpErrorHandler(appContextPath, URL_PATTERN);
        environment.getApplicationContext().setErrorHandler(httpErrorHandler);

        environment.jersey().register(SwitchboardExceptionMapper.class);
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(infoResource);
        environment.jersey().register(dataResource);
        environment.jersey().register(toolsResource);

        environment.healthChecks().register("switchboard", new AppHealthCheck());
    }
}
