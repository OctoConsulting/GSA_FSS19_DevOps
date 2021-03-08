package gov.gsa.fas.contractservice.model;

import java.io.Serializable;

public class CFFContractFinder implements Serializable{

	private static final long serialVersionUID = 1L;
    
    private String d407_cont_no;
    private String d407_byr_cd;
    private String d407_cecs;
    private String d407_fob_cd;
    private String d407_msds_cd;
    private String d407_pop_cd;
    private String d407_note_cd;
    private String d407_rpt_off;
    private String d407_nsn;
    private String d407_zone_sdf;
    
	public String getD407_cont_no() {
		return d407_cont_no;
	}
	public void setD407_cont_no(String d407_cont_no) {
		this.d407_cont_no = d407_cont_no;
	}
	public String getD407_byr_cd() {
		return d407_byr_cd;
	}
	public void setD407_byr_cd(String d407_byr_cd) {
		this.d407_byr_cd = d407_byr_cd;
	}
	public String getD407_cecs() {
		return d407_cecs;
	}
	public void setD407_cecs(String d407_cecs) {
		this.d407_cecs = d407_cecs;
	}
	public String getD407_fob_cd() {
		return d407_fob_cd;
	}
	public void setD407_fob_cd(String d407_fob_cd) {
		this.d407_fob_cd = d407_fob_cd;
	}
	public String getD407_msds_cd() {
		return d407_msds_cd;
	}
	public void setD407_msds_cd(String d407_msds_cd) {
		this.d407_msds_cd = d407_msds_cd;
	}
	public String getD407_pop_cd() {
		return d407_pop_cd;
	}
	public void setD407_pop_cd(String d407_pop_cd) {
		this.d407_pop_cd = d407_pop_cd;
	}
	public String getD407_note_cd() {
		return d407_note_cd;
	}
	public void setD407_note_cd(String d407_note_cd) {
		this.d407_note_cd = d407_note_cd;
	}
	public String getD407_rpt_off() {
		return d407_rpt_off;
	}
	public void setD407_rpt_off(String d407_rpt_off) {
		this.d407_rpt_off = d407_rpt_off;
	}
	public String getD407_nsn() {
		return d407_nsn;
	}
	public void setD407_nsn(String d407_nsn) {
		this.d407_nsn = d407_nsn;
	}
	public String getD407_zone_sdf() {
		return d407_zone_sdf;
	}
	public void setD407_zone_sdf(String d407_zone_sdf) {
		this.d407_zone_sdf = d407_zone_sdf;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
}
