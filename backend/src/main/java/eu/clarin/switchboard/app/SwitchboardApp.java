package eu.clarin.switchboard.app;

import eu.clarin.switchboard.app.config.RootConfig;
import eu.clarin.switchboard.app.config.SwitchboardConfig;
import eu.clarin.switchboard.core.DataStore;
import eu.clarin.switchboard.core.DefaultStoragePolicy;
import eu.clarin.switchboard.core.MediaLibrary;
import eu.clarin.switchboard.core.ToolRegistry;
import eu.clarin.switchboard.core.xc.BadToolException;
import eu.clarin.switchboard.core.xc.SwitchboardExceptionMapper;
import eu.clarin.switchboard.health.AppHealthCheck;
import eu.clarin.switchboard.profiler.DefaultProfiler;
import eu.clarin.switchboard.profiler.api.Profiler;
import eu.clarin.switchboard.resources.DataResource;
import eu.clarin.switchboard.resources.InfoResource;
import eu.clarin.switchboard.resources.MainResource;
import eu.clarin.switchboard.resources.ToolsResource;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.server.DefaultServerFactory;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import org.apache.tika.exception.TikaException;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class SwitchboardApp extends Application<RootConfig> {
    public static String APP_CONTEXT_PATH = "";

    public static void main(String[] args) throws Exception {
        new SwitchboardApp().run(args);
    }

    @Override
    public void initialize(Bootstrap<RootConfig> bootstrap) {
        bootstrap.addBundle(new AssetsBundle("/webui/css", "/css", null, "css"));
        bootstrap.addBundle(new AssetsBundle("/webui/fonts", "/fonts", null, "fonts"));
        bootstrap.addBundle(new AssetsBundle("/webui/images", "/images", null, "images"));
        bootstrap.addBundle(new AssetsBundle("/webui/popup", "/popup", null, "popup"));
        bootstrap.addBundle(new AssetsBundle("/webui/webfonts", "/webfonts", null, "webfonts"));

        bootstrap.addBundle(new ViewBundle<RootConfig>() {
            @Override
            public Map<String, Map<String, String>> getViewConfiguration(RootConfig config) {
                return new HashMap<String, Map<String, String>>() {{
                    put("mustache", new HashMap<>());
                }};
            }
        });

        bootstrap.setConfigurationSourceProvider(new SubstitutingSourceProvider(
                bootstrap.getConfigurationSourceProvider(), new EnvironmentVariableSubstitutor(false)));
    }

    @Override
    public void run(RootConfig configuration, Environment environment) throws IOException, SAXException, TikaException, BadToolException {
        APP_CONTEXT_PATH = ((DefaultServerFactory) configuration.getServerFactory()).getApplicationContextPath();
        if (APP_CONTEXT_PATH.endsWith("/")) {
            APP_CONTEXT_PATH = APP_CONTEXT_PATH.substring(0, APP_CONTEXT_PATH.length() - 1);
        }

        SwitchboardConfig switchboardConfig = configuration.getSwitchboard();
        System.out.println("" + switchboardConfig);

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
        MediaLibrary mediaLibrary = new MediaLibrary(dataStore, profiler, storagePolicy,
                switchboardConfig.getUrlResolver(), switchboardConfig.getDataStore());

        InfoResource infoResource = new InfoResource(toolRegistry, gitProperties, switchboardConfig);
        DataResource dataResource = new DataResource(mediaLibrary);
        ToolsResource toolsResource = new ToolsResource(toolRegistry, switchboardConfig.getTools());

        environment.jersey().register(SwitchboardExceptionMapper.class);
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(infoResource);
        environment.jersey().register(dataResource);
        environment.jersey().register(toolsResource);
        environment.jersey().register(new MainResource(mediaLibrary));

        environment.healthChecks().register("switchboard", new AppHealthCheck());
    }
}
