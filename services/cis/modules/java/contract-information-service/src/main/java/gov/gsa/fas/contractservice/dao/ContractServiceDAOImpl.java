package gov.gsa.fas.contractservice.dao;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.ScanOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.google.gson.Gson;

import gov.gsa.fas.contractservice.model.CMF;
import gov.gsa.fas.contractservice.util.ContractConstants;

public class ContractServiceDAOImpl implements ContractServiceDAO {

	@Override
	public CMF getContractByGSAM(String gsamContractNum) {

		AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
				.withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(
						ContractConstants.DB_CONNECTION_END_POINT, ContractConstants.REGION))
				.build();
		DynamoDB dynamoDB = new DynamoDB(client);

		String data = getContractDataBySortKey("47QSEA20T000E_GSAM",dynamoDB);
		
		Gson gson = new Gson();

		CMF contractMaster = gson.fromJson(data, CMF.class);
		
		return contractMaster;
	}

	private String getContractDataBySortKey(String sortKeyValue, DynamoDB dynamoDB) {

		String data ="";
	
		Table table = dynamoDB.getTable("CONTRACT_SERVICE");
		
		Map<String, Object> expressionAttributeValues = new HashMap<String, Object>();
		expressionAttributeValues.put(":GSAM_CONT_NO", sortKeyValue);

		ItemCollection<ScanOutcome> items = table.scan("EXTERNAL_CONT_NO = :GSAM_CONT_NO", // FilterExpression
				"INTERNAL_CONT_NO, EXTERNAL_CONT_NO", 
				null, 
				expressionAttributeValues);

		Iterator<Item> iterator = items.iterator();
		Item item1 = null;
		while (iterator.hasNext()) {
			item1 = iterator.next();
			String internalContractNumber = item1.getString("INTERNAL_CONT_NO");

			QuerySpec specInternal = new QuerySpec()
					.withKeyConditionExpression("INTERNAL_CONT_NO= :GSAM_CONT_NO AND EXTERNAL_CONT_NO= :DETAIL")

					.withValueMap(new ValueMap().withString(":GSAM_CONT_NO", internalContractNumber)
							.withString(":DETAIL", "DETAIL"));

			ItemCollection<QueryOutcome> itemInternalColl = table.query(specInternal);

			Iterator<Item> iteratorInternal = itemInternalColl.iterator();
			Item itemInternal = null;
			while (iteratorInternal.hasNext()) {
				itemInternal = iteratorInternal.next();
				data = itemInternal.getString("data");
			}
		}
		return data;
	}

}
