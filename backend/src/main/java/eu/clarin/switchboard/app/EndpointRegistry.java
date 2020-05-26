package eu.clarin.switchboard.app;

import com.fasterxml.classmate.ResolvedType;
import com.fasterxml.classmate.TypeResolver;
import org.glassfish.jersey.server.model.Resource;
import org.glassfish.jersey.server.model.ResourceMethod;
import org.glassfish.jersey.server.model.ResourceModel;
import org.glassfish.jersey.server.monitoring.ApplicationEvent;
import org.glassfish.jersey.server.monitoring.ApplicationEventListener;
import org.glassfish.jersey.server.monitoring.RequestEvent;
import org.glassfish.jersey.server.monitoring.RequestEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

class EndpointRegistry implements ApplicationEventListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(EndpointRegistry.class);

    private final TypeResolver TYPE_RESOLVER = new TypeResolver();

    private String rootPath;
    private final Set<String> endpoints = new HashSet<>();

    public EndpointRegistry(String appContextPath, String urlPattern) {
        String rootPattern = urlPattern.endsWith("/*") ? urlPattern.substring(0, urlPattern.length() - 1) : urlPattern;
        String normalizedContextPath = !appContextPath.isEmpty() && !appContextPath.equals("/")
                ? (appContextPath.startsWith("/") ? appContextPath : "/" + appContextPath) : "";
        rootPath = normalizedContextPath + rootPattern;
    }

    public Set<String> getEndpoints() {
        return Collections.unmodifiableSet(endpoints);
    }

    @Override
    public void onEvent(ApplicationEvent event) {
        if (event.getType() == ApplicationEvent.Type.INITIALIZATION_APP_FINISHED) {
            final ResourceModel resourceModel = event.getResourceModel();
            resourceModel.getResources().forEach((resource) -> {
                populate(rootPath, false, resource);
            });
        }
    }

    private void populate(String basePath, boolean isLocator, Resource resource) {
        if (!isLocator) {
            basePath = normalizePath(basePath, resource.getPath());
        }
        endpoints.add(basePath);

        for (Resource childResource : resource.getChildResources()) {
            for (ResourceMethod method : childResource.getAllMethods()) {
                if (method.getType() == ResourceMethod.JaxrsType.RESOURCE_METHOD) {
                    final String path = normalizePath(basePath, childResource.getPath());
                    endpoints.add(path);
                } else if (method.getType() == ResourceMethod.JaxrsType.SUB_RESOURCE_LOCATOR) {
                    final String path = normalizePath(basePath, childResource.getPath());
                    final ResolvedType responseType = TYPE_RESOLVER
                            .resolve(method.getInvocable().getResponseType());
                    final Class<?> erasedType = !responseType.getTypeBindings().isEmpty()
                            ? responseType.getTypeBindings().getBoundType(0).getErasedType()
                            : responseType.getErasedType();
                    populate(path, true, Resource.from(erasedType));
                }
            }
        }
    }

    private String normalizePath(String basePath, String path) {
        if (path == null) {
            return basePath;
        }
        if (basePath.endsWith("/")) {
            return path.startsWith("/") ? basePath + path.substring(1) : basePath + path;
        }
        return path.startsWith("/") ? basePath + path : basePath + "/" + path;
    }

    @Override
    public RequestEventListener onRequest(RequestEvent requestEvent) {
        return null;
    }
}
