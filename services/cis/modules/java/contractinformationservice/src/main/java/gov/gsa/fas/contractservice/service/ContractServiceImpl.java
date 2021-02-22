package gov.gsa.fas.contractservice.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.amazonaws.util.StringUtils;

import gov.gsa.fas.contractservice.model.PathParameters;
import gov.gsa.fas.contractservice.model.RequestWrapper;
import gov.gsa.fas.contractservice.util.ContractConstants;
import gov.gsa.fas.contractservice.util.ContractServiceUtil;
import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.ContractsType;
import gov.gsa.fas.contractservice.contract.PORecordsType;

public class ContractServiceImpl implements ContractService {

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

	@Override
	public RequestWrapper getContractDetailsResponse(RequestWrapper inputStream) {
		
		RequestWrapper outputStream = this.validateContractDetailsRequest(inputStream);
		
		if(outputStream !=null) {
			return outputStream;
		}
		
		ContractsType contractsType = getContractDetails(inputStream.getPathParameters().getContractid());
		return new RequestWrapper(ContractServiceUtil.marshall(contractsType));
	}
	
	/**
	 * Validate Input PO Request 
	 * @param inPOLines
	 * @return
	 */
	private RequestWrapper validateContractDetailsRequest(RequestWrapper inputStream) {
		
		if (null == inputStream.getPathParameters()  || null == inputStream.getPathParameters().getContractid() || 1 > inputStream.getPathParameters().getContractid().length() ){
			inputStream.setBody(ContractServiceUtil.marshallException("soap:Server", ContractConstants.INVALID_DATA_CONTRACT_NUMBER_JS007));
			return inputStream;
		}
		return null;
	}
	
	public ContractsType getContractDetails(String contractId) {
		return new ContractsType();
	}
	
}
