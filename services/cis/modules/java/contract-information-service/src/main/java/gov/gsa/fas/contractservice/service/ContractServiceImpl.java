package gov.gsa.fas.contractservice.service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import com.amazonaws.util.StringUtils;

import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.ContractsType;
import gov.gsa.fas.contractservice.contract.ListContractsType;
import gov.gsa.fas.contractservice.contract.PORecordsType;
import gov.gsa.fas.contractservice.dao.ContractServiceDAO;
import gov.gsa.fas.contractservice.dao.ContractServiceDAOImpl;
import gov.gsa.fas.contractservice.model.CMF;
import gov.gsa.fas.contractservice.model.PathParameters;
import gov.gsa.fas.contractservice.model.RequestWrapper;
import gov.gsa.fas.contractservice.util.ContractConstants;
import gov.gsa.fas.contractservice.util.ContractServiceUtil;
import gov.gsa.fas.contractservice.util.DateUtil;

public class ContractServiceImpl implements ContractService {

	List<CSDetailPO> pOsResponse = new ArrayList<>();

	public RequestWrapper getListContractResponse(RequestWrapper inputStream) {
		RequestWrapper outputStream = this.validateListContractRequest(inputStream);

		if (outputStream != null) {
			return outputStream;
		}

		ListContractsType listContractsType = getListContracts(inputStream.getPathParameters().getEntityid());
		return new RequestWrapper(ContractServiceUtil.marshall(listContractsType));
	}

	public List<CSDetailPO> getContractData(List<PORecordsType> inPORequest) {

		inPORequest.forEach(x -> {
			pOsResponse.add(validateRequest(x));
		});
		return pOsResponse;
	}

	/**
	 * Validate Input PO Request
	 * 
	 * @param inPOLines
	 * @return
	 */
	private CSDetailPO validateRequest(PORecordsType inPOLines) {

		CSDetailPO contractDetail = new CSDetailPO();
		if (StringUtils.isNullOrEmpty(inPOLines.getContractNum())) {
			contractDetail.setResult(ContractConstants.MISSING_CONTRACT_NUMBER);
			return contractDetail;
		}
		if (inPOLines.getTotalPOCost() == null || BigDecimal.ZERO.compareTo(inPOLines.getTotalPOCost()) != -1) {
			contractDetail.setResult(ContractConstants.MISSING_TOTAL);
			return contractDetail;
		}
		if (StringUtils.isNullOrEmpty(inPOLines.getPurchaseOrderNum())) {
			contractDetail.setResult(ContractConstants.MISSING_PURCHASE_NUMBER);
			return contractDetail;
		}

		if (StringUtils.isNullOrEmpty(inPOLines.getRequisitionRecords().get(0).getRequisitionNumber())) {
			contractDetail.setResult(ContractConstants.MISSING_REQUISITION_NUMBER);
			return contractDetail;
		}

		
		return validateGetContractData(contractDetail,inPOLines);
	}

	@Override
	public RequestWrapper getContractDetailsResponse(RequestWrapper inputStream) {

		RequestWrapper outputStream = this.validateContractDetailsRequest(inputStream);

		if (outputStream != null) {
			return outputStream;
		}

		ContractsType contractsType = getContractDetails(inputStream.getPathParameters().getContractid());
		return new RequestWrapper(ContractServiceUtil.marshall(contractsType));
	}

	/**
	 * Validate Input PO Request
	 * 
	 * @param inPOLines
	 * @return
	 */
	private RequestWrapper validateContractDetailsRequest(RequestWrapper inputStream) {

		if (null == inputStream.getPathParameters() || null == inputStream.getPathParameters().getContractid()
				|| 1 > inputStream.getPathParameters().getContractid().length()) {
			inputStream.setBody(ContractServiceUtil.marshallException(ContractConstants.FAULT_CODE,
					ContractConstants.INVALID_DATA_CONTRACT_NUMBER_JS007));
			return inputStream;
		}
		return null;
	}
	
	private RequestWrapper validateListContractRequest(RequestWrapper inputStream) {
		PathParameters pathParameters = inputStream.getPathParameters();
		
		if (pathParameters == null || StringUtils.isNullOrEmpty(pathParameters.getEntityid()) || pathParameters.getEntityid().length() != 9) {
			inputStream.setBody(ContractServiceUtil.marshallException(ContractConstants.FAULT_CODE, ContractConstants.INVALID_DATA_DUNS_NUMBER_JS007));
			return inputStream;
		}
		return null;
	}

	public ContractsType getContractDetails(String contractId) {
		return new ContractsType();
	}
	
	private ListContractsType getListContracts(String entityid) {
		return new ListContractsType();
	}
	
	/***
	 * validation for contract data from the data base   
	 * @param contractDetail
	 * @return
	 */
	private CSDetailPO validateGetContractData(CSDetailPO contractDetail,PORecordsType inPOLines) {

		// data base call
		String[] currentDate = DateUtil.getDateTime();
		String errorMessage = "";
		try {
			ContractServiceDAO contractServiceDAO = new ContractServiceDAOImpl();
			CMF contractMaster = contractServiceDAO.getContractByGSAM(inPOLines.getContractNum());
			contractDetail.setPurchaseOrderNumber(inPOLines.getPurchaseOrderNum());
			contractDetail.setFormalContractNumber(inPOLines.getContractNum());
			contractDetail.setBuyerCode(inPOLines.getBuyerCode());
			
			if (!StringUtils.isNullOrEmpty(contractMaster.getD402_cont_beg_dt()) && DateUtil.dateCompare(currentDate[0], DateUtil.julianToGregf2(contractMaster.getD402_cont_beg_dt())) == 2) {
				// invalid contract, beg date in future
				errorMessage = java.lang.String.format(ContractConstants.JS001_BEGIN_DATE,
						contractDetail.getFormalContractNumber(), contractMaster.getD402_cont_beg_dt());
			}
			if (!StringUtils.isNullOrEmpty(contractMaster.getD402_cont_end_dt()) && DateUtil.dateCompare(currentDate[0], DateUtil.julianToGregf2(contractMaster.getD402_cont_end_dt())) == 1) {
				// invalid contract, end date in the past
				errorMessage = java.lang.String.format(ContractConstants.JS002_END_DATE,
						contractDetail.getFormalContractNumber(), contractMaster.getD402_cont_end_dt());
			}
			if (!StringUtils.isNullOrEmpty(contractMaster.getD402_dt_terminated()) && DateUtil.dateCompare(currentDate[0],
					DateUtil.julianToGregf2( contractMaster.getD402_dt_terminated())) == 1) {

				// invalid contract, terminated
				errorMessage = java.lang.String.format(ContractConstants.JS003_TERMINATION_DATE,
						contractDetail.getFormalContractNumber(), contractMaster.getD402_dt_terminated());

			}
			if (!StringUtils.isNullOrEmpty(errorMessage)) {
				contractDetail.setResult("FAIL " + errorMessage);
				return contractDetail;
			}
			
			contractDetail.setResult(ContractConstants.SUCCESS);
		} catch (ParseException e) {

		}

		return contractDetail;
	}

}
