package gov.gsa.fas.contractservice.service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException;
import com.google.gson.Gson;

import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.ContractsType;
import gov.gsa.fas.contractservice.contract.ListContractsType;
import gov.gsa.fas.contractservice.contract.PORecordsType;
import gov.gsa.fas.contractservice.contract.PORequestType;
import gov.gsa.fas.contractservice.dao.ContractServiceDAO;
import gov.gsa.fas.contractservice.dao.ContractServiceDAOImpl;
import gov.gsa.fas.contractservice.exception.ApplicationException;
import gov.gsa.fas.contractservice.exception.CCSExceptions;
import gov.gsa.fas.contractservice.model.Address;
import gov.gsa.fas.contractservice.model.CDFMaster;
import gov.gsa.fas.contractservice.model.ContractDataMaster;
import gov.gsa.fas.contractservice.model.PathParameters;
import gov.gsa.fas.contractservice.model.RequestWrapper;
import gov.gsa.fas.contractservice.util.ContractConstants;
import gov.gsa.fas.contractservice.util.ContractInternalIDType;
import gov.gsa.fas.contractservice.util.ContractServiceUtil;
import gov.gsa.fas.contractservice.util.DateUtil;


public class ContractServiceImpl implements ContractService {

	Logger logger = LoggerFactory.getLogger(ContractServiceImpl.class);

	private ContractServiceDAO contractServiceDAO;
	
	List<CSDetailPO> pOsResponse = new ArrayList<>();

	public RequestWrapper getListContractResponse(RequestWrapper inputStream) {
		try {
			validateListContractRequest(inputStream);

			ListContractsType listContractsType = getListContracts(inputStream.getPathParameters().getEntityid());
			return new RequestWrapper(ContractServiceUtil.marshall(listContractsType));
		} catch (ApplicationException ex) {
			return new RequestWrapper(
					ContractServiceUtil.marshallException(ContractConstants.FAULT_CODE, ex.getMessage()));
		}
	}

	public List<CSDetailPO> getContractData(List<PORecordsType> inPORequest) throws ApplicationException {

		logger.info("Begin of the getContractData() :: ");
		for(PORecordsType poRequest : inPORequest) {
			pOsResponse.add(validateRequest(poRequest));
		}
		
		logger.info("End of the getContractData() :: ");
		return pOsResponse;
	}

	/**
	 * Validate Input PO Request
	 * 
	 * @param inPOLines
	 * @return
	 * @throws ApplicationException 
	 */
	private CSDetailPO validateRequest(PORecordsType inPOLines) throws ApplicationException {

		logger.info("Begin of the validateRequest() :: ");

		CSDetailPO contractDetail = new CSDetailPO();
		if (StringUtils.isBlank(inPOLines.getContractNum())) {
			contractDetail.setResult(ContractConstants.MISSING_CONTRACT_NUMBER);
			return contractDetail;
		}
		if (inPOLines.getTotalPOCost() == null || BigDecimal.ZERO.compareTo(inPOLines.getTotalPOCost()) != -1) {
			contractDetail.setResult(ContractConstants.MISSING_TOTAL);
			return contractDetail;
		}
		if (StringUtils.isBlank(inPOLines.getPurchaseOrderNum())) {
			contractDetail.setResult(ContractConstants.MISSING_PURCHASE_NUMBER);
			return contractDetail;
		}

		if (StringUtils.isBlank(inPOLines.getRequisitionRecords().get(0).getRequisitionNumber())) {
			contractDetail.setResult(ContractConstants.MISSING_REQUISITION_NUMBER);
			return contractDetail;
		}

		/*
		 * check whether reporting office is empty or if the ro has more than one
		 * character
		 */
		if (StringUtils.isBlank(inPOLines.getRequisitionRecords().get(0).getReportingOffice())
				|| inPOLines.getRequisitionRecords().get(0).getReportingOffice().trim().length() > 1) {
			contractDetail.setResult(ContractConstants.MISSING_REPORTING_OFFICE);
			return contractDetail;
		}
		logger.info("End of the validateRequest() :: ");

		return validateGetContractData(contractDetail, inPOLines);
	}

	@Override
	public RequestWrapper getContractDetailsResponse(RequestWrapper inputStream) {
		try {
			RequestWrapper outputStream = this.validateContractDetailsRequest(inputStream);

			if (outputStream != null) {
				return outputStream;
			}

			ContractsType contractsType = getContractDetails(inputStream.getPathParameters().getContractid());
			if (contractsType == null){
				return new RequestWrapper(
						ContractServiceUtil.marshallException(ContractConstants.FAULT_CODE, ContractConstants.JS007_INVALID_DATA_CONTRACT_NUMBER));
			}
			return new RequestWrapper(ContractServiceUtil.marshall(contractsType));
		} catch (ApplicationException ex) {
			return new RequestWrapper(
					ContractServiceUtil.marshallException(ContractConstants.FAULT_CODE, ex.getMessage()));
		}
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
					ContractConstants.JS007_INVALID_DATA_CONTRACT_NUMBER));
			return inputStream;
		}
		return null;
	}

	private void validateListContractRequest(RequestWrapper inputStream) throws ApplicationException {
		PathParameters pathParameters = inputStream.getPathParameters();

		if (pathParameters == null || StringUtils.isBlank(pathParameters.getEntityid())
				|| pathParameters.getEntityid().length() != 9) {
			throw new ApplicationException(ContractConstants.JS007_INVALID_ENTITY_ID);
		}
	}

	public ContractsType getContractDetails(String contractId) throws ApplicationException {

		logger.info("getContractDetails : {} " , contractId);
		ContractServiceDAO contractServiceDAO = new ContractServiceDAOImpl();
		try {
			List<String> internals = contractServiceDAO.getInternalContractNumber(ContractInternalIDType.GSAM.get(contractId));
			if (internals == null || internals.size() <= 0) {
				internals = contractServiceDAO.getInternalContractNumber(ContractInternalIDType.FCON.get(contractId));
			}
			if (internals == null || internals.size() <= 0) {
				internals = new ArrayList<String>();
				internals.add(contractId);
			}

			if (internals != null && internals.size() > 0) {
				int counter = 1;
				for (String internal : internals) {
					Optional<ContractsType> contract = getContractsType(internal);
					if (contract.isPresent()) {
						ContractsType contractsType = contract.get();
						contractsType.setLineNumber(counter++);
						return contractsType;
					}
				}
				return null;
			} else {
				logger.info("No ContractDetails found for  : {} " , contractId);
				throw new ApplicationException(ContractConstants.JS007_NO_CONTRACTS_ENTITY_ID);
			}
		} catch (AmazonDynamoDBException ex) {
			throw new ApplicationException(ContractConstants.J090_INVALID_DATA);
		}
	}

	private ListContractsType getListContracts(String entityID) throws ApplicationException {

		ContractServiceDAO contractServiceDAO = new ContractServiceDAOImpl();
		try {
			List<String> internals = contractServiceDAO
					.getInternalContractNumber(ContractInternalIDType.DUNS.get(entityID));

			if (internals != null && internals.size() > 0) {
				ListContractsType contractsList = new ListContractsType();

				int counter = 1;
				for (String internal : internals) {

					Optional<ContractsType> contract = getContractsType(internal);

					if (contract.isPresent()) {
						ContractsType contractsType = contract.get();
						contractsType.setLineNumber(counter++);
						contractsList.getContracts().add(contractsType);
					}
				}
				return contractsList;
			} else {
				throw new ApplicationException(ContractConstants.JS007_NO_CONTRACTS_ENTITY_ID);
			}
		} catch (AmazonDynamoDBException ex) {
			throw new ApplicationException(ContractConstants.J020_CS_EXCEPTION);
		}
	}

	/***
	 * validation for contract data from the data base
	 * 
	 * @param contractDetail
	 * @return
	 * @throws ApplicationException 
	 */
	private CSDetailPO validateGetContractData(CSDetailPO contractDetail, PORecordsType inPOLines) throws ApplicationException, AmazonDynamoDBException {

		logger.info("Begin of the validateRequest() :: ");
		String[] currentDate = DateUtil.getDateTime();
		String errorMessage = "";
		try {
			logger.info("Invoking Dynamodb data access getContractByGSAM()  :: ");
			ContractServiceDAO contractServiceDAO = new ContractServiceDAOImpl();
			ContractDataMaster contractMaster = contractServiceDAO.getContractByGSAM(inPOLines.getContractNum());
			if (contractMaster == null) {
				contractDetail
				.setResult(String.format(ContractConstants.JS000_CONTRACT_DATA, inPOLines.getContractNum()));
				return contractDetail;
			}
			contractDetail.setPurchaseOrderNumber(inPOLines.getPurchaseOrderNum());
			contractDetail.setFormalContractNumber(inPOLines.getContractNum());
			contractDetail.setBuyerCode(inPOLines.getBuyerCode());
			if (!StringUtils.isBlank(contractMaster.getD402_cont_beg_dt()) && DateUtil.dateCompare(currentDate[0],
					DateUtil.julianToGregf2(contractMaster.getD402_cont_beg_dt())) == 2) {
				// invalid contract, beg date in future
				errorMessage = java.lang.String.format(ContractConstants.JS001_BEGIN_DATE,
						contractDetail.getFormalContractNumber(), DateUtil.julianToGregf2(contractMaster.getD402_cont_beg_dt()));
			}
			if (!StringUtils.isBlank(contractMaster.getD402_cont_end_dt()) && DateUtil.dateCompare(currentDate[0],
					DateUtil.julianToGregf2(contractMaster.getD402_cont_end_dt())) == 1) {
				// invalid contract, end date in the past
				errorMessage = java.lang.String.format(ContractConstants.JS002_END_DATE,
						contractDetail.getFormalContractNumber(), DateUtil.julianToGregf2(contractMaster.getD402_cont_end_dt()));
			}
			if (!StringUtils.isBlank(contractMaster.getD402_dt_terminated()) && DateUtil.dateCompare(currentDate[0],
					DateUtil.julianToGregf2(contractMaster.getD402_dt_terminated())) == 1) {

				// invalid contract, terminated
				errorMessage = String.format(ContractConstants.JS003_TERMINATION_DATE,
						contractDetail.getFormalContractNumber(), DateUtil.julianToGregf2(contractMaster.getD402_dt_terminated()));

			}
			if (!StringUtils.isBlank(errorMessage)) {
				contractDetail.setResult("FAIL " + errorMessage);
				return contractDetail;
			}

			mapContractData(contractDetail, contractMaster);

			logger.info("Invoking the data access getBuyerDetails() :: ");

			List<CDFMaster> cdfMasterList = contractServiceDAO
					.getBuyerDetails(contractDetail.getInternalContractNumber());

			String filterReporting = (!"G".equals(inPOLines.getRequisitionRecords().get(0).getReportingOffice()))
					? inPOLines.getRequisitionRecords().get(0).getReportingOffice()
							: contractMaster.getD402_rpt_off();

			/*
			 * Optional<CDFMaster> cdfMaster = Optional.ofNullable( cdfMasterList.stream()
			 * .filter((buyer) -> buyer.getD430_rpt_off().equals(filterReporting) &&
			 * buyer.getD430_bm_cd().equals(contractMaster.getD402_byr_cd()))
			 * .findFirst().get());
			 */
			logger.info("Filtered reporting office {}::", filterReporting);
			CDFMaster cdfMasterFiltered = null;
			if (cdfMasterList != null) {
				for (CDFMaster cdfMaster : cdfMasterList) {
					if (filterReporting.equals(cdfMaster.getD430_rpt_off())
							&& contractMaster.getD402_byr_cd().equals(cdfMaster.getD430_bm_cd())) {
						cdfMasterFiltered = cdfMaster;
					}
				}
			}

			if (cdfMasterFiltered != null) {
				contractDetail.setBuyerEmailAddress(cdfMasterFiltered.getD430_email_adrs());
				contractDetail.setBuyerName(cdfMasterFiltered.getD430_bm_name());
				contractDetail.setBuyerPhoneNumber(cdfMasterFiltered.getD430_bm_phone_no());
				contractDetail.setSignatureName(cdfMasterFiltered.getD430_bm_name());
			} else {
				contractDetail.setResult(String.format(ContractConstants.JS004_CONTRACT_DATA,
						contractDetail.getBuyerCode(), inPOLines.getRequisitionRecords().get(0).getReportingOffice()));
				return contractDetail;
			}

			if (inPOLines.getTotalPOCost().compareTo(new BigDecimal(cdfMasterFiltered.getD430_bm_dval_lmt())) == 1
					&& (cdfMasterFiltered.getD430_bm_cd_alt() == null
					|| cdfMasterFiltered.getD430_bm_cd_alt().trim().length() < 2)) {

				logger.info("Buyer Dollar Limit exceeded");

				String dlrLmtMsg = String.format(ContractConstants.JS005_CONTRACT_DATA,
						!StringUtils.isBlank(contractDetail.getBuyerName()) ? contractDetail.getBuyerName() : "",
								new BigDecimal(cdfMasterFiltered.getD430_bm_dval_lmt()).intValue(),
								inPOLines.getTotalPOCost().toBigInteger().intValue());

				contractDetail.setResult(dlrLmtMsg);

				return contractDetail;
			}

			contractDetail.setResult(ContractConstants.SUCCESS);
		} catch (AmazonClientException ex) {
			logger.error("Error in the ContractServiceDAO::{}", ex);
			throw new ApplicationException(ContractConstants.J020_CS_EXCEPTION);
		} catch (ParseException ex) {
			logger.error("Error in the validateGetContractData::{}", ex);

		}

		return contractDetail;
	}

	/***
	 * To Map the Contractdata
	 * 
	 * @param contractDetail
	 * @param contractMaster
	 * @return
	 */
	private void mapContractData(CSDetailPO contractDetail, ContractDataMaster contractMaster) {

		logger.info("Begin of the mapContractData() :: ");

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
		logger.info("End of the mapContractData() :: ");
	}

	private Optional<ContractsType> getContractsType(String internal) {
		Gson gson = new Gson();
		String[] currentDate = DateUtil.getDateTime();
		
		ContractServiceDAO contractServiceDAO = getContractServiceDAO();
		
		ContractsType contractsType = new ContractsType();

		String masterDetails = contractServiceDAO.getDetailsByPartitionKey(internal,
				ContractConstants.CONTRACT_SERVICE_SK_D402 + "_" + internal);

		if(StringUtils.isNotBlank(masterDetails)) {
					
			ContractDataMaster master = gson.fromJson(masterDetails, ContractDataMaster.class);
					
			contractsType.setContractNumber(internal);
			contractsType.setAcoRegion(master.getD402_aco());
			contractsType.setContractType(master.getD402_cont_ind());
			contractsType.setFormalContractNumber(master.getD402_gsam_cont_no());

			if (!StringUtils.isBlank(master.getD402_note())) {
				contractsType.setContractNotesList(master.getD402_note());
			}

			boolean includeContract = true;

			try {
				String contractBeginDate = master.getD402_cont_beg_dt();
				if (StringUtils.isNotBlank(contractBeginDate)
						&& DateUtil.dateCompare(currentDate[0], DateUtil.julianToGregf2(contractBeginDate)) == 2) {
					includeContract = false;
				}

				String contractEndDate = master.getD402_cont_end_dt();
				if (StringUtils.isNotBlank(contractEndDate)
						&& DateUtil.dateCompare(currentDate[0], DateUtil.julianToGregf2(contractEndDate)) == 1) {
					includeContract = false;
				}

				String contractTermDate = master.getD402_dt_terminated();
				if (StringUtils.isNotBlank(contractTermDate)
						&& DateUtil.dateCompare(currentDate[0], DateUtil.julianToGregf2(contractTermDate)) == 1) {
					includeContract = false;
				}

				contractsType.setContractBeginDate(
						DateUtil.stringToXMLGregorianCalendar(DateUtil.julianToGregf2(contractBeginDate)));
				contractsType.setContractEndDate(
						DateUtil.stringToXMLGregorianCalendar(DateUtil.julianToGregf2(contractEndDate)));
				contractsType.setContractEndDate(
						DateUtil.stringToXMLGregorianCalendar(DateUtil.julianToGregf2(contractTermDate)));

				StringBuffer contractorAddress = new StringBuffer();
				String addressDetails = contractServiceDAO.getDetailsByPartitionKey(internal,
						ContractConstants.CONTRACT_SERVICE_SK_D410 + "_" + internal);
				if(StringUtils.isNotBlank(addressDetails)) {
					Address address = gson.fromJson(addressDetails, Address.class);
					if (StringUtils.isNotBlank(address.getD410_mail_adrs_pc())) {
						String wadrs1 = address.getD410_mail_adrs_pc();
						String wadrs2 = address.getD410_mail_adrs1();
						String wadrs3 = address.getD410_mail_adrs2();
						String wcity = address.getD410_mail_city_nm();
						String wstate = address.getD410_mail_st();
						String wzip = address.getD410_mail_zip();
	
						wadrs1 = StringUtils.right(StringUtils.defaultString(wadrs1, ""), 32);
						wadrs2 = StringUtils.right(StringUtils.defaultString(wadrs2, "-"), 32);
						wadrs3 = StringUtils.right(StringUtils.defaultString(wadrs3, ""), 32);
						
						if (wadrs3 != null && wadrs3.trim().length() > 0) {
							contractorAddress.append(wadrs1.substring(0, 32) + wadrs2.substring(0, 32) + wadrs3.substring(0, 32)
							+ wcity + " " + wstate + " " + wzip);
							contractorAddress.trimToSize();
						} else {
							contractorAddress.append(
									wadrs1.substring(0, 32) + wadrs2.substring(0, 32) + wcity + " " + wstate + " " + wzip);
							contractorAddress.trimToSize();
						}
					} else {
						String wadrs1 = address.getD410_adrs1();
						String wadrs2 = address.getD410_adrs2();
						String wadrs3 = address.getD410_adrs3();
						String wcity = address.getD410_city_name();
						String wstate = address.getD410_st();
						String wzip = address.getD410_zip();
	
						wadrs1 = StringUtils.right(StringUtils.defaultString(wadrs1, ""), 32);
						wadrs2 = StringUtils.right(StringUtils.defaultString(wadrs2, "-"), 32);
						wadrs3 = StringUtils.right(StringUtils.defaultString(wadrs3, ""), 32);
	
						if (wadrs3 != null && wadrs3.trim().length() > 0) {
							contractorAddress.append(wadrs1.substring(0, 32) + wadrs2.substring(0, 32) + wadrs3.substring(0, 32)
							+ wcity + " " + wstate + " " + wzip);
							contractorAddress.trimToSize();
						} else {
							contractorAddress.append(
									wadrs1.substring(0, 32) + wadrs2.substring(0, 32) + wcity + " " + wstate + " " + wzip);
							contractorAddress.trimToSize();
						}
					}
	
					contractsType.setContractorAddress(contractorAddress.toString());
				}

				if (includeContract) {
					return Optional.of(contractsType);
				}

			} catch (ParseException ex) {
				logger.error(ex.getLocalizedMessage(), ex);
			}
		}
		return Optional.empty();
	}

	private ContractServiceDAO getContractServiceDAO() {
		if (contractServiceDAO == null) {
			contractServiceDAO = new ContractServiceDAOImpl();
		}
		return contractServiceDAO;
	}

}
