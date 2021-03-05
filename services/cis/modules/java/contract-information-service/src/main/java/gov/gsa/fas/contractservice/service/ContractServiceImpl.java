package gov.gsa.fas.contractservice.service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.util.StringUtils;

import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.ContractsType;
import gov.gsa.fas.contractservice.contract.ListContractsType;
import gov.gsa.fas.contractservice.contract.PORecordsType;
import gov.gsa.fas.contractservice.dao.ContractServiceDAO;
import gov.gsa.fas.contractservice.dao.ContractServiceDAOImpl;
import gov.gsa.fas.contractservice.exception.CCSExceptions;
import gov.gsa.fas.contractservice.model.CDFMaster;
import gov.gsa.fas.contractservice.model.ContractDataMaster;
import gov.gsa.fas.contractservice.model.PathParameters;
import gov.gsa.fas.contractservice.model.RequestWrapper;
import gov.gsa.fas.contractservice.util.ContractConstants;
import gov.gsa.fas.contractservice.util.ContractServiceUtil;
import gov.gsa.fas.contractservice.util.DateUtil;

public class ContractServiceImpl implements ContractService {

	Logger logger = LoggerFactory.getLogger(ContractServiceImpl.class);
	
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

		/*check whether reporting office is empty or if the ro has more than one character */
		if (StringUtils.isNullOrEmpty(inPOLines.getRequisitionRecords().get(0).getReportingOffice())
				||inPOLines.getRequisitionRecords().get(0).getReportingOffice().trim().length()>1) {
			contractDetail.setResult(ContractConstants.MISSING_REPORTING_OFFICE);
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
	private CSDetailPO validateGetContractData(CSDetailPO contractDetail, PORecordsType inPOLines) {

		// data base call
		String[] currentDate = DateUtil.getDateTime();
		String errorMessage = "";
		try {
			ContractServiceDAO contractServiceDAO = new ContractServiceDAOImpl();
			ContractDataMaster contractMaster = contractServiceDAO.getContractByGSAM(inPOLines.getContractNum());
			if(contractMaster == null) {
				contractDetail.setResult(String.format(ContractConstants.JS000_CONTRACT_DATA,inPOLines.getContractNum()));
				return contractDetail;
			}
			contractDetail.setPurchaseOrderNumber(inPOLines.getPurchaseOrderNum());
			contractDetail.setFormalContractNumber(inPOLines.getContractNum());
			contractDetail.setBuyerCode(inPOLines.getBuyerCode());
			if (!StringUtils.isNullOrEmpty(contractMaster.getD402_cont_beg_dt()) && DateUtil.dateCompare(currentDate[0],
					DateUtil.julianToGregf2(contractMaster.getD402_cont_beg_dt())) == 2) {
				// invalid contract, beg date in future
				errorMessage = java.lang.String.format(ContractConstants.JS001_BEGIN_DATE,
						contractDetail.getFormalContractNumber(), contractMaster.getD402_cont_beg_dt());
			}
			if (!StringUtils.isNullOrEmpty(contractMaster.getD402_cont_end_dt()) && DateUtil.dateCompare(currentDate[0],
					DateUtil.julianToGregf2(contractMaster.getD402_cont_end_dt())) == 1) {
				// invalid contract, end date in the past
				errorMessage = java.lang.String.format(ContractConstants.JS002_END_DATE,
						contractDetail.getFormalContractNumber(), contractMaster.getD402_cont_end_dt());
			}
			if (!StringUtils.isNullOrEmpty(contractMaster.getD402_dt_terminated())
					&& DateUtil.dateCompare(currentDate[0],
							DateUtil.julianToGregf2(contractMaster.getD402_dt_terminated())) == 1) {

				// invalid contract, terminated
				errorMessage = String.format(ContractConstants.JS003_TERMINATION_DATE,
						contractDetail.getFormalContractNumber(), contractMaster.getD402_dt_terminated());

			}
			if (!StringUtils.isNullOrEmpty(errorMessage)) {
				contractDetail.setResult("FAIL " + errorMessage);
				return contractDetail;
			}

			mapContractData(contractDetail, contractMaster);
			
			List<CDFMaster> cdfMasterList = contractServiceDAO.getBuyerDetails(contractDetail.getInternalContractNumber());

			String filterReporting = (!"G".equals(inPOLines.getRequisitionRecords().get(0).getReportingOffice()))
					? inPOLines.getRequisitionRecords().get(0).getReportingOffice()
					: contractMaster.getD402_rpt_off();

			/*
					Optional<CDFMaster> cdfMaster = Optional.ofNullable( cdfMasterList.stream()
					.filter((buyer) -> buyer.getD430_rpt_off().equals(filterReporting)
							&& buyer.getD430_bm_cd().equals(contractMaster.getD402_byr_cd()))
					.findFirst().get());
					*/
			
			CDFMaster cdfMasterFiltered =null;
			if(cdfMasterList!=null) {
				for(CDFMaster cdfMaster : cdfMasterList) {
					if(filterReporting.equals(cdfMaster.getD430_rpt_off()) && contractMaster.getD402_byr_cd().equals(cdfMaster.getD430_bm_cd())) {
						cdfMasterFiltered = cdfMaster;
					}
				}
			}
			
				
			if(cdfMasterFiltered!=null) {
				contractDetail.setBuyerEmailAddress(cdfMasterFiltered.getD430_email_adrs());
				contractDetail.setBuyerName(cdfMasterFiltered.getD430_bm_name());
				contractDetail.setBuyerPhoneNumber(cdfMasterFiltered.getD430_bm_phone_no());
				contractDetail.setSignatureName(cdfMasterFiltered.getD430_bm_name());
			}else {
				contractDetail.setResult(String.format(ContractConstants.JS004_CONTRACT_DATA,
						contractDetail.getBuyerCode(), inPOLines.getRequisitionRecords().get(0).getReportingOffice()));
				return contractDetail;
			}
			
			if (inPOLines.getTotalPOCost().compareTo(new BigDecimal(cdfMasterFiltered.getD430_bm_dval_lmt())) == 1
					&& (cdfMasterFiltered.getD430_bm_cd_alt() == null || cdfMasterFiltered.getD430_bm_cd_alt().trim().length() < 2)) {
				
				String dlrLmtMsg = String.format(ContractConstants.JS005_CONTRACT_DATA, 
						!StringUtils.isNullOrEmpty(contractDetail.getBuyerName())?contractDetail.getBuyerName():"",  
						new BigDecimal(cdfMasterFiltered.getD430_bm_dval_lmt()).intValue(), 
						inPOLines.getTotalPOCost().toBigInteger().intValue());
				
				contractDetail.setResult(dlrLmtMsg);
				
				return contractDetail;
			}

			contractDetail.setResult(ContractConstants.SUCCESS);
		}catch(CCSExceptions ex) {
			logger.error("Error in the ContractServiceDAO::{}", ex);
		}
		catch (ParseException ex) {
			logger.error("Error in the validateGetContractData::{}", ex);
			
		}

		return contractDetail;
	}
	
	/***
	 * To Map the Contractdata
	 * @param contractDetail
	 * @param contractMaster
	 * @return
	 */
	private void mapContractData(CSDetailPO contractDetail,ContractDataMaster contractMaster) {
		
		contractDetail.setACO(contractMaster.getD402_aco());
		contractDetail.setAcceptDays(contractMaster.getD402_accept_dys());
		contractDetail.setARNCode(contractMaster.getD402_arn_aro_cd());
		contractDetail.setARNDays(contractMaster.getD402_arn_aro_dys());
		contractDetail.setBuyerCode(contractMaster.getD402_byr_cd());
		contractDetail.setInternalContractNumber(contractMaster.getD402_cont_no());
		contractDetail.setDiscountTerms(contractMaster.getD402_disc_terms());
		contractDetail.setMaxPODollarValue(new BigDecimal(contractMaster.getD402_dval_max_ord()));
		contractDetail.setFOBCode(contractMaster.getD402_fob_cd());
		contractDetail.setPercentVariationMinus(contractMaster.getD402_pct_var_mi());
		contractDetail.setPercentVariationPlus(contractMaster.getD402_pct_var_pl());
		contractDetail.setShipDeliveryCode(contractMaster.getD402_ship_del_cd());
		contractDetail.setPurchaseOrderContractNumber(contractMaster.getD421_f_cont_no_ows());
	}

}
