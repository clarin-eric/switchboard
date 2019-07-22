package eu.clarin.switchboard.app;

import org.eclipse.jetty.server.Request;
import org.slf4j.LoggerFactory;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author edima
 * <p>
 * This HttpErrorHandler is designed for a single web page application, and
 * most of the URLs are routed and handled by the javascript client, not in the
 * server. Therefore, whenever a 404 pops up in the server, it probably means
 * that the URL should be handled by javascript, and to do that we must return
 * the default index.html HTML code.
 */
public class HttpErrorHandler extends org.eclipse.jetty.server.handler.ErrorHandler {
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(HttpErrorHandler.class);

    public static final String REDIRECT_ROUTE = "/index.html";
    private String rootPath;

    public HttpErrorHandler(String appContextPath, String urlPattern) {
        String rootPattern = urlPattern.endsWith("/*") ? urlPattern.substring(0, urlPattern.length() - 1) : urlPattern;
        String normalizedContextPath = !appContextPath.isEmpty() && !appContextPath.equals("/")
                ? (appContextPath.startsWith("/") ? appContextPath : "/" + appContextPath) : "";
        rootPath = normalizedContextPath + rootPattern;
    }


    @Override
    public void handle(String target, Request baseRequest, HttpServletRequest request, HttpServletResponse response) throws IOException {
        // On 404 page we need to show index.html and let JS router do the work, otherwise show error page
        if (response.getStatus() == HttpServletResponse.SC_NOT_FOUND &&
                !request.getRequestURI().startsWith(rootPath)) {
            forward(REDIRECT_ROUTE, baseRequest, response);
        } else {
            super.handle(target, baseRequest, request, response);
        }
    }

    void forward(String target, Request request, HttpServletResponse response) throws IOException {
        RequestDispatcher dispatcher = request.getRequestDispatcher(target);
        if (dispatcher == null) {
            LOGGER.error("Can not find internal redirect route '" + target + "' while handling error. Will show system error page");
            super.handle(target, request, request, response);
        } else {
            try {
                response.reset();
                dispatcher.forward(request, response);
            } catch (ServletException e) {
                LOGGER.error("Exception while forwarding to: " + target, e);
                super.handle(target, request, request, response);
            }
        }
    }
}