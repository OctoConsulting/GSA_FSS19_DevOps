package gov.gsa.fas.contractservice.dao;

import java.util.List;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException;

import gov.gsa.fas.contractservice.model.ACCMapping;
import gov.gsa.fas.contractservice.model.Address;
import gov.gsa.fas.contractservice.model.CDFMaster;
import gov.gsa.fas.contractservice.model.CFFContractFinder;
import gov.gsa.fas.contractservice.model.ContractDataMaster;
import gov.gsa.fas.contractservice.model.EDIFax;
import gov.gsa.fas.contractservice.model.NIFData;
import gov.gsa.fas.contractservice.model.VolumeDiscount;
import gov.gsa.fas.contractservice.model.VolumeRange;

public interface ContractServiceDAO {
	
	String getDetailsByPartitionKey(String partitionKey, String sortKey) throws AmazonDynamoDBException,AmazonClientException;
	
	List<String> getInternalContractNumber(String entityID) throws AmazonDynamoDBException;
	
	ContractDataMaster getContractByGSAM(String gsamContractNum) throws AmazonDynamoDBException;

	List<CDFMaster> getBuyerDetails(String gsamContractNum) throws AmazonDynamoDBException,AmazonClientException;
	
	Address getAddressDetail(String gsamContractNum) throws AmazonDynamoDBException,AmazonClientException;
	
	List<CFFContractFinder> getCFFDetail(String internalContractNumber) throws AmazonDynamoDBException,AmazonClientException;
	
	NIFData getNIFDetails(String internalContractNumber) throws AmazonDynamoDBException,AmazonClientException;
	
	EDIFax getEDIFax(String internalContractNumber) throws AmazonDynamoDBException,AmazonClientException;
	
	ACCMapping getReportingOfficeAAC(String internalContractNumber) throws AmazonDynamoDBException,AmazonClientException;
	
	List<VolumeDiscount> getVolumeDiscounts(String internalContractNumber) throws AmazonDynamoDBException,AmazonClientException;
	
	List<VolumeRange> getVolumeRange(String internalContractNumber) throws AmazonDynamoDBException,AmazonClientException;
	
	String getCMFColumns(String partitionKey, String sortKey) throws AmazonDynamoDBException;
	
}
