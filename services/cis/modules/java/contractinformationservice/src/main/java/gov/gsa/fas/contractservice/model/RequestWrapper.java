package gov.gsa.fas.contractservice.model;

public class RequestWrapper {

    private String body;
    
    private PathParameters pathParameters;

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

	public PathParameters getPathParameters() {
		return pathParameters;
	}

	public void setPathParameters(PathParameters pathParameters) {
		this.pathParameters = pathParameters;
	}
    
    
} 