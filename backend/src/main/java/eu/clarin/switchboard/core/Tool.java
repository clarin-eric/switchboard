package eu.clarin.switchboard.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.common.base.MoreObjects;
import eu.clarin.switchboard.core.xc.BadToolException;
import eu.clarin.switchboard.profiler.DefaultMatcher;
import eu.clarin.switchboard.profiler.api.Matcher;

import java.util.*;
import java.util.function.Predicate;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class Tool {
    public static final String ANY_LANGUAGE_KEYWORD_V1 = "generic";
    public static final String ANY_LANGUAGE_KEYWORD = "generic";

    String formatVersion;
    String task;
    String deployment;
    String name;
    String logo;
    String homepage;
    String location;
    String creators;
    Contact contact;
    String person;
    String email;
    String version;
    String authentication;
    String licence;
    String description;
    String url;
    List<String> output;

    List<Input> inputs;
    List<Parameter> queryParameters;
    List<Parameter> pathParameters;
    BatchProcessing batchProcessing;

    public String getFormatVersion() {
        return formatVersion;
    }

    public void setFormatVersion(String formatVersion) {
        this.formatVersion = formatVersion;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public String getDeployment() {
        return deployment;
    }

    public void setDeployment(String deployment) {
        this.deployment = deployment;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getHomepage() {
        return homepage;
    }

    public void setHomepage(String homepage) {
        this.homepage = homepage;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCreators() {
        return creators;
    }

    public void setCreators(String creators) {
        this.creators = creators;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public String getPerson() {
        return person;
    }

    public void setPerson(String person) {
        this.person = person;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getAuthentication() {
        return authentication;
    }

    public void setAuthentication(String authentication) {
        this.authentication = authentication;
    }

    public String getLicence() {
        return licence;
    }

    public void setLicence(String licence) {
        this.licence = licence;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<String> getOutput() {
        return output;
    }

    public void setOutput(List<String> output) {
        this.output = output;
    }

    public List<Input> getInputs() {
        return inputs;
    }

    public void setInputs(List<Input> inputs) {
        this.inputs = inputs;
    }

    public List<Parameter> getQueryParameters() {
        return queryParameters;
    }

    public void setQueryParameters(List<Parameter> queryParameters) {
        this.queryParameters = queryParameters;
    }

    public List<Parameter> getPathParameters() {
        return pathParameters;
    }

    public void setPathParameters(List<Parameter> pathParameters) {
        this.pathParameters = pathParameters;
    }

    public BatchProcessing getBatchProcessing() {
        return batchProcessing;
    }

    public void setBatchProcessing(BatchProcessing batchProcessing) {
        this.batchProcessing = batchProcessing;
    }

    @SuppressWarnings("unchecked")
    public void augment(Map<String, Object> v1map) throws BadToolException {
        // importing old v1 format: languages, langEncoding, mimetypes and parameters
        if (v1map.containsKey("formatVersion")) {
            Object name = v1map.getOrDefault("name", "[unknown]");
            if (Arrays.asList("mimetypes", "languages", "langEncoding", "parameters").parallelStream()
                    .anyMatch(v1map::containsKey)) {
                throw new BadToolException("Tool `" + name + "` declares format version 2 but contains some old keys: " +
                        "\"mimetypes\", \"languages\", \"langEncoding\", \"parameters\"");
            }
            if (!"2".equals(v1map.get("formatVersion"))) {
                throw new BadToolException("Tool `" + name + "`: format version should be `2` or be missing");
            }
            return;
        }
        assert inputs == null || inputs.isEmpty();
        assert queryParameters == null || queryParameters.isEmpty();
        assert pathParameters == null || pathParameters.isEmpty();
        assert batchProcessing == null;

        Input input = new Input();
        input.id = "first_input";
        input.setMediatypes((List<String>) v1map.get("mimetypes"));
        List<String> languages = (List<String>) v1map.get("languages");
        if (languages.contains(ANY_LANGUAGE_KEYWORD_V1)) {
            input.setLanguages(ANY_LANGUAGE_KEYWORD);
        } else {
            input.setLanguages(languages);
        }
        setInputs(Collections.singletonList(input));

        Map<String, Object> v1params = (Map<String, Object>) v1map.get("parameters");
        Map<String, Object> v1mappings = (Map<String, Object>) v1map.get("mapping");
        if (v1params == null) {
            v1params = new HashMap<>();
        }
        if (v1mappings == null) {
            v1mappings = new HashMap<>();
        }

        for (Map.Entry<String, Object> e : v1params.entrySet()) {
            Parameter p = new Parameter();

            String name = e.getKey();
            String mapping = (String) v1mappings.get(name);
            if (Arrays.asList("input", "lang", "type").contains(name) && mapping != null && !mapping.isEmpty()) {
                p.setName(mapping);
            } else {
                p.setName(name);
            }

            if (name.equals("input")) {
                p.setBind(input.id + "/dataurl");
            } else if (name.equals("lang")) {
                p.setBind(input.id + "/language");
                if (v1map.containsKey("langEncoding")) {
                    p.setEncoding((String) v1map.get("langEncoding"));
                }
            } else if (name.equals("type")) {
                p.setBind(input.id + "/mediatype");
            } else if (name.equals("content")) {
                p.setBind(input.id + "/content");
            } else {
                p.setValue((String) e.getValue());
            }

            if (mapping != null && mapping.isEmpty()) {
                if (pathParameters == null) {
                    pathParameters = new ArrayList<>();
                }
                pathParameters.add(p);
            } else {
                if (queryParameters == null) {
                    queryParameters = new ArrayList<>();
                }
                queryParameters.add(p);
            }
        }
    }

    public static class Contact {
        String person;
        String email;

        public String getPerson() {
            return person;
        }

        public void setPerson(String person) {
            this.person = person;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        @Override
        public String toString() {
            return MoreObjects.toStringHelper(this)
                    .add("\nperson", person)
                    .add("\nemail", email)
                    .toString();
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Input {
        String id;
        String name;
        List<String> mediatypes;
        Object languages;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<String> getMediatypes() {
            return mediatypes;
        }

        public void setMediatypes(List<String> mediatypes) {
            this.mediatypes = mediatypes;
        }

        public Object getLanguages() {
            return languages;
        }

        public void setLanguages(Object languages) {
            this.languages = languages;
        }

        @JsonIgnore
        public Matcher getMatcher(boolean requiresContent) {
            DefaultMatcher.Builder matcherBuilder = DefaultMatcher.builder();
            mediatypes.forEach(matcherBuilder::acceptMediaType);
            if (languages != null) {
                if (languages instanceof String && ANY_LANGUAGE_KEYWORD.equals((String) languages)) {
                    matcherBuilder.acceptLanguage();
                } else if (languages instanceof List) {
                    List<String> langs = (List<String>) this.languages;
                    langs.forEach(matcherBuilder::acceptLanguage);
                }
            }
            if (requiresContent) {
                matcherBuilder.acceptFeatureWithValue("contentIsAvailable", "true");
            }
            return matcherBuilder.build();
        }


        @Override
        public String toString() {
            return MoreObjects.toStringHelper(this)
                    .add("\nid", id)
                    .add("\nname", name)
                    .add("\nmediatypes", mediatypes)
                    .add("\nlanguages", languages)
                    .toString();
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Parameter {
        String name;
        String bind;
        String value;
        String encoding;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getBind() {
            return bind;
        }

        public void setBind(String bind) {
            this.bind = bind;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public String getEncoding() {
            return encoding;
        }

        public void setEncoding(String encoding) {
            this.encoding = encoding;
        }

        @Override
        public String toString() {
            return MoreObjects.toStringHelper(this)
                    .add("\nname", name)
                    .add("\nbind", bind)
                    .add("\nvalue", value)
                    .add("\nencoding", encoding)
                    .toString();
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class BatchProcessing {
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

    public boolean requiresContent(int inputIndex) {
        String contentBind = inputs.get(inputIndex).getName() + "/content";
        Predicate<Parameter> bindsContent = p -> contentBind.equals(p.bind);
        boolean queryRequiresContent = queryParameters != null && queryParameters.parallelStream().anyMatch(bindsContent);
        boolean pathRequiresContent = pathParameters != null && pathParameters.parallelStream().anyMatch(bindsContent);
        return queryRequiresContent || pathRequiresContent;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nformatVersion", formatVersion)
                .add("\ntask", task)
                .add("\ndeployment", deployment)
                .add("\nname", name)
                .add("\nlogo", logo)
                .add("\nhomepage", homepage)
                .add("\nlocation", location)
                .add("\ncreators", creators)
                .add("\ncontact", contact)
                .add("\nperson", person)
                .add("\nemail", email)
                .add("\nversion", version)
                .add("\nauthentication", authentication)
                .add("\nlicence", licence)
                .add("\ndescription", description)
                .add("\nurl", url)
                .add("\noutput", output)
                .add("\ninputs", inputs)
                .add("\nqueryParameters", queryParameters)
                .add("\npathParameters", pathParameters)
                .add("\nbatchProcessing", batchProcessing)
                .toString();
    }
}
