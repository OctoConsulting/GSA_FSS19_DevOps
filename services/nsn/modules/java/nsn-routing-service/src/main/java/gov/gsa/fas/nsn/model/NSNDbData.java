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
	private String CREATE_DATE;
	private String CREATED_BY;
	
	@DynamoDBHashKey(attributeName = "NSN_ID")
	public String getNSN_ID() {
		return nsn_id;
	}
	public void setNSN_ID(String nSN_ID) {
		nsn_id = nSN_ID;
	}
	public String getCIV_MGR() {
		return civ_mgr;
	}
	public void setCIV_MGR(String cIV_MGR) {
		civ_mgr = cIV_MGR;
	}
	public String getMIL_MGR() {
		return mil_mgr;
	}
	public void setMIL_MGR(String mIL_MGR) {
		mil_mgr = mIL_MGR;
	}
	public String getOWA_CD() {
		return owa_cd;
	}
	public void setOWA_CD(String oWA_CD) {
		owa_cd = oWA_CD;
	}
	public String getRIC() {
		return ric;
	}
	public void setRIC(String rIC) {
		ric = rIC;
	}
	public String getCREATE_DATE() {
		return CREATE_DATE;
	}
	public void setCREATE_DATE(String cREATE_DATE) {
		CREATE_DATE = cREATE_DATE;
	}
	public String getCREATED_BY() {
		return CREATED_BY;
	}
	public void setCREATED_BY(String cREATED_BY) {
		CREATED_BY = cREATED_BY;
	}
	@Override
	public String toString() {
		return "NSNDbData [NSN_ID=" + nsn_id + ", CIV_MGR=" + civ_mgr + ", MIL_MGR=" + mil_mgr + ", OWA_CD=" + owa_cd
				+ ", RIC=" + ric + ", CREATE_DATE=" + CREATE_DATE + ", CREATED_BY=" + CREATED_BY + "]";
	}
	
	
}
