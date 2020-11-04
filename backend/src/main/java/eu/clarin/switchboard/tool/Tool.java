package eu.clarin.switchboard.tool;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.common.base.MoreObjects;
import eu.clarin.switchboard.core.xc.BadToolException;

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
    String description;
    String logo;
    List<String> keywords;
    String homepage;
    String creators;
    Contact contact;

    String location;
    String version;
    String authentication;

    List<Input> inputs;
    BatchProcessing batchProcessing;
    List<String> output;

    WebApplication webApplication;
    StandaloneApplication standaloneApplication;
    UsageRestrictions usageRestrictions;

    public String getFormatVersion() {
        return formatVersion;
    }

    public void setFormatVersion(String formatVersion) {
        this.formatVersion = formatVersion;
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

    public List<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Input> getInputs() {
        return inputs;
    }

    public void setInputs(List<Input> inputs) {
        this.inputs = inputs;
    }

    public BatchProcessing getBatchProcessing() {
        return batchProcessing;
    }

    public void setBatchProcessing(BatchProcessing batchProcessing) {
        this.batchProcessing = batchProcessing;
    }

    public List<String> getOutput() {
        return output;
    }

    public void setOutput(List<String> output) {
        this.output = output;
    }

    public WebApplication getWebApplication() {
        return webApplication;
    }

    public void setWebApplication(WebApplication webApplication) {
        this.webApplication = webApplication;
    }

    public StandaloneApplication getStandaloneApplication() {
        return standaloneApplication;
    }

    public void setStandaloneApplication(StandaloneApplication standaloneApplication) {
        this.standaloneApplication = standaloneApplication;
    }

    public UsageRestrictions getUsageRestrictions() {
        return usageRestrictions;
    }

    public void setUsageRestrictions(UsageRestrictions usageRestrictions) {
        this.usageRestrictions = usageRestrictions;
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
        assert batchProcessing == null;
        assert webApplication == null;
        assert standaloneApplication == null;

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

        List<Parameter> queryParameters = new ArrayList<>();
        List<Parameter> pathParameters = new ArrayList<>();

        for (Map.Entry<String, Object> e : v1params.entrySet()) {
            Parameter p = new Parameter();

            String name = e.getKey();
            String mapping = (String) v1mappings.get(name);
            if (mapping != null && !mapping.isEmpty()) {
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
                pathParameters.add(p);
            } else {
                queryParameters.add(p);
            }
        }

        assert !queryParameters.isEmpty() || !pathParameters.isEmpty();

        WebApplication webApplication = new WebApplication();
        if (!queryParameters.isEmpty()) {
            webApplication.setQueryParameters(queryParameters);
        }
        if (!pathParameters.isEmpty()) {
            webApplication.setPathParameters(pathParameters);
        }
        webApplication.setUrl((String) v1map.get("url"));
        setWebApplication(webApplication);
        setFormatVersion("2");
    }

    public boolean requiresContent(int inputIndex) {
        String contentBind = inputs.get(inputIndex).getName() + "/content";
        Predicate<Parameter> bindsContent = p -> contentBind.equals(p.bind);
        if (webApplication == null) {
            return false;
        }
        boolean queryRequiresContent = webApplication.queryParameters != null &&
                webApplication.queryParameters.parallelStream().anyMatch(bindsContent);
        boolean pathRequiresContent = webApplication.pathParameters != null &&
                webApplication.pathParameters.parallelStream().anyMatch(bindsContent);
        return queryRequiresContent || pathRequiresContent;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("\nformatVersion", formatVersion)
                .add("\ntask", task)
                .add("\ndeployment", deployment)
                .add("\nname", name)
                .add("\ndescription", description)
                .add("\nlogo", logo)
                .add("\nkeywords", keywords)
                .add("\nhomepage", homepage)
                .add("\ncreators", creators)
                .add("\ncontact", contact)
                .add("\nlocation", location)
                .add("\nversion", version)
                .add("\nauthentication", authentication)
                .add("\ninputs", inputs)
                .add("\nbatchProcessing", batchProcessing)
                .add("\noutput", output)
                .add("\nwebApplication", webApplication)
                .add("\nstandaloneApplication", standaloneApplication)
                .add("\nusageRestrictions", usageRestrictions)
                .toString();
    }
}
