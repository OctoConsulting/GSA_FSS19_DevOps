package gov.gsa.fas.contractservice.model;

import java.io.Serializable;

public class EDIFax implements Serializable{

/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

private String d411_efpt_ind;
	
	private String d411_fax1;
	
	private String d411_cont_no;
	
	private String d411_cecs;

	public String getD411_efpt_ind() {
		return d411_efpt_ind;
	}

	public void setD411_efpt_ind(String d411_efpt_ind) {
		this.d411_efpt_ind = d411_efpt_ind;
	}

	public String getD411_fax1() {
		return d411_fax1;
	}

	public void setD411_fax1(String d411_fax1) {
		this.d411_fax1 = d411_fax1;
	}

	public String getD411_cont_no() {
		return d411_cont_no;
	}

	public void setD411_cont_no(String d411_cont_no) {
		this.d411_cont_no = d411_cont_no;
	}

	public String getD411_cecs() {
		return d411_cecs;
	}

	public void setD411_cecs(String d411_cecs) {
		this.d411_cecs = d411_cecs;
	}

	
}
