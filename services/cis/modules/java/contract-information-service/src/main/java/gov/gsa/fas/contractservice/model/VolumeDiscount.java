package gov.gsa.fas.contractservice.model;

import java.io.Serializable;

public class VolumeDiscount implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String d4532_cont_no;
	private String d4532_discount_cd;
	private String d4532_discount_percentage;
	private String d4532_loaded_by;
	private String d4532_loaded_date;
	private String d4532_loaded_time;

	public String getD4532_cont_no() {
		return d4532_cont_no;
	}

	public void setD4532_cont_no(String d4532_cont_no) {
		this.d4532_cont_no = d4532_cont_no;
	}

	public String getD4532_discount_cd() {
		return d4532_discount_cd;
	}

	public void setD4532_discount_cd(String d4532_discount_cd) {
		this.d4532_discount_cd = d4532_discount_cd;
	}

	public String getD4532_discount_percentage() {
		return d4532_discount_percentage;
	}

	public void setD4532_discount_percentage(String d4532_discount_percentage) {
		this.d4532_discount_percentage = d4532_discount_percentage;
	}

	public String getD4532_loaded_by() {
		return d4532_loaded_by;
	}

	public void setD4532_loaded_by(String d4532_loaded_by) {
		this.d4532_loaded_by = d4532_loaded_by;
	}

	public String getD4532_loaded_date() {
		return d4532_loaded_date;
	}

	public void setD4532_loaded_date(String d4532_loaded_date) {
		this.d4532_loaded_date = d4532_loaded_date;
	}

	public String getD4532_loaded_time() {
		return d4532_loaded_time;
	}

	public void setD4532_loaded_time(String d4532_loaded_time) {
		this.d4532_loaded_time = d4532_loaded_time;
	}

}