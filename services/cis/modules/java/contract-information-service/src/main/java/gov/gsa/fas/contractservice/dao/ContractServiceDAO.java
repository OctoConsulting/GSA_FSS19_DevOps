package gov.gsa.fas.contractservice.dao;

import java.util.List;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException;

import gov.gsa.fas.contractservice.model.Address;
import gov.gsa.fas.contractservice.model.CDFMaster;
import gov.gsa.fas.contractservice.model.ContractDataMaster;

public interface ContractServiceDAO {
	
	String getDetailsByPartitionKey(String partitionKey, String sortKey) throws AmazonDynamoDBException,AmazonClientException;
	
	List<String> getInternalContractNumber(String entityID) throws AmazonDynamoDBException;
	
	ContractDataMaster getContractByGSAM(String gsamContractNum) throws AmazonDynamoDBException;

	List<CDFMaster> getBuyerDetails(String gsamContractNum) throws AmazonDynamoDBException,AmazonClientException;
	
	Address getAddressDetail(String gsamContractNum) throws AmazonDynamoDBException,AmazonClientException;
}
