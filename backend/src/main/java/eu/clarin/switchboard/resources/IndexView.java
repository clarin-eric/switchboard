package eu.clarin.switchboard.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.clarin.switchboard.app.SwitchboardApp;
import io.dropwizard.views.common.View;

import java.util.List;
import java.util.UUID;

public class IndexView extends View {
    static ObjectMapper mapper = new ObjectMapper();

    static class Data {
        public List<UUID> fileInfoID;
        public String errorMessage;
        public boolean popup;
    }

    String appContextPath = SwitchboardApp.APP_CONTEXT_PATH;
    String data = null;

    public IndexView() {
        super("index.mustache");
    }

    public static IndexView fileInfoID(List<UUID> ids, boolean popup) throws JsonProcessingException {
        IndexView view = new IndexView();
        Data data = new Data();
        data.fileInfoID = ids;
        data.popup = popup;
        view.data = mapper.writeValueAsString(data);
        return view;
    }

    public static IndexView fileInfoID(UUID id, boolean popup) throws JsonProcessingException {
        return fileInfoID(List.of(id), popup);
    }

    public static IndexView error(String errorMessage, boolean popup) throws JsonProcessingException {
        IndexView view = new IndexView();
        Data data = new Data();
        data.errorMessage = errorMessage;
        data.popup = popup;
        view.data = mapper.writeValueAsString(data);
        return view;
    }
}
