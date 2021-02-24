package gov.gsa.fas.nsn.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.util.CollectionUtils;
import com.google.gson.Gson;

import gov.gsa.fas.nsn.model.GatewayResponse;
import gov.gsa.fas.nsn.model.NSNData;
import gov.gsa.fas.nsn.model.NSNDbData;

public class LambdaMethodHandler implements RequestHandler<Map<String, Object>, GatewayResponse> {

	static AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
	static DynamoDB dynamoDB = new DynamoDB(client);
	static String tableName = "NSN_DATA";
	private static final String GROUP_KEY = "Group";
	private static final String CLASS_KEY = "Class";
	private static final String NSN_KEY = "NSN";

	@Override
	public GatewayResponse handleRequest(Map<String, Object> inputMap, Context context) {
		LambdaLogger logger = context.getLogger();
		
		logger.log("Got input - "+inputMap);
		try {
			Map<String, String> routingIdMap = (Map<String, String>)inputMap.get("pathParameters");
			logger.log("routingIdMap - "+routingIdMap);
			String routingId = routingIdMap.get("routingId");
			logger.log("routingId - "+routingId);
			
			DynamoDBMapper mapper = new DynamoDBMapper(client);
			DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();

			List<NSNDbData> dbData = mapper.scan(NSNDbData.class, scanExpression);
			
			logger.log("dbData - "+dbData);
			logger.log("Total elements in dynamoDB table - "+dbData.size());

			Map<String, List<NSNData>> resultMap = new HashMap<>();
			Map<String, String> responseMap = new HashMap<>();

			for (int i = 0; i < dbData.size(); i++) {

				NSNDbData nsnDbData = dbData.get(i);
				logger.log("nsnDbData - "+nsnDbData);
				String nsnId = nsnDbData .getNSN_ID();
				
				logger.log("nsn ID from db - "+nsnId);

				if (nsnId.equals(routingId) || nsnId.startsWith(routingId)) {
					logger.log("processing nsnId - "+nsnId+"\n");
					if (nsnId.length() == 2) { // Group entry
						List<NSNData> groupList = resultMap.get(GROUP_KEY);
						if (CollectionUtils.isNullOrEmpty(groupList)) {
							groupList = new ArrayList<>();
						}
						groupList.add(populateNSNData(nsnDbData));
						resultMap.put(GROUP_KEY, groupList);
					}
					if (nsnId.length() == 4) { // Group entry
						List<NSNData> classList = resultMap.get(CLASS_KEY);
						if (CollectionUtils.isNullOrEmpty(classList)) {
							classList = new ArrayList<>();
						}
						classList.add(populateNSNData(nsnDbData));
						resultMap.put(CLASS_KEY, classList);
					}
					if (nsnId.length() > 4) { // Group entry
						List<NSNData> nsnList = resultMap.get(NSN_KEY);
						if (CollectionUtils.isNullOrEmpty(nsnList)) {
							nsnList = new ArrayList<>();
						}
						nsnList.add(populateNSNData(nsnDbData));
						resultMap.put(NSN_KEY, nsnList);
					}
				}
				logger.log("resultMap - "+resultMap+"\n");
			}

			Gson gson = new Gson();

			if (!CollectionUtils.isNullOrEmpty(resultMap.entrySet())) {
				String gsonString = gson.toJson(resultMap);
				logger.log("result to be returned from lambda - "+resultMap);
				return new GatewayResponse( gsonString, 200, null, false);
			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return new GatewayResponse("No Data found", 404, null, false);
	}
	/*
	public String handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws Exception {

		JSONParser parser = new JSONParser();
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
		JSONObject responseJson = new JSONObject();

		JSONObject event = (JSONObject) parser.parse(reader);
		JSONObject responseBody = new JSONObject();
		String input = null;
		LambdaLogger logger = context.getLogger();
		logger.log("Input raw string - "+IOUtils.toString(inputStream));
		logger.log("event - "+event.toJSONString());
		if (event.get("pathParameters") != null) {
			JSONObject pps = (JSONObject) event.get("pathParameters");
			if (pps.get("routingId") != null) {
				logger.log("Routing ID - " + pps.get("routingId"));
				input = (String) pps.get("routingId");
			}
		}
		
		logger.log("Input is - "+input);
		System.out.println("Sysout input - "+input);

		DynamoDBMapper mapper = new DynamoDBMapper(client);
		DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();

		List<NSNDbData> dbData = mapper.scan(NSNDbData.class, scanExpression);
		
		logger.log("dbData - "+dbData);
		logger.log("Total elements in dynamoDB table - "+dbData.size());

		Map<String, List<NSNData>> resultMap = new HashMap<>();
		Map<String, String> responseMap = new HashMap<>();

		for (int i = 0; i < dbData.size(); i++) {

			NSNDbData nsnDbData = dbData.get(i);
			logger.log("nsnDbData - "+nsnDbData);
			String nsnId = nsnDbData .getNSN_ID();
			
			logger.log("nsn ID from db - "+nsnId);

			if (nsnId.equals(input) || nsnId.startsWith(input)) {
				logger.log("processing nsnId - "+nsnId+"\n");
				if (nsnId.length() == 2) { // Group entry
					List<NSNData> groupList = resultMap.get(GROUP_KEY);
					if (CollectionUtils.isNullOrEmpty(groupList)) {
						groupList = new ArrayList<>();
					}
					groupList.add(populateNSNData(nsnDbData));
					resultMap.put(GROUP_KEY, groupList);
				}
				if (nsnId.length() == 4) { // Group entry
					List<NSNData> classList = resultMap.get(CLASS_KEY);
					if (CollectionUtils.isNullOrEmpty(classList)) {
						classList = new ArrayList<>();
					}
					classList.add(populateNSNData(nsnDbData));
					resultMap.put(CLASS_KEY, classList);
				}
				if (nsnId.length() > 4) { // Group entry
					List<NSNData> nsnList = resultMap.get(NSN_KEY);
					if (CollectionUtils.isNullOrEmpty(nsnList)) {
						nsnList = new ArrayList<>();
					}
					nsnList.add(populateNSNData(nsnDbData));
					resultMap.put(NSN_KEY, nsnList);
				}
			}
			logger.log("resultMap - "+resultMap+"\n");
		}

		Gson gson = new Gson();

		if (!CollectionUtils.isNullOrEmpty(resultMap.entrySet())) {
			String gsonString = gson.toJson(resultMap);
			responseMap.put("statusCode", "200");
			responseMap.put("body", gsonString);
			logger.log("Returning result - "+gson.toJson(responseMap)+"\n");
			return gson.toJson(responseMap);
		}
		responseMap.put("statusCode", "404");
		responseMap.put("message", "No records found");
		return gson.toJson(responseMap);
		
	}
*/
	private NSNData populateNSNData(NSNDbData item) {
		NSNData nsnData = new NSNData();
		nsnData.setRoutingId(item.getNSN_ID());
		nsnData.setIsCivMgr(item.getCIV_MGR() == null ? "" : Boolean.parseBoolean(item.getCIV_MGR()) ? "Y" : "N");
		nsnData.setIsMilMgr(item.getMIL_MGR() == null ? "" : Boolean.parseBoolean(item.getMIL_MGR()) ? "Y" : "N");
		nsnData.setOwa(item.getOWA_CD() == null ? "" : item.getOWA_CD());
		nsnData.setRic(item.getRIC() == null ? "" : item.getRIC());
		nsnData.setCreateDate(item.getCREATE_DATE() == null ? "" : item.getCREATE_DATE());
		nsnData.setCreatedBy(item.getCREATED_BY() == null ? "" : item.getCREATED_BY());

		return nsnData;
	}

	private Item retrieveNSNDataItem(String input) {

		Table table = dynamoDB.getTable(tableName);
		QuerySpec sp = new QuerySpec().withKeyConditionExpression("NSN_ID = :nn")
				.withValueMap(new ValueMap().withString(":nn", input));
		ItemCollection<QueryOutcome> items = table.query(sp);
		Iterator<Item> iterator = items.iterator();
		Item item = null;
		if (iterator.hasNext()) {
			item = iterator.next();

		}
		return item;
	}
	
}
