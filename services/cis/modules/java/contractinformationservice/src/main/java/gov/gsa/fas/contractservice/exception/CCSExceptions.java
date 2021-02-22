package gov.gsa.fas.contractservice.exception;


public class CCSExceptions extends Exception{

	public CCSExceptions(String message) {
		super(message);
	}

	public CCSExceptions(String message, Throwable cause) {
		super(message, cause);
	}

	public CCSExceptions(int sqlcodex, String message, Throwable cause) {
		super(message, cause);
		this.sqlcode = sqlcodex;
	}
	 public CCSExceptions (String message, boolean suppressStacktrace) {
	        super(message, null, suppressStacktrace, !suppressStacktrace);
	        this.suppressStacktrace = suppressStacktrace;
	    }

	    @Override
	    public String toString() {
	        if (suppressStacktrace) {
	            return getLocalizedMessage();
	        } else {
	            return super.toString();
	        }
	    }
	private boolean suppressStacktrace = true;
	private static final long serialVersionUID = 1L;
	private int sqlcode = 0;
}
