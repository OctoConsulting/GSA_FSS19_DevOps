package gov.gsa.fss19.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "NSN_DATA")
public class NSNDbData {

	private String NSN_ID;
	private String CIV_MGR;
	private String MIL_MGR;
	private String OWA_CD;
	private String RIC;
	private String CREATE_DATE;
	private String CREATED_BY;
	
	@DynamoDBHashKey(attributeName = "NSN_ID")
	public String getNSN_ID() {
		return NSN_ID;
	}
	public void setNSN_ID(String nSN_ID) {
		NSN_ID = nSN_ID;
	}
	public String getCIV_MGR() {
		return CIV_MGR;
	}
	public void setCIV_MGR(String cIV_MGR) {
		CIV_MGR = cIV_MGR;
	}
	public String getMIL_MGR() {
		return MIL_MGR;
	}
	public void setMIL_MGR(String mIL_MGR) {
		MIL_MGR = mIL_MGR;
	}
	public String getOWA_CD() {
		return OWA_CD;
	}
	public void setOWA_CD(String oWA_CD) {
		OWA_CD = oWA_CD;
	}
	public String getRIC() {
		return RIC;
	}
	public void setRIC(String rIC) {
		RIC = rIC;
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
		return "NSNDbData [NSN_ID=" + NSN_ID + ", CIV_MGR=" + CIV_MGR + ", MIL_MGR=" + MIL_MGR + ", OWA_CD=" + OWA_CD
				+ ", RIC=" + RIC + ", CREATE_DATE=" + CREATE_DATE + ", CREATED_BY=" + CREATED_BY + "]";
	}
	
	
}
