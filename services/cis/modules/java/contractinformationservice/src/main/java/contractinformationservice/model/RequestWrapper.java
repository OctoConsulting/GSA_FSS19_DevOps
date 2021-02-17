package contractinformationservice.model;

public class RequestWrapper {

    private String body;

    public RequestWrapper() {}

    public RequestWrapper(String body) {
        this.body = body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getBody() {
        return body;
    }
} 