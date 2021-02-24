package gov.gsa.fas.nsn.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "NSN_DATA")
public class NSNDbData {

	private String nsn_id;
	private String civ_mgr;
	private String mil_mgr;
	private String owa_cd;
	private String ric;
	private String create_date;
	private String created_byß;
	
	@DynamoDBHashKey(attributeName = "NSN_ID")
	public String getNsn_id() {
		return nsn_id;
	}
	public void setNsn_id(String nsn_id) {
		this.nsn_id = nsn_id;
	}
	public String getCiv_mgr() {
		return civ_mgr;
	}
	public void setCiv_mgr(String civ_mgr) {
		this.civ_mgr = civ_mgr;
	}
	public String getMil_mgr() {
		return mil_mgr;
	}
	public void setMil_mgr(String mil_mgr) {
		this.mil_mgr = mil_mgr;
	}
	public String getOwa_cd() {
		return owa_cd;
	}
	public void setOwa_cd(String owa_cd) {
		this.owa_cd = owa_cd;
	}
	public String getRic() {
		return ric;
	}
	public void setRic(String ric) {
		this.ric = ric;
	}
	public String getCreate_date() {
		return create_date;
	}
	public void setCreate_date(String create_date) {
		this.create_date = create_date;
	}
	public String getCreated_byß() {
		return created_byß;
	}
	public void setCreated_byß(String created_byß) {
		this.created_byß = created_byß;
	}
	
}
