package gov.gsa.fas.contractservice.model;

import java.io.Serializable;

public class NIFData implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String d403_d_o_rating;
	
	private String d403_proper_name;
	
	private String d403_dac;
	
	private String d403_nsn;

	public String getD403_d_o_rating() {
		return d403_d_o_rating;
	}

	public void setD403_d_o_rating(String d403_d_o_rating) {
		this.d403_d_o_rating = d403_d_o_rating;
	}

	public String getD403_proper_name() {
		return d403_proper_name;
	}

	public void setD403_proper_name(String d403_proper_name) {
		this.d403_proper_name = d403_proper_name;
	}

	public String getD403_dac() {
		return d403_dac;
	}

	public void setD403_dac(String d403_dac) {
		this.d403_dac = d403_dac;
	}

	public String getD403_nsn() {
		return d403_nsn;
	}

	public void setD403_nsn(String d403_nsn) {
		this.d403_nsn = d403_nsn;
	}
	
}
