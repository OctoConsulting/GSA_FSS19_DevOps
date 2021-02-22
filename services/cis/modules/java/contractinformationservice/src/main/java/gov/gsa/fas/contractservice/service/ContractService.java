package gov.gsa.fas.contractservice.service;

import java.util.List;

import gov.gsa.fas.contractservice.model.RequestWrapper;
import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.PORecordsType;

public interface ContractService {
	
	
	List<CSDetailPO> getContractData(List<PORecordsType> inPORequest);
	
	RequestWrapper getContractDetailsResponse(RequestWrapper inputStream);

}
