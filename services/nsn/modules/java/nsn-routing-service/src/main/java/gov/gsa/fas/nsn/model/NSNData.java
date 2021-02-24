package gov.gsa.fas.nsn.model;

import com.google.gson.Gson;

public class NSNData {

	private String routingId;
	private String owa;
	private String isCivMgr;
	private String isMilMgr;
	private String ric;
	private String createdBy;
	private String createDate;
	
	public String getRoutingId() {
		return routingId;
	}
	public void setRoutingId(String routingId) {
		this.routingId = routingId;
	}
	public String getOwa() {
		return owa;
	}
	public void setOwa(String owa) {
		this.owa = owa;
	}
	public String getIsCivMgr() {
		return isCivMgr;
	}
	public void setIsCivMgr(String isCivMgr) {
		this.isCivMgr = isCivMgr;
	}
	public String getIsMilMgr() {
		return isMilMgr;
	}
	public void setIsMilMgr(String isMilMgr) {
		this.isMilMgr = isMilMgr;
	}
	public String getRic() {
		return ric;
	}
	public void setRic(String ric) {
		this.ric = ric;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public String getCreateDate() {
		return createDate;
	}
	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	public static void main(String[] args) {
		Gson gson = new Gson();
		String json = "[{\n" + 
				"  \"routingId\": \"20\",\n" + 
				"  \"isCivMgr\": \"Y\",\n" + 
				"  \"isMilMgr\": \"N\",\n" + 
				"  \"owa\":\"F\",\n" + 
				"  \"ric\": \"SMS\",\n" + 
				"  \"createdBy\": \"test\",\n" + 
				"  \"createDate\": \"02/20/2021\"\n" + 
				"}]";
		NSNData[] data = gson.fromJson(json , NSNData[].class);
		System.out.println("Data - "+data);
		System.out.println("routingId - "+data[0].getRoutingId());
	}
}
