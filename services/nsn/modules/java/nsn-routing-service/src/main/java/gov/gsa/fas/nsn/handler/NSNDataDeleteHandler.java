package gov.gsa.fas.nsn.handler;

import java.util.Map;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import gov.gsa.fas.nsn.model.GatewayResponse;

public class NSNDataDeleteHandler implements RequestHandler<Map<String, Object>, GatewayResponse> {

	static AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
	static DynamoDB dynamoDB = new DynamoDB(client);
	static String tableName = "NSN_DATA";
	
	@Override
	public GatewayResponse handleRequest(Map<String, Object> inputMap, Context context) {
		LambdaLogger logger = context.getLogger();
		
		logger.log("Got input - "+inputMap);
		Map<String, String> routingIdMap = (Map<String, String>)inputMap.get("pathParameters");
		logger.log("routingIdMap - "+routingIdMap);
		String routingId = routingIdMap.get("routingId");
		logger.log("routingId - "+routingId);
		Table table = dynamoDB.getTable(tableName);
    	
    	Item existingItem = table.getItem("NSN_ID", routingId);
    	if(existingItem == null) {
    		return new GatewayResponse("No NSN routing record found for ID - "+ routingId, 404, null, false);
    	}
    	DeleteItemSpec deleteItemSpec = new DeleteItemSpec().withPrimaryKey("NSN_ID", routingId);
    	table.deleteItem(deleteItemSpec);
		return new GatewayResponse("NSN routing record deleted for ID - "+ routingId, 200, null, false);
	}

}
