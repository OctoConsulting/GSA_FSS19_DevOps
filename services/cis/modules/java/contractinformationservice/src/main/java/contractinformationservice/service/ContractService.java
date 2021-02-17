package contractinformationservice.service;

import java.util.List;

import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.PORecordsType;

public interface ContractService {
	
	
	List<CSDetailPO> getContractData(List<PORecordsType> inPORequest);

}
