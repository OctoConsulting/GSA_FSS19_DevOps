package gov.gsa.fas.contractservice.exception;

public class ApplicationException extends Exception {
	
	private static final long serialVersionUID = -3717076987688864176L;

	public ApplicationException(String message) {
		super(message);
	}

	public ApplicationException(String message, Throwable cause) {
		super(message, cause);
	}

}
