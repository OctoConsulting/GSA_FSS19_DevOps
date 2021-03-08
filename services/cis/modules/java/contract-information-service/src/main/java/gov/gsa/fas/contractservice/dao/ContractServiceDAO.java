package gov.gsa.fas.contractservice.dao;

import java.util.List;

import gov.gsa.fas.contractservice.exception.CCSExceptions;
import gov.gsa.fas.contractservice.model.Address;
import gov.gsa.fas.contractservice.model.CDFMaster;
import gov.gsa.fas.contractservice.model.ContractDataMaster;

public interface ContractServiceDAO {
	
	ContractDataMaster getContractByGSAM(String gsamContractNum) throws CCSExceptions;

	List<CDFMaster> getBuyerDetails(String gsamContractNum) throws CCSExceptions;
	
	Address getAddressDetail(String gsamContractNum) throws CCSExceptions;
}
