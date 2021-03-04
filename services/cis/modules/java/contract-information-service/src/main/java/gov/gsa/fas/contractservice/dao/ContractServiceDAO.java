package gov.gsa.fas.contractservice.dao;

import com.amazonaws.AmazonClientException;

import gov.gsa.fas.contractservice.model.CMF;

public interface ContractServiceDAO {
	
	CMF getContractByGSAM(String gsamContractNum) throws AmazonClientException;

}
