package gov.gsa.fas.contractservice.dao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
import gov.gsa.fas.contractservice.model.App2;
import gov.gsa.fas.contractservice.model.CDFMaster;
import gov.gsa.fas.contractservice.model.ContractDataMaster;
import gov.gsa.fas.contractservice.util.ContractConstants;

public class ContractServiceDAOImpl implements ContractServiceDAO {

	Logger logger = LoggerFactory.getLogger(ContractServiceDAOImpl.class);
	AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
			.withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(
					ContractConstants.DB_CONNECTION_END_POINT, ContractConstants.REGION))
			.build();
	DynamoDB dynamoDB = new DynamoDB(client);

	AmazonDynamoDB clientDefault = AmazonDynamoDBClientBuilder.defaultClient();

	DynamoDB dynamoDBDefault = new DynamoDB(clientDefault);

	@Override
	public ContractDataMaster getContractByGSAM(String gsamContractNum) throws CCSExceptions {
		try {
			
			gsamContractNum = "GSAM_".concat(gsamContractNum);
			String internalContractNumber = "";
			List<String> internalContractNumberList = getContractInternalIDByGSI(gsamContractNum,
					ContractConstants.CONTRACT_SERVICE_SK_D402); // refactor to pass the sortKey
			if (internalContractNumberList != null && internalContractNumberList.size() > 0) {
				internalContractNumber = internalContractNumberList.get(0);
			}

			String cmfMasterDataJSON = getDetailsByPartitionKey(internalContractNumber,
					ContractConstants.CONTRACT_SERVICE_SK_D402 + "_" + internalContractNumber);
			Gson gson = new Gson();

			ContractDataMaster contractMaster = gson.fromJson(cmfMasterDataJSON, ContractDataMaster.class);
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
	private List<String> getContractInternalIDByGSI(String gsiValue, String sortKeyValue)
			throws AmazonDynamoDBException {

		List<String> internalContractList = new ArrayList<String>();

		DynamoDB db = getDynamoDB();

		Table table = db.getTable(getDynamoDBTable());

		Index index = table.getIndex(ContractConstants.CONTRACT_SERVICE_GSI_IDX);

		QuerySpec spec = new QuerySpec()

				.withKeyConditionExpression(ContractConstants.CONTRACT_SERVICE_GSI + " = :gsam_cont_no")
				.withValueMap(new ValueMap().withString(":gsam_cont_no", gsiValue));

		ItemCollection<QueryOutcome> items = index.query(spec);
		Iterator<Item> iterator = items.iterator();
		Item item1 = null;
		while (iterator.hasNext()) {
			item1 = iterator.next();
			internalContractList.add(item1.getString(ContractConstants.CONTRACT_SERVICE_PK));

		}
		return internalContractList;
	}

	private String getDetailsByPartitionKey(String partitionKey, String sortKey) {

		DynamoDB db = getDynamoDB();
		Table table = db.getTable(getDynamoDBTable());
		String resultData = "";
		QuerySpec specInternal = new QuerySpec()
				.withKeyConditionExpression(ContractConstants.CONTRACT_SERVICE_PK + " = :gsam_cont_no AND "
						+ ContractConstants.CONTRACT_SERVICE_GSI + "= :detail")

				.withValueMap(new ValueMap().withString(":gsam_cont_no", partitionKey).withString(":detail", sortKey));

		ItemCollection<QueryOutcome> itemInternalColl = table.query(specInternal);

		Iterator<Item> iteratorInternal = itemInternalColl.iterator();
		Item itemInternal = null;
		while (iteratorInternal != null && iteratorInternal.hasNext()) {
			itemInternal = iteratorInternal.next();
			resultData = itemInternal.getJSON("details");
		}
		return resultData;
	}

	private DynamoDB getDynamoDB() {

		if (System.getenv(ContractConstants.SHORT_ENV) != null
				&& System.getenv(ContractConstants.SHORT_ENV).trim().length() > 0) {
			return dynamoDBDefault;
		}
		return dynamoDB;
	}

	private String getDynamoDBTable() {

		if (System.getenv(ContractConstants.SHORT_ENV) != null
				&& System.getenv(ContractConstants.SHORT_ENV).trim().length() > 0) {
			return ContractConstants.CONTRACT_SERVICE_TABLE_NAME_PREFIX + ContractConstants.SHORT_ENV;
		}
		return ContractConstants.CONTRACT_SERVICE_TABLE_NAME;
	}

	@Override
	public List<CDFMaster> getBuyerDetails(String internalContractNumber) throws CCSExceptions {

		String cdfMasterDataJSON = getDetailsByPartitionKey(internalContractNumber,
				ContractConstants.CONTRACT_SERVICE_SK_D430 + "_" + internalContractNumber);

		if (cdfMasterDataJSON != null && cdfMasterDataJSON.length() > 0) {
			List<CDFMaster> cdfMaster = Arrays.asList(new Gson().fromJson(cdfMasterDataJSON, CDFMaster[].class));

			return cdfMaster;
		}
		return null;
	}

	@Override
	public Address getAddressDetail(String internalContractNumber) throws CCSExceptions {

		String addressDataJSON = getDetailsByPartitionKey(internalContractNumber,
				ContractConstants.CONTRACT_SERVICE_SK_D410 + "_" + internalContractNumber);

		if (addressDataJSON != null && addressDataJSON.length() > 0) {
			Address address = new Gson().fromJson(addressDataJSON, Address.class);

			return address;
		}
		return null;

	}

}
