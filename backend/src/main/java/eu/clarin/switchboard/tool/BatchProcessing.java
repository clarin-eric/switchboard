package eu.clarin.switchboard.tool;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.common.base.MoreObjects;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BatchProcessing {
    String mode;
    List<Parameter> queryParameters;

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public List<Parameter> getQueryParameters() {
        return queryParameters;
    }

    public void setQueryParameters(List<Parameter> queryParameters) {
        this.queryParameters = queryParameters;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nmode", mode)
                .add("\nqueryParameters", queryParameters)
                .toString();
    }
}
