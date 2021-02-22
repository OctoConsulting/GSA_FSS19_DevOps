package gov.gsa.fss19.nsn.handler;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.util.Map;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.util.StringUtils;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import gov.gsa.fss19.model.GatewayResponse;
import gov.gsa.fss19.model.NSNData;

public class NSNDataPutHandler implements RequestHandler<Map<String, Object>, GatewayResponse>  {
	
	static AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
    static DynamoDB dynamoDB = new DynamoDB(client);
    static String tableName = "NSN_DATA";

    @Override
	public GatewayResponse handleRequest(Map<String, Object> inputDataMap, Context context) {
    	LambdaLogger logger = context.getLogger();
    	logger.log("Got input - "+inputDataMap);
    	
    	String inputDataStr = (String) inputDataMap.get("body");
    	Gson gson = new Gson();
    	NSNData inputData = gson.fromJson(inputDataStr, NSNData.class);
    	
    	Table table = dynamoDB.getTable(tableName);
    	Item existingItem = table.getItem("NSN_ID", inputData.getRoutingId());
    	
    	if(existingItem == null) {
    		return new GatewayResponse("No NSN data exists for routing id - "+inputData.getRoutingId(), 404, null, false);
		}else {
			DeleteItemSpec deleteItemSpec = new DeleteItemSpec()
					.withPrimaryKey(new PrimaryKey("NSN_ID", inputData.getRoutingId()));
			table.deleteItem(deleteItemSpec);
		}
    	
    	Item item = new Item().withPrimaryKey("NSN_ID", inputData.getRoutingId());
		
		
		if(!StringUtils.isNullOrEmpty(inputData.getIsCivMgr())) {
			item = item.withString("CIV_MGR", inputData.getIsCivMgr().equalsIgnoreCase("Y") ? "true" : "false");
		}
		if(!StringUtils.isNullOrEmpty(inputData.getIsMilMgr())) {
			item = item.withString("MIL_MGR", inputData.getIsMilMgr().equalsIgnoreCase("Y") ? "true" : "false");
		}
		if(!StringUtils.isNullOrEmpty(inputData.getOwa())) {
			item = item.withString("OWA_CD", inputData.getOwa());
		}
		if(!StringUtils.isNullOrEmpty(inputData.getRic())) {
			item = item.withString("RIC", inputData.getRic());
		}
		if(!StringUtils.isNullOrEmpty(inputData.getCreateDate())) {
			item = item.withString("CREATE_DATE", inputData.getCreateDate());
		}
		if(!StringUtils.isNullOrEmpty(inputData.getCreatedBy())) {
			item = item.withString("CREATED_BY", inputData.getCreatedBy());
		}
		table.putItem(item);
		
		return new GatewayResponse("NSN data updated for routing id - "+inputData.getRoutingId(), 200, null, false);
	}
}