package eu.clarin.switchboard.tool;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.common.base.MoreObjects;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TypedURL {
    String type;
    String targetlang;
    String url;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTargetlang() {
        return targetlang;
    }

    public void setTargetlang(String targetlang) {
        this.targetlang = targetlang;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\ntype", type)
                .add("\ntargetlang", targetlang)
                .add("\nurl", url)
                .toString();
    }
}
