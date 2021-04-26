package gov.gsa.fas.contractservice.exception;

public class EntityNotFoundException extends Exception {

	private int sqlcode = 0;
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public EntityNotFoundException(String message) {
		super(message);
	}

	public EntityNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}

	public EntityNotFoundException(int sqlcodex, String message, Throwable cause) {
		super(message, cause);
		this.sqlcode = sqlcodex;
	}
}
