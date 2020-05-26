package eu.clarin.switchboard.resources;

import eu.clarin.switchboard.app.SwitchboardApp;
import io.dropwizard.views.View;

public class IndexView extends View {
    String appContextPath = SwitchboardApp.APP_CONTEXT_PATH;

    public IndexView() {
        super("index.mustache");
    }
}
