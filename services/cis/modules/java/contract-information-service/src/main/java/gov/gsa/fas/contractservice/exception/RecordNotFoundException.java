package gov.gsa.fas.contractservice.exception;

public class RecordNotFoundException extends Exception {

	private int sqlcode = 0;
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public RecordNotFoundException(String message) {
		super(message);
	}

	public RecordNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}

	public RecordNotFoundException(int sqlcodex, String message, Throwable cause) {
		super(message, cause);
		this.sqlcode = sqlcodex;
	}
}
