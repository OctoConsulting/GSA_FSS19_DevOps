package gov.gsa.fas.contractservice.dao;

import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Index;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException;
import com.google.gson.Gson;

import gov.gsa.fas.contractservice.exception.CCSExceptions;
import gov.gsa.fas.contractservice.model.Address;
import gov.gsa.fas.contractservice.model.CDFMaster;
import gov.gsa.fas.contractservice.model.ContractDataMaster;
import gov.gsa.fas.contractservice.util.ContractConstants;

public class ContractServiceDAOImpl implements ContractServiceDAO {

	AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
			.withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(
					ContractConstants.DB_CONNECTION_END_POINT, ContractConstants.REGION))
			.build();
	DynamoDB dynamoDB = new DynamoDB(client);

	@Override
	public ContractDataMaster getContractByGSAM(String gsamContractNum) throws CCSExceptions {
		try {
			gsamContractNum = gsamContractNum.concat("_GSAM");
			String data = getContractDataBySortKey(gsamContractNum, ContractConstants.CONTRACT_SERVICE_SK_D402);

			Gson gson = new Gson();

			ContractDataMaster contractMaster = gson.fromJson(data, ContractDataMaster.class);
			return contractMaster;
		} catch (AmazonDynamoDBException ex) {
			throw new CCSExceptions(ex.getErrorMessage(), ex);
		}

	}

	/***
	 * get any detail by passing gsi and sort key value this method returns the
	 * details from contract table its a generic method for all our get items
	 * operations
	 * 
	 * @param gsiValue
	 * @param dynamoDB
	 * @return
	 */
	private String getContractDataBySortKey(String gsiValue, String sortKeyValue) throws AmazonDynamoDBException {

		String data = "";

		Table table = dynamoDB.getTable(ContractConstants.CONTRACT_SERVICE_TABLE_NAME);

		Index index = table.getIndex(ContractConstants.CONTRACT_SERVICE_GSI);

		QuerySpec spec = new QuerySpec()

				.withKeyConditionExpression(ContractConstants.CONTRACT_SERVICE_GSI + " = :gsam_cont_no")
				.withValueMap(new ValueMap().withString(":gsam_cont_no", gsiValue));

		ItemCollection<QueryOutcome> items = index.query(spec);
		Iterator<Item> iterator = items.iterator();
		Item item1 = null;
		while (iterator.hasNext()) {
			item1 = iterator.next();
			String internalContractNumber = item1.getString(ContractConstants.CONTRACT_SERVICE_PK);

			QuerySpec specInternal = new QuerySpec()
					.withKeyConditionExpression(ContractConstants.CONTRACT_SERVICE_PK + " = :gsam_cont_no AND "
							+ ContractConstants.CONTRACT_SERVICE_GSI + "= :detail")

					.withValueMap(new ValueMap().withString(":gsam_cont_no", internalContractNumber)
							.withString(":detail", sortKeyValue));

			ItemCollection<QueryOutcome> itemInternalColl = table.query(specInternal);

			Iterator<Item> iteratorInternal = itemInternalColl.iterator();
			Item itemInternal = null;
			while (iteratorInternal.hasNext()) {
				itemInternal = iteratorInternal.next();
				data = itemInternal.getJSONPretty("details");
			}
		}
		return data;
	}

	@Override
	public List<CDFMaster> getBuyerDetails(String gsamContractNum) throws CCSExceptions{

		gsamContractNum = gsamContractNum.concat("_GSAM");
		String data = getContractDataBySortKey(gsamContractNum, ContractConstants.CONTRACT_SERVICE_SK_D430);

		List<CDFMaster> cdfMaster = Arrays.asList(new Gson().fromJson(data, CDFMaster[].class));

		return cdfMaster;
	}

	@Override
	public Address getAddressDetail(String gsamContractNum) throws CCSExceptions{
		
		gsamContractNum = gsamContractNum.concat("_GSAM");
		String data = getContractDataBySortKey(gsamContractNum, ContractConstants.CONTRACT_SERVICE_SK_D410);

		Address address = new Gson().fromJson(data, Address.class);

		return address;
	}
	
	

}
