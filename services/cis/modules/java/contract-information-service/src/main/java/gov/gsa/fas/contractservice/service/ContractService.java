package gov.gsa.fas.contractservice.service;

import java.util.List;

import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.PORecordsType;
import gov.gsa.fas.contractservice.model.RequestWrapper;

public interface ContractService {
	
	RequestWrapper getListContractResponse(RequestWrapper inputStream);
	
	List<CSDetailPO> getContractData(List<PORecordsType> inPORequest);
	
	RequestWrapper getContractDetailsResponse(RequestWrapper inputStream);

}
