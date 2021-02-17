package contractinformationservice.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.amazonaws.util.StringUtils;

import contractinformationservice.util.ContractConstants;
import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.PORecordsType;

public class ContractServiceImpl implements ContractService{

	List<CSDetailPO> pOsResponse = new ArrayList<CSDetailPO>();
	public List<CSDetailPO> getContractData(List<PORecordsType> inPORequest) {
		
		inPORequest.forEach(x->{
			pOsResponse.add(validateRequest(x));
		});
		return pOsResponse;
	}

	/**
	 * Validate Input PO Request 
	 * @param inPOLines
	 * @return
	 */
	private CSDetailPO validateRequest(PORecordsType inPOLines) {
		
		CSDetailPO contractDetail = new CSDetailPO();
		if(StringUtils.isNullOrEmpty(inPOLines.getContractNum())){
			contractDetail.setResult(ContractConstants.MISSING_CONTRACT_NUMBER); 
			return contractDetail;
		}
		if (inPOLines.getTotalPOCost() == null
				|| BigDecimal.ZERO.compareTo(inPOLines.getTotalPOCost()) != -1) {
			contractDetail.setResult(ContractConstants.MISSING_TOTAL);
			return contractDetail;
		}
		if (StringUtils.isNullOrEmpty(inPOLines.getPurchaseOrderNum())) {
			contractDetail.setResult(ContractConstants.MISSING_PURCHASE_NUMBER);
			return contractDetail;
		}
		contractDetail.setResult(ContractConstants.SUCCESS);
		return contractDetail;
	}
}
