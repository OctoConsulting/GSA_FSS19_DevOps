package gov.gsa.fas.contractservice.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.Header;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.ContractsType;
import gov.gsa.fas.contractservice.contract.ListContractsType;
import gov.gsa.fas.contractservice.contract.PORecordsType;
import gov.gsa.fas.contractservice.contract.Range;
import gov.gsa.fas.contractservice.contract.RequisitionRes;
import gov.gsa.fas.contractservice.dao.ContractServiceDAO;
import gov.gsa.fas.contractservice.dao.ContractServiceDAOImpl;
import gov.gsa.fas.contractservice.exception.ApplicationException;
import gov.gsa.fas.contractservice.exception.CCSExceptions;
import gov.gsa.fas.contractservice.exception.RecordNotFoundException;
import gov.gsa.fas.contractservice.model.ACCMapping;
import gov.gsa.fas.contractservice.model.ACOContractDetails;
import gov.gsa.fas.contractservice.model.Address;
import gov.gsa.fas.contractservice.model.CDFMaster;
import gov.gsa.fas.contractservice.model.CFFContractFinder;
import gov.gsa.fas.contractservice.model.ContractDataMaster;
import gov.gsa.fas.contractservice.model.EDIFax;
import gov.gsa.fas.contractservice.model.NIFData;
import gov.gsa.fas.contractservice.model.PathParameters;
import gov.gsa.fas.contractservice.model.RequestWrapper;
import gov.gsa.fas.contractservice.model.VolumeDiscount;
import gov.gsa.fas.contractservice.model.VolumeRange;
import gov.gsa.fas.contractservice.util.ContractConstants;
import gov.gsa.fas.contractservice.util.ContractInternalIDType;
import gov.gsa.fas.contractservice.util.ContractServiceUtil;
import gov.gsa.fas.contractservice.util.DateUtil;
import gov.gsa.fas.contractservice.util.FormatDate;




public class ContractServiceImpl implements ContractService {

	Logger logger = LoggerFactory.getLogger(ContractServiceImpl.class);

	private ContractServiceDAO contractServiceDAO;

	List<CSDetailPO> pOsResponse = new ArrayList<>();

	int notesCount = 0;

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
		for (PORecordsType poRequest : inPORequest) {
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
						ContractServiceUtil.marshallException(ContractConstants.FAULT_CODE, ContractConstants.JS007_INVALID_DATA_CONTRACT_NUMBER+inputStream.getPathParameters().getContractid()));

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
					ContractConstants.JS007_INVALID_DATA_CONTRACT_NUMBER+inputStream.getPathParameters().getContractid()));
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

		logger.info("getContractDetails : {} ", contractId);
		ContractServiceDAO contractServiceDAO = new ContractServiceDAOImpl();
		try {
			List<String> internals = contractServiceDAO
					.getInternalContractNumber(ContractInternalIDType.GSAM.get(contractId));
//			if (internals == null || internals.size() <= 0) {
//				internals = contractServiceDAO.getInternalContractNumber(ContractInternalIDType.FCON.get(contractId));
//			}
			if (internals == null || internals.size() <= 0) {
				internals = new ArrayList<String>();
				internals.add(contractId);
			}

			if (internals != null && internals.size() > 0) {
				int counter = 1;
				for (String internal : internals) {
					Optional<ContractsType> contract = getContractsType(internal, ContractConstants.FLOW_TYPE_CONTRACTDETAILS);
					if (contract.isPresent()) {
						ContractsType contractsType = contract.get();
						contractsType.setLineNumber(counter++);
						return contractsType;
					}
				}
				return null;
			} else {
				logger.info("No ContractDetails found for  : {} " , contractId);
				throw new ApplicationException(ContractConstants.JS007_INVALID_DATA_CONTRACT_NUMBER + contractId);
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

					Optional<ContractsType> contract = getContractsType(internal, ContractConstants.FLOW_TYPE_LISTCONTRACTS);

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
	private CSDetailPO validateGetContractData(CSDetailPO contractDetail, PORecordsType inPOLines) 
			throws ApplicationException, AmazonDynamoDBException {

		logger.info("Begin of the validateRequest() :: ");

		try {
			logger.info("Invoking Dynamodb data access getContractByGSAM()  :: ");
			String contractAddress = "";
			String owContractNumber ="";
			RequisitionRes reqnRes = new RequisitionRes();
			List<RequisitionRes> reqResList = new ArrayList<RequisitionRes>();
			ContractServiceDAO contractServiceDAO = new ContractServiceDAOImpl();
			ContractDataMaster contractMaster = contractServiceDAO.getContractByGSAM(inPOLines.getContractNum());

			if (contractMaster != null) {
				owContractNumber = contractServiceDAO.getCMFColumns(contractMaster.getD402_cont_no(), ContractConstants.SK_D421_OWS);
				try {
					contractAddress = extractAddress(contractMaster.getD402_cecc());
				} catch (RecordNotFoundException  e) {
					logger.error("Record not found in the entity database::",e );
					contractAddress="";
				}catch (CCSExceptions e) {
					contractAddress="";
					logger.error("Error while invoking the API::",e );
				}
			}

			if (contractMaster == null || StringUtils.isBlank(contractAddress) || StringUtils.isBlank(owContractNumber)) {
				contractDetail
						.setResult(String.format(ContractConstants.JS000_CONTRACT_DATA, inPOLines.getContractNum()));
				return contractDetail;
			}
			String purchaseOrderContNum = owContractNumber.substring(ContractConstants.SK_D421_OWS.length(), owContractNumber.length());
			contractDetail.setPurchaseOrderContractNumber(purchaseOrderContNum);
			contractDetail.setContractorAddress(contractAddress);
			contractDetail.setPurchaseOrderNumber(inPOLines.getPurchaseOrderNum());
			contractDetail.setFormalContractNumber(inPOLines.getContractNum());
			contractDetail.setBuyerCode(inPOLines.getBuyerCode());
			contractDetail.setReportingOffice(inPOLines.getRequisitionRecords().get(0).getReportingOffice());
			String datesErrorMessage = contractDatesValidation(contractDetail, contractMaster);

			if (StringUtils.isNotBlank(datesErrorMessage)) {
				contractDetail.setResult("FAIL " + datesErrorMessage);
				return contractDetail;
			}
			mapContractData(contractDetail, contractMaster);

			logger.info("Invoking the data access getBuyerDetails() :: ");

			//List<CDFMaster> cdfMasterList = null;

			if (StringUtils.isNotBlank(contractDetail.getContractNotesList())) { // P2S2 : need to revisit if we need this noteslist condition
				//cdfMasterList = contractServiceDAO.getBuyerDetails(contractDetail.getInternalContractNumber());
				contractDetail = getNotesDetails(contractDetail, inPOLines, contractMaster); // Buyer code related logic . 

				if (StringUtils.isNotBlank(contractDetail.getResult())) {
					return contractDetail;
				}
			}

			/*
			 * for now we are assigning main address to suplier address, once we are done
			 * with the API we will change this logic
			 */
			
			String supplierAddress;
			try {
				supplierAddress = extractAddress(contractMaster.getD402_cecs());
			} catch (RecordNotFoundException e) {
				logger.error("Record not found in the entity database::", e);
				supplierAddress = "";
			} catch (CCSExceptions e) {
				supplierAddress = "";
				logger.error("Error while invoking the API::", e);
			}

			contractDetail.setSupplierAddress(supplierAddress);

			String fssiType = StringUtils.isNotBlank(contractMaster.getD402_fssi_type())
					? contractMaster.getD402_fssi_type()
					: "";
			CFFContractFinder cffContractFinder = null;
			String wZone = "";
			String cffRptOff = "";
			String cffNoteCode = "";
			if (StringUtils.isNotBlank(fssiType) && 0 != fssiType.trim().length()) {
				if (inPOLines.getRequisitionRecords().get(0).getPricingZone().matches("01|02|03|04|05|13")) {
					wZone = "97";
				} else {
					if (inPOLines.getRequisitionRecords().get(0).getPricingZone().matches("06|07|08|09|10|11|12")) {
						wZone = "98";
					}
				}
			}

			// fetch and update the response for MSDSCode, FOBCode from CFF
			if (inPOLines.getRequisitionRecords() != null && !inPOLines.getRequisitionRecords().isEmpty()
					&& StringUtils.isNotBlank(inPOLines.getRequisitionRecords().get(0).getPricingZone())
					&& !"00".equals(inPOLines.getRequisitionRecords().get(0).getPricingZone().trim())) {

				List<CFFContractFinder> cffContractFinderList = contractServiceDAO
						.getCFFDetail(contractMaster.getD402_cont_no());

				if (cffContractFinderList != null && !cffContractFinderList.isEmpty()) {
					for (CFFContractFinder buyer : cffContractFinderList) {
						if (inPOLines.getRequisitionRecords().get(0).getItemNumber().equals(buyer.getD407_nsn())
								&& wZone.equals(buyer.getD407_zone_sdf())) {
							cffContractFinder = buyer;
						}
					}
				}
				

				if (cffContractFinder != null) {
					contractDetail.setPOPCode(cffContractFinder.getD407_pop_cd());
					contractDetail.setMSDSCOde(cffContractFinder.getD407_msds_cd());
					if (StringUtils.isNotBlank(cffContractFinder.getD407_fob_cd())) {
						contractDetail.setFOBCode(cffContractFinder.getD407_fob_cd());
					}
					String byrCode = StringUtils.isNotBlank(inPOLines.getBuyerCode()) ? inPOLines.getBuyerCode()
							: cffContractFinder.getD407_byr_cd();
					contractDetail.setBuyerCode(byrCode);
					cffRptOff = cffContractFinder.getD407_rpt_off();
					cffNoteCode = cffContractFinder.getD407_note_cd();
				}
			}

			String contractNotes="";
			try {
				contractNotes = getContractReportingOfficeNotes(contractMaster);
				contractDetail.setContractNotesDetails(contractNotes);
			} catch (CCSExceptions e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			
			
			String nsnAPIKey = StringUtils.isNotBlank(System.getenv(ContractConstants.NSN_API_KEY))
					? System.getenv(ContractConstants.NSN_API_KEY)
					: "qabzpuu991";

			NIFData nifData = null;
			try {
				String nifdataJson = invokeAPI(nsnAPIKey, inPOLines.getRequisitionRecords().get(0).getItemNumber(), ContractConstants.NSN_API_URL);
				nifData = new Gson().fromJson(nifdataJson, NIFData.class);
			} catch (RecordNotFoundException e) {
				logger.error("Record not found in the NSN database::", e);
				nifData = null;
			} catch (CCSExceptions e) {
				nifData=null;
				logger.error("Error while invoking the API::", e);
			}


			if (nifData != null) {
				contractDetail.setDORating(nifData.getD403_d_o_rating());
			}
			StringBuffer itemNotes = new StringBuffer();
			int itemNotesCount = 0;
			String wNSNNotes1 = "";
			String wNSNNotes2 = "";
			String wNSNNotes3 = "";
			String wNSNNotes4 = "";
			String wNSNNotes5 = "";

			reqnRes.setReportingOffice(contractDetail.getReportingOffice());
			reqnRes.setRequistionLineNumber(1);
			reqnRes.setRequisitionNumber(inPOLines.getRequisitionRecords().get(0).getRequisitionNumber());

			if (cffContractFinder != null && ("C".equals(cffContractFinder.getD407_pop_cd())
					|| "M".equals(cffContractFinder.getD407_pop_cd()))) {
				wNSNNotes1 = ContractConstants.POP_C_M_LIT_1;
				wNSNNotes2 = ContractConstants.POP_C_M_LIT_2;
			}

			// D40Q-DAC NOT < "XX" AND D40Q-DAC NOT > "Z9"
			// A" OR "B" OR "C" OR "D" OR "H"

			if (nifData != null && StringUtils.isNotBlank(nifData.getD403_dac())
					&& (nifData.getD403_dac().compareTo("XX") < 0 || nifData.getD403_dac().compareTo("Z9") > 0)
					&& contractDetail.getFOBCode() != null && cffContractFinder != null
					&& cffContractFinder.getD407_fob_cd().contains(contractDetail.getFOBCode())) {
				wNSNNotes4 = ContractConstants.DAC_LIT_1;
				wNSNNotes5 = ContractConstants.DAC_LIT_2;

				if (cffContractFinder != null && StringUtils.isNotBlank(nifData.getD403_proper_name())) {
					wNSNNotes3 = "DOT PROPER SHIPPING NAME: " + nifData.getD403_proper_name();
				}

			}

			if (StringUtils.isNotBlank(cffNoteCode) && StringUtils.isBlank(cffRptOff)) {

				cffRptOff = contractMaster.getD402_rpt_off();

			}
			if (wNSNNotes1.trim().length() > 0) {
				itemNotes.append(wNSNNotes1 + "\n");

				itemNotesCount++;
			}
			if (wNSNNotes2.trim().length() > 0) {
				itemNotes.append(wNSNNotes2 + "\n");

				itemNotesCount++;
			}
			if (wNSNNotes3.trim().length() > 0) {
				itemNotes.append(wNSNNotes3 + "\n");

				itemNotesCount++;
			}
			if (wNSNNotes4.trim().length() > 0) {
				itemNotes.append(wNSNNotes4 + "\n");

				itemNotesCount++;
			}
			if (wNSNNotes5.trim().length() > 0) {
				itemNotes.append(wNSNNotes5 + "\n");

				itemNotesCount++;
			}

			// P2S2 -- Need to revisit this logic for NOTES
			CDFMaster cdfNotes = null;
//			if (cdfMasterList != null) {
//				for (CDFMaster cdfMaster : cdfMasterList) {
//					if (cffRptOff.equals(cdfMaster.getD430_rpt_off())
//							&& cffNoteCode.equals(cdfMaster.getD430_note_cd())) {
//						cdfNotes = cdfMaster;
//					}
//				}
//			}

			if (cdfNotes != null) {
				notesCount++;
				itemNotesCount++;
				itemNotes.append(cdfNotes.getD430_note1() + " " + cdfNotes.getD430_note2() + "\n");
			}

			reqnRes.setItemNotes(itemNotes.toString());
			reqnRes.setItemNotesCount("" + itemNotesCount);
			reqResList.add(reqnRes);
			contractDetail.setRequisitionLinesRes(reqResList);

			String instrumentType = deriveInstrumntType(contractMaster.getD402_pr_mthd(),
					contractMaster.getD402_cont_ind());
			logger.info("Instrument determinde is {}", instrumentType);
			contractDetail.setInstrumentType(instrumentType);
			String contractReportingOffceAddress = contratReportingOfficeAddress(contractDetail.getReportingOffice());
			contractDetail.setReportOfficeAddress(contractReportingOffceAddress);

			String acoAddress = getACOOfficeAddress(contractMaster.getD402_aco());
			contractDetail.setAcoAddress(acoAddress);
			setEDIFax(contractDetail);
			setReportingOfficeAAC(contractDetail);
			setBpaServiceChargeNote(contractDetail, contractMaster, inPOLines.getTotalPOCost());
			getVolumeDiscount(contractDetail, inPOLines.getTotalPOCost());
			if (StringUtils.isBlank(contractDetail.getResult())) {
				contractDetail.setResult(ContractConstants.SUCCESS);
			}

		} catch (AmazonClientException ex) {
			logger.error("Error in the ContractServiceDAO::{}", ex);
			throw new ApplicationException(ContractConstants.J020_CS_EXCEPTION);
		} catch (ParseException ex) {
			logger.error("Error in the validateGetContractData::{}", ex);

		}
		catch(IOException ex) {
			logger.error("Error in the validateGetContractData::{}", ex);
		}

		return contractDetail;
	}

	private CSDetailPO getNotesDetails(CSDetailPO contractDetail, PORecordsType inPOLines, ContractDataMaster contractMaster) {
		String filterReporting = (!"G".equals(inPOLines.getRequisitionRecords().get(0).getReportingOffice()))
				? inPOLines.getRequisitionRecords().get(0).getReportingOffice()
				: contractMaster.getD402_rpt_off();
//
//		logger.info("Filtered reporting office {}::", filterReporting);
//		CDFMaster cdfMasterFiltered = null;
//		if (cdfMasterList != null) {
//			for (CDFMaster cdfMaster : cdfMasterList) {
//				if (filterReporting.equals(cdfMaster.getD430_rpt_off())
//						&& contractMaster.getD402_byr_cd().equals(cdfMaster.getD430_bm_cd())) {
//					cdfMasterFiltered = cdfMaster;
//				}
//			}
//		}
//
//		BigDecimal byrDollarLimit = null;
//		String byrALT = "";
//		if (cdfMasterFiltered != null) {
//			contractDetail.setBuyerEmailAddress(cdfMasterFiltered.getD430_email_adrs());
//			contractDetail.setBuyerName(cdfMasterFiltered.getD430_bm_name());
//			contractDetail.setBuyerPhoneNumber(cdfMasterFiltered.getD430_bm_phone_no());
//			contractDetail.setSignatureName(cdfMasterFiltered.getD430_bm_name());
//			byrDollarLimit = new BigDecimal(cdfMasterFiltered.getD430_bm_dval_lmt());
//			byrALT = cdfMasterFiltered.getD430_bm_cd_alt();
//		} else {
//			contractDetail.setResult(String.format(ContractConstants.JS004_CONTRACT_DATA, contractDetail.getBuyerCode(),
//					filterReporting));
//			return contractDetail;
//		}
//
//		if (inPOLines.getTotalPOCost().compareTo(byrDollarLimit) == 1 && (cdfMasterFiltered.getD430_bm_cd_alt() == null
//				|| cdfMasterFiltered.getD430_bm_cd_alt().trim().length() < 2)) {
//
//			logger.info("Buyer Dollar Limit exceeded");
//
//			String dlrLmtMsg = String.format(ContractConstants.JS005_CONTRACT_DATA,
//					StringUtils.isNotBlank(contractDetail.getBuyerName()) ? contractDetail.getBuyerName() : "",
//					new BigDecimal(cdfMasterFiltered.getD430_bm_dval_lmt()).intValue(),
//					inPOLines.getTotalPOCost().toBigInteger().intValue());
//
//			contractDetail.setResult(dlrLmtMsg);
//
//			return contractDetail;
//		}
//
//		if (inPOLines.getTotalPOCost().compareTo(byrDollarLimit) == 1) {
//			cdfMasterFiltered = null;
//			for (CDFMaster cdfMaster : cdfMasterList) {
//				if (filterReporting.equals(cdfMaster.getD430_rpt_off())
//						&& contractMaster.getD402_byr_cd().equals(byrALT)) {
//					cdfMasterFiltered = cdfMaster;
//				}
//			}
//
//			if (cdfMasterFiltered != null) {
//				contractDetail.setSignatureName(cdfMasterFiltered.getD430_bm_name());
//				byrDollarLimit = new BigDecimal(cdfMasterFiltered.getD430_bm_dval_lmt());
//				byrALT = cdfMasterFiltered.getD430_bm_cd_alt();
//			} else {
//				contractDetail.setResult(String.format(ContractConstants.JS006_CONTRACT_DATA, byrALT, filterReporting));
//				return contractDetail;
//			}
//
//			if (inPOLines.getTotalPOCost().compareTo(byrDollarLimit) == 1
//					&& (cdfMasterFiltered.getD430_bm_cd_alt() == null
//							|| cdfMasterFiltered.getD430_bm_cd_alt().trim().length() < 2)) {
//
//				logger.info("Buyer Dollar Limit exceeded");
//
//				String dlrLmtMsg = String.format(ContractConstants.JS005_CONTRACT_DATA, byrALT,
//						new BigDecimal(cdfMasterFiltered.getD430_bm_dval_lmt()).intValue(),
//						inPOLines.getTotalPOCost().toBigInteger().intValue());
//
//				contractDetail.setResult(dlrLmtMsg);
//
//				return contractDetail;
//			}
//			cdfMasterFiltered = null;
//			if (inPOLines.getTotalPOCost().compareTo(byrDollarLimit) == 1) {
//				for (CDFMaster cdfMaster : cdfMasterList) {
//					if (filterReporting.equals(cdfMaster.getD430_rpt_off())
//							&& contractMaster.getD402_byr_cd().equals(byrALT)) {
//						cdfMasterFiltered = cdfMaster;
//					}
//				}
//			}
//			if (cdfMasterFiltered != null) {
//				contractDetail.setSignatureName(cdfMasterFiltered.getD430_bm_name());
//				byrDollarLimit = new BigDecimal(cdfMasterFiltered.getD430_bm_dval_lmt());
//				byrALT = cdfMasterFiltered.getD430_bm_cd_alt();
//			} else {
//				contractDetail.setResult(String.format(ContractConstants.JS006_CONTRACT_DATA, byrALT, filterReporting));
//				return contractDetail;
//			}
//
//			/* validating the dollar value limit with PO Total */
//			if (inPOLines.getTotalPOCost().compareTo(byrDollarLimit) == 1) {
//				String dlrLmtMsg = String.format(ContractConstants.JS005_CONTRACT_DATA, byrALT,
//						new BigDecimal(cdfMasterFiltered.getD430_bm_dval_lmt()).intValue(),
//						inPOLines.getTotalPOCost().toBigInteger().intValue());
//
//				contractDetail.setResult(dlrLmtMsg);
//			}
//		}
		return contractDetail;
	}

	/***
	 * contract dates validation
	 * 
	 * @param contractDetail
	 * @param contractMaster
	 * @return
	 * @throws ParseException
	 */
	private String contractDatesValidation(CSDetailPO contractDetail, ContractDataMaster contractMaster)
			throws ParseException {
		String[] currentDate = DateUtil.getDateTime();
		String errorMessage = "";
		if (StringUtils.isNotBlank(contractMaster.getD402_cont_beg_dt()) && DateUtil.dateCompare(currentDate[0],
				DateUtil.julianToGregf2(contractMaster.getD402_cont_beg_dt())) == 2) {
			// invalid contract, beg date in future
			errorMessage = java.lang.String.format(ContractConstants.JS001_BEGIN_DATE,
					contractDetail.getFormalContractNumber(),
					DateUtil.julianToGregf2(contractMaster.getD402_cont_beg_dt()));
		}
		if (StringUtils.isNotBlank(contractMaster.getD402_cont_end_dt()) && DateUtil.dateCompare(currentDate[0],
				DateUtil.julianToGregf2(contractMaster.getD402_cont_end_dt())) == 1) {
			// invalid contract, end date in the past
			errorMessage = java.lang.String.format(ContractConstants.JS002_END_DATE,
					contractDetail.getFormalContractNumber(),
					DateUtil.julianToGregf2(contractMaster.getD402_cont_end_dt()));
		}
		if (StringUtils.isNotBlank(contractMaster.getD402_dt_terminated()) && DateUtil.dateCompare(currentDate[0],
				DateUtil.julianToGregf2(contractMaster.getD402_dt_terminated())) == 1) {

			// invalid contract, terminated
			errorMessage = String.format(ContractConstants.JS003_TERMINATION_DATE,
					contractDetail.getFormalContractNumber(),
					DateUtil.julianToGregf2(contractMaster.getD402_dt_terminated()));

		}
		return errorMessage;
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

		List<String> inspectionOriginCodes = Arrays.asList("1", "4", "5", "7", "9");
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
		contractDetail.setContractNotesList(contractMaster.getD402_note_cd());

		if (StringUtils.isNotBlank(contractMaster.getD402_insp_cd())
				&& !("D").equals(contractMaster.getD402_insp_cd())) {
			contractDetail.setInspectAcceptByOriginRegion(contractMaster.getD402_insp_cd());
		}
		if (inspectionOriginCodes.contains(contractMaster.getD402_insp_cd())) {
			contractDetail.setInspectionPoint("S");
		} else {
			contractDetail.setInspectionPoint("D");
		}
		
		if(StringUtils.isNotBlank(contractMaster.getD402_sch_cont_no())){
			String parentMASContractNumber = contractServiceDAO.getCMFColumns(contractMaster.getD402_cont_no(), ContractConstants.SK_D421_F);
			if(StringUtils.isNotBlank(parentMASContractNumber)) {
				String subParentMASCont = parentMASContractNumber.substring(ContractConstants.SK_D421_F.length());
				contractDetail.setParentMASContractNumber(subParentMASCont);
			}
			
		}

		logger.info("End of the mapContractData() :: ");
	}

	private Optional<ContractsType> getContractsType(String internal, String flowTypeListcontracts) {
		Gson gson = new Gson();
		String[] currentDate = DateUtil.getDateTime();

		ContractServiceDAO contractServiceDAO = getContractServiceDAO();

		ContractsType contractsType = new ContractsType();

		String masterDetails = contractServiceDAO.getDetailsByPartitionKey(internal,
				ContractConstants.CONTRACT_SERVICE_SK_D402 + "_" + internal);

		if (StringUtils.isNotBlank(masterDetails)) {

			ContractDataMaster master = gson.fromJson(masterDetails, ContractDataMaster.class);

			contractsType.setContractNumber(internal);
			contractsType.setAcoRegion(master.getD402_aco());
			contractsType.setContractType(master.getD402_cont_ind());
			contractsType.setFormalContractNumber(master.getD402_gsam_cont_no());

			if (!StringUtils.isBlank(master.getD402_note_cd())) {
				contractsType.setContractNotesList(master.getD402_note_cd());
			}

			boolean includeContract = true;

			try {
				String contractBeginDate = master.getD402_cont_beg_dt();
				if (StringUtils.isNotBlank(contractBeginDate)
						&& DateUtil.dateCompare(currentDate[0], DateUtil.julianToGregf2(contractBeginDate)) == 2) {
					if(ContractConstants.FLOW_TYPE_CONTRACTDETAILS.equalsIgnoreCase(flowTypeListcontracts)){
						contractsType.setContractRemarks("Contract has not Begun. Begin date is " + FormatDate.formatDateDDMMMYYYY(DateUtil.julianToGregf2(contractBeginDate)));
					} else { 
						includeContract = false;
					}
				}

				String contractEndDate = master.getD402_cont_end_dt();
				if (StringUtils.isNotBlank(contractEndDate)
						&& DateUtil.dateCompare(currentDate[0], DateUtil.julianToGregf2(contractEndDate)) == 1) {
					if(ContractConstants.FLOW_TYPE_CONTRACTDETAILS.equalsIgnoreCase(flowTypeListcontracts)){
						contractsType.setContractRemarks("Contract has ended. End date was "  + FormatDate.formatDateDDMMMYYYY(DateUtil.julianToGregf2(contractEndDate)));
					} else { 
						includeContract = false;
					}
				}

				String contractTermDate = master.getD402_dt_terminated();
				if (StringUtils.isNotBlank(contractTermDate)
						&& DateUtil.dateCompare(currentDate[0], DateUtil.julianToGregf2(contractTermDate)) == 1) {
					if(ContractConstants.FLOW_TYPE_CONTRACTDETAILS.equalsIgnoreCase(flowTypeListcontracts)){
						contractsType.setContractRemarks("Contract has been terminated. Termination Date was " + FormatDate.formatDateDDMMMYYYY(DateUtil.julianToGregf2(contractTermDate)));
					} else { 
						includeContract = false;
					}
				}

				contractsType.setContractBeginDate(
						DateUtil.stringToXMLGregorianCalendar(DateUtil.julianToGregf2(contractBeginDate)));
				contractsType.setContractEndDate(
						DateUtil.stringToXMLGregorianCalendar(DateUtil.julianToGregf2(contractEndDate)));
				contractsType.setContractEndDate(
						DateUtil.stringToXMLGregorianCalendar(DateUtil.julianToGregf2(contractTermDate)));

				if (ContractConstants.FLOW_TYPE_CONTRACTDETAILS.equalsIgnoreCase(flowTypeListcontracts)){
					if (contractsType.getContractRemarks() == null || contractsType.getContractRemarks().trim().length() < 1){
						contractsType.setContractRemarks("Contract is active");
						contractsType.setContractorDUNS(master.getD402_cecc());
					}
				}
				else {
					contractsType.setContractRemarks(null);
					contractsType.setContractorDUNS(null);
				}
				
				String contractAddress;
				try {
					contractAddress = extractAddress(master.getD402_cecc());
				} catch (RecordNotFoundException | CCSExceptions e) {
					contractAddress="";
				}

				contractsType.setContractorAddress(contractAddress);
				
//				List<CDFMaster> cdfMasterList = contractServiceDAO
//						.getBuyerDetails(internal);
			//	Notes Detail pending
				String contractNotes = getContractReportingOfficeNotes(master);
				contractsType.setContractNotesDetails(contractNotes);
				
				EDIFax edifaxDetails = contractServiceDAO.getEDIFax(internal);
				contractsType.setEfptIndicator(edifaxDetails.getD411_efpt_ind());
				contractsType.setEdiMessageSetVersion(StringUtils.isNotBlank(edifaxDetails.getD411_x12_version())?edifaxDetails.getD411_x12_version():null);
				
				setAcoContractDetails(internal,contractsType, master);

				if (includeContract) {
					return Optional.of(contractsType);
				}

			} catch (ParseException ex) {
				logger.error(ex.getLocalizedMessage(), ex);
			} catch (MalformedURLException ex) {
				logger.error(ex.getLocalizedMessage(), ex);
			} catch (IOException ex) {
				logger.error(ex.getLocalizedMessage(), ex);
			} catch (CCSExceptions ex) {
				logger.error(ex.getLocalizedMessage(), ex);
			}
		}
		return Optional.empty();
	}

	private String getContractReportingOfficeNotes(ContractDataMaster master)
			throws MalformedURLException, IOException, CCSExceptions {
		String notes ="";
		Gson gson =  new Gson();
		try {
			String contractConstantAPIKey = StringUtils.isNotBlank(System.getenv(ContractConstants.CONTRACT_CONSTANT_API_KEY))
					? System.getenv(ContractConstants.CONTRACT_CONSTANT_API_KEY)
					: "on890eyswh";
			CDFMaster cdfMaster = new CDFMaster();
			cdfMaster.setD430_rpt_off(master.getD402_rpt_off());
			cdfMaster.setD430_rec_type("N"); // always set to N for notes 
			notes = this.invokePostAPI(contractConstantAPIKey, ContractConstants.CONTRACT_CONSTANT_NOTES_API_URL,gson.toJson(cdfMaster) );
		} catch (RecordNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Type userListType = new TypeToken<List<CDFMaster>>(){}.getType();
		 
		List<CDFMaster> cdfNotesDetails = gson.fromJson(notes, userListType);  
		//List<CDFMaster> cdfNotesDetails = gson.fromJson(noteArrList, List.class);
		String contractNotes = contractNotes(master,cdfNotesDetails);
		return contractNotes;
	}

	private void setAcoContractDetails(String internal, ContractsType contractsType  ,ContractDataMaster master) {
		if(contractsType!=null && !"R".equalsIgnoreCase(contractsType.getAcoRegion())) {
			String aco_region = "";
			aco_region = contractsType.getAcoRegion();
			if (aco_region.equals("1")) {
				aco_region = "B";
			} else if (aco_region.equals("4")) {
				aco_region = "A";
			} else if (aco_region.equals("5")) {
				aco_region = "C";
			} else if (aco_region.equals("9")) {
				aco_region = "S";
			}
			String acoContactDetails = getContractServiceDAO().getDetailsByPartitionKey(internal,
					ContractConstants.CONTRACT_SERVICE_SK_MQCID + "_" + internal + "_" +master.getD402_qc_aco()+"_"+ aco_region +"_"+"A");
			if (StringUtils.isNotBlank(acoContactDetails)) {
				Gson gson = new Gson();
				ACOContractDetails acoContractDetail = new ACOContractDetails();
				acoContractDetail = gson.fromJson(acoContactDetails, ACOContractDetails.class);
				contractsType.setAcoName(acoContractDetail.getFull_name());
				contractsType.setAcoPhone(acoContractDetail.getPhone());
				contractsType.setAcoEmail(acoContractDetail.getGen_email());
			}
		}
	}


	/***
	 * this method used to set the address for get contract data /list
	 * 
	 * @param internal
	 * @param contractServiceDAO
	 * @return
	 * @throws IOException 
	 * @throws MalformedURLException 
	 * @throws RecordNotFoundException 
	 * @throws CCSExceptions 
	 */
	private String extractAddress(String entityId) throws MalformedURLException, IOException, RecordNotFoundException, CCSExceptions {
		
		StringBuffer contractorAddress = new StringBuffer();

		String entityAPIKey = StringUtils.isNotBlank(System.getenv(ContractConstants.ENTITY_API_KEY))
				? System.getenv(ContractConstants.ENTITY_API_KEY)
				: "xehygqufuk";

		String addressDetails = invokeAPI(entityAPIKey, entityId, ContractConstants.ENTITY_API_URL);

		if (StringUtils.isNotBlank(addressDetails)) {
			Gson gson = new Gson();
			Address address = gson.fromJson(addressDetails, Address.class);
			if (StringUtils.isNotBlank(address.getD410_mail_adrs_pc())) {
				String wadrs1 = address.getD410_mail_adrs_pc();
				String wadrs2 = address.getD410_mail_adrs1();
				String wadrs3 = address.getD410_mail_adrs2();
				String wcity = address.getD410_mail_city_nm();
				String wstate = address.getD410_mail_st();
				String wzip = address.getD410_mail_zip();

				wadrs1 = StringUtils.rightPad(StringUtils.defaultString(wadrs1, ""), 32);
				wadrs2 = StringUtils.rightPad(StringUtils.defaultString(wadrs2, "-"), 32);
				wadrs3 = StringUtils.rightPad(StringUtils.defaultString(wadrs3, ""), 32);

				if (wadrs3 != null && wadrs3.trim().length() > 0) {
					contractorAddress.append(wadrs1.substring(0, 32) + wadrs2.substring(0, 32) + wadrs3.substring(0, 32)
							+ wcity + " " + wstate + " " + wzip);
					contractorAddress.trimToSize();
				} else {
					logger.info("Address1: {}", wadrs1);
					logger.info("Address2: {}", wadrs2);
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

				wadrs1 = StringUtils.rightPad(StringUtils.defaultString(wadrs1, ""), 32);
				wadrs2 = StringUtils.rightPad(StringUtils.defaultString(wadrs2, "-"), 32);
				wadrs3 = StringUtils.rightPad(StringUtils.defaultString(wadrs3, ""), 32);

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

		}
		return contractorAddress.toString();
	}

	private ContractServiceDAO getContractServiceDAO() {
		if (contractServiceDAO == null) {
			contractServiceDAO = new ContractServiceDAOImpl();
		}
		return contractServiceDAO;
	}

	/**
	 * The following method is to determine the instrument type based on
	 * procurement, contract indicator if its a bpa then return F if its a purchase
	 * order then return P if its a delivery order then return F if its a dca then
	 * return C if none of the above then return blank
	 */
	private String deriveInstrumntType(String procurementMethod, String contractIndicator) {

		List<String> simplifiedAcquisition = Arrays.asList("3", "4", "E");
		List<String> nonDefinitiveContract = Arrays.asList("6", "T", "W", "X", "9");
		List<String> definitiveContract = Arrays.asList("1", "2", "5");

		logger.info("Procuremetn method {} , ContractIndicator {}", procurementMethod, contractIndicator);
		if ("B".equals(contractIndicator)) {
			return "F";
		} else {
			if (simplifiedAcquisition.contains(procurementMethod) && ("Z".equals(contractIndicator))) {
				return "P";
			} else {
				if (nonDefinitiveContract.contains(procurementMethod)
						|| ("E".equals(procurementMethod) && !"Z".equals(contractIndicator))
						|| ("F".equals(contractIndicator))) {
					return "F";
				} else {
					if (definitiveContract.contains(procurementMethod)) {
						return "C";
					}
				}
			}
		}
		return "";

	}

	/***
	 * Contract Notes
	 * 
	 * @param contractMaster
	 * @param cdfMasterList
	 * @return
	 */
	private String contractNotes(ContractDataMaster contractMaster, List<CDFMaster> cdfMasterList) {

		StringBuffer contractNotesDetails = new StringBuffer();

		String notesList = contractMaster.getD402_note_cd();
		if (StringUtils.isNotBlank(notesList)) {
			int notesLength = notesList.trim().length();
			CDFMaster cdfNotes = null;
			String note1 = "", note2 = "", note3 = "", note4 = "", note5 = "";

			if (notesLength > 1) {
				note1 = notesList.substring(0, 2);

				if (cdfMasterList != null) {
					for (CDFMaster cdfMaster : cdfMasterList) {
						if (note1.equals(cdfMaster.getD430_note_cd())) {
							cdfNotes = cdfMaster;
						}
					}
				}

				if (cdfNotes != null) {
					notesCount++;

					contractNotesDetails.append(cdfNotes.getD430_note1() + " " + cdfNotes.getD430_note2() + "\n");
				}

			}
			if (notesLength > 3) {
				note2 = notesList.substring(2, 4);
				cdfNotes = null;
				if (cdfMasterList != null) {
					for (CDFMaster cdfMaster : cdfMasterList) {
						if (note2.equals(cdfMaster.getD430_note_cd())) {
							cdfNotes = cdfMaster;
						}
					}
				}

				if (cdfNotes != null) {
					notesCount++;

					contractNotesDetails.append(cdfNotes.getD430_note1() + " " + cdfNotes.getD430_note2() + "\n");
				}
			}
			if (notesLength > 5) {
				note3 = notesList.substring(4, 6);

				cdfNotes = null;
				if (cdfMasterList != null) {
					for (CDFMaster cdfMaster : cdfMasterList) {
						if (note3.equals(cdfMaster.getD430_note_cd())) {
							cdfNotes = cdfMaster;
						}
					}
				}

				if (cdfNotes != null) {
					notesCount++;

					contractNotesDetails.append(cdfNotes.getD430_note1() + " " + cdfNotes.getD430_note2() + "\n");
				}
			}
			if (notesLength > 7) {
				note4 = notesList.substring(6, 8);

				cdfNotes = null;
				if (cdfMasterList != null) {
					for (CDFMaster cdfMaster : cdfMasterList) {
						if (note4.equals(cdfMaster.getD430_note_cd())) {
							cdfNotes = cdfMaster;
						}
					}
				}

				if (cdfNotes != null) {
					notesCount++;

					contractNotesDetails.append(cdfNotes.getD430_note1() + " " + cdfNotes.getD430_note2() + "\n");
				}
			}
			if (notesLength > 9) {
				note5 = notesList.substring(8, 10);

				cdfNotes = null;
				if (cdfMasterList != null) {
					for (CDFMaster cdfMaster : cdfMasterList) {
						if (note5.equals(cdfMaster.getD430_note_cd())) {
							cdfNotes = cdfMaster;
						}
					}
				}

				if (cdfNotes != null) {
					notesCount++;

					contractNotesDetails.append(cdfNotes.getD430_note1() + " " + cdfNotes.getD430_note2() + "\n");
				}
			}

		}

		if (StringUtils.isNotBlank(contractNotesDetails.toString())) {
			return contractNotesDetails.toString();

		}
		return "";
	}

	/***
	 * Reporting office address
	 * 
	 * @param contractReportingOffice
	 * @param cdfMasterList
	 * @return
	 */
//	private String contratReportingOfficeAddress(String contractReportingOffice, List<CDFMaster> cdfMasterList) {
//
//		CDFMaster reportingOfficeAddress = null;
//		String address = "";
//		if (cdfMasterList != null) {
//			for (CDFMaster cdfMaster : cdfMasterList) {
//				if (contractReportingOffice.equals(cdfMaster.getD430_rpt_off())
//						&& "P".equals(cdfMaster.getD430_office())) {
//					reportingOfficeAddress = cdfMaster;
//				}
//			}
//		}
//
//		if (reportingOfficeAddress != null) {
//			if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs1())
//					&& reportingOfficeAddress.getD430_adrs1().length() < 35) {
//				address = reportingOfficeAddress.getD430_adrs1() + " ";
//			}
//			if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs2())
//					&& reportingOfficeAddress.getD430_adrs2().length() < 35) {
//				address = address + reportingOfficeAddress.getD430_adrs2() + " ";
//			}
//			if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs3())
//					&& reportingOfficeAddress.getD430_adrs3().length() < 35) {
//				address = address + reportingOfficeAddress.getD430_adrs3() + " ";
//			}
//			if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs4())
//					&& reportingOfficeAddress.getD430_adrs4().length() < 35) {
//				address = address + reportingOfficeAddress.getD430_adrs4() + " ";
//			}
//		}
//		return address;
//	}
	
	private String contratReportingOfficeAddress(String contractReportingOffice) {

		String address = "";
		Gson gson =  new Gson();
		String contractConstantAPIKey = StringUtils.isNotBlank(System.getenv(ContractConstants.CONTRACT_CONSTANT_API_KEY))
				? System.getenv(ContractConstants.CONTRACT_CONSTANT_API_KEY)
				: "on890eyswh";
		CDFMaster cdfMaster = new CDFMaster();
		cdfMaster.setD430_rpt_off(contractReportingOffice);
		cdfMaster.setD430_office("P");
		cdfMaster.setD430_rec_type("F");
		
		String reportingOfficeAddressJSON = "";
		try {
			reportingOfficeAddressJSON = invokePostAPI(contractConstantAPIKey, ContractConstants.CONTRACT_CONSTANT_VENDOR_ADDRESS_API_URL, gson.toJson(cdfMaster));
		
			if (reportingOfficeAddressJSON != null) {
				CDFMaster reportingOfficeAddress = gson.fromJson(reportingOfficeAddressJSON, CDFMaster.class);
				if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs1())
						&& reportingOfficeAddress.getD430_adrs1().length() < 35) {
					address = address + StringUtils.rightPad(StringUtils.defaultString(reportingOfficeAddress.getD430_adrs1(), ""), 35);
				}
				if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs2())
						&& reportingOfficeAddress.getD430_adrs2().length() < 35) {
					address = address + StringUtils.rightPad(StringUtils.defaultString(reportingOfficeAddress.getD430_adrs2(), ""), 35);
				}
				if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs3())
						&& reportingOfficeAddress.getD430_adrs3().length() < 35) {
					address = address + StringUtils.rightPad(StringUtils.defaultString(reportingOfficeAddress.getD430_adrs3(), ""), 35);
				}
				if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs4())
						&& reportingOfficeAddress.getD430_adrs4().length() < 35) {
					address = address + StringUtils.rightPad(StringUtils.defaultString(reportingOfficeAddress.getD430_adrs4(), ""), 35);
				}
			}
		} catch (IOException | RecordNotFoundException | CCSExceptions e) {
			logger.error("contratReportingOfficeAddress Error occured :: " , e);
		}
		return address;
	}

	/***
	 * aco address for get contract data
	 * 
	 * @param aco
	 * @param cdfMasterList
	 * @return
	 */
	private String getACOOfficeAddress(String aco) {

		String address = "";
		Gson gson =  new Gson();
		String contractConstantAPIKey = StringUtils.isNotBlank(System.getenv(ContractConstants.CONTRACT_CONSTANT_API_KEY))
				? System.getenv(ContractConstants.CONTRACT_CONSTANT_API_KEY)
				: "on890eyswh";
		CDFMaster cdfMaster = new CDFMaster();
	
		cdfMaster.setD430_aco(aco);
		cdfMaster.setD430_rec_type("A");
		
		String reportingOfficeAddressJSON = "";
		try {
			reportingOfficeAddressJSON = invokePostAPI(contractConstantAPIKey, ContractConstants.CONTRACT_CONSTANT_VENDOR_ADDRESS_API_URL, gson.toJson(cdfMaster));
		

		if (reportingOfficeAddressJSON != null) {
			CDFMaster reportingOfficeAddress = gson.fromJson(reportingOfficeAddressJSON, CDFMaster.class);
			if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs1())
					&& reportingOfficeAddress.getD430_adrs1().length() < 35) {
				address = address + StringUtils.rightPad(StringUtils.defaultString(reportingOfficeAddress.getD430_adrs1(), ""), 35);
			}
			if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs2())
					&& reportingOfficeAddress.getD430_adrs2().length() < 35) {
				address = address + StringUtils.rightPad(StringUtils.defaultString(reportingOfficeAddress.getD430_adrs2(), ""), 35);
			}
			if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs3())
					&& reportingOfficeAddress.getD430_adrs3().length() < 35) {
				address = address + StringUtils.rightPad(StringUtils.defaultString(reportingOfficeAddress.getD430_adrs3(), ""), 35);
			}
			if (StringUtils.isNotBlank(reportingOfficeAddress.getD430_adrs4())
					&& reportingOfficeAddress.getD430_adrs4().length() < 35) {
				address = address + StringUtils.rightPad(StringUtils.defaultString(reportingOfficeAddress.getD430_adrs4(), ""), 35);
			}
		}
		} catch (IOException | RecordNotFoundException | CCSExceptions e) {
			logger.error("getACOOfficeAddress Error occured :: " , e);
		}
		return address;
	}

	/***
	 * getEDIFax
	 * 
	 * @param contractDetail
	 */
	private void setEDIFax(CSDetailPO contractDetail) {

		if (contractServiceDAO == null) {
			contractServiceDAO = new ContractServiceDAOImpl();
		}

		EDIFax ediFax = contractServiceDAO.getEDIFax(contractDetail.getInternalContractNumber());
		if (ediFax != null) {
			contractDetail.setEfptIndicator(ediFax.getD411_efpt_ind());
			contractDetail.setFaxNumber(ediFax.getD411_fax1());
		}

	}

	/***
	 * set reporting office
	 * 
	 * @param contractDetail
	 */
	private void setReportingOfficeAAC(CSDetailPO contractDetail) {

		ACCMapping accMapping = contractServiceDAO.getReportingOfficeAAC(contractDetail.getInternalContractNumber());
		if(accMapping!=null) {
			contractDetail.setReportingOfficeAAC(accMapping.getD4531_cont_off_aac());
		}
		

	}

	private void setBpaServiceChargeNote(CSDetailPO contractDetail, ContractDataMaster contractMaster,
			BigDecimal poCost) {
		double dvalMinOrder = new Double(contractMaster.getD402_dval_min_ord());
		double bpaServiceCharge = new Double(contractMaster.getD402_bpa_service_chg());
		if (dvalMinOrder > 0 && bpaServiceCharge > 0 && poCost != null) {
			if (poCost.doubleValue() < dvalMinOrder) {
				String jsNote = ContractConstants.CF_LIT_1 + String.format("%.2f", dvalMinOrder)
						+ ContractConstants.CF_LIT_2 + String.format("%.2f", bpaServiceCharge)
						+ ContractConstants.CF_LIT_3;
				StringBuffer contractNotesDetails = new StringBuffer(contractDetail.getContractNotesDetails());
				contractNotesDetails.append(jsNote);
				if (contractNotesDetails.toString().trim().length() > 0) {
					contractDetail.setContractNotesDetails(contractNotesDetails.toString());
					contractDetail.setContractNotesList(contractDetail.getContractNotesList() + "CF");
				}
			}
		}
	}

	/***
	 * Ranges From
	 * @param no
	 * @param volumeRange
	 * @return
	 */
	private double getRangeFrom(String no, VolumeRange volumeRange) {
		if (volumeRange == null) {
			return 0;
		}

		String rangeValue = "";
		if(no.equals(volumeRange.getD41d_value())) {
			rangeValue = volumeRange.getD41d_alt_value();
		}else if(no.equals(volumeRange.getD41d_value2())){
			rangeValue = volumeRange.getD41d_alt_value2();
		}else if(no.equals(volumeRange.getD41d_value3())) {
			rangeValue = volumeRange.getD41d_alt_value3();
		}else if(no.equals(volumeRange.getD41d_value4())) {
			rangeValue = volumeRange.getD41d_alt_value4();
		}else if(no.equals(volumeRange.getD41d_value5())) {
			rangeValue = volumeRange.getD41d_alt_value5();
		}else {
			return 0;
		}

		return new Double(rangeValue).doubleValue();
	}

	/***
	 * Ranges To
	 * @param no
	 * @param volumeRange
	 * @return
	 */
	private double getRangeto(String no, VolumeRange volumeRange) {

		if (volumeRange == null) {
			return 0;
		}

		String rangeValue = "";
		if(no.equals(volumeRange.getD41d_value())) {
			rangeValue = volumeRange.getD41d_desc();
		}else if(no.equals(volumeRange.getD41d_value2())){
			rangeValue = volumeRange.getD41d_desc();
		}else if(no.equals(volumeRange.getD41d_value3())) {
			rangeValue = volumeRange.getD41d_desc();
		}else if(no.equals(volumeRange.getD41d_value4())) {
			rangeValue = volumeRange.getD41d_desc();
		}else if(no.equals(volumeRange.getD41d_value5())) {
			rangeValue = volumeRange.getD41d_desc();
		}else {
			return 0;
		}

		return new Double(rangeValue).doubleValue();

	}

	private void getVolumeDiscount(CSDetailPO contractDetail, BigDecimal totalPOCost) {
		String rangeNo = "";
		double from = 0;
		double to = 0;
		double discount = 0;
		List<VolumeDiscount> volumeDiscounts = null;
		List<Range> volumeDis = new ArrayList<>();

		if (contractServiceDAO == null) {
			contractServiceDAO = new ContractServiceDAOImpl();
		}
		volumeDiscounts = contractServiceDAO.getVolumeDiscounts(contractDetail.getInternalContractNumber());
		VolumeRange volumeRanges = contractServiceDAO.getVolumeRange();
		int i = 0;
		if (volumeDiscounts != null) {
			for (VolumeDiscount volumeDiscount : volumeDiscounts) {
				Range range = new Range();
				rangeNo = volumeDiscount.getD4532_discount_cd();
				discount = new Double(volumeDiscount.getD4532_discount_percentage());
				from = getRangeFrom(rangeNo, volumeRanges);
				to = getRangeto(rangeNo, volumeRanges);
				range.setLineNumber(i++);
				range.setFromValue(new BigDecimal(from).setScale(2, BigDecimal.ROUND_HALF_UP));
				range.setToValue(new BigDecimal(to).setScale(2, BigDecimal.ROUND_HALF_UP));
				range.setDiscount(new BigDecimal(discount).setScale(2, BigDecimal.ROUND_HALF_UP));
				volumeDis.add(range);

				if (totalPOCost.compareTo(range.getFromValue()) != -1
						&& totalPOCost.compareTo(range.getToValue()) != 1) {
					contractDetail.setVolumeDiscountAmount(
							totalPOCost.doubleValue() * range.getDiscount().doubleValue() / 100);
					contractDetail.setVolumeDiscountPercentage(range.getDiscount().doubleValue());
				}
			}
		
		}

	}
	
	/****
	 * 
	 * @param apiKey
	 * @param pathParam
	 * @param serviceUrl
	 * @return
	 * @throws MalformedURLException
	 * @throws IOException
	 * @throws RecordNotFoundException
	 * @throws CCSExceptions
	 */
	private String invokeAPI(String apiKey, String pathParam, String serviceUrl)
			throws MalformedURLException, IOException, RecordNotFoundException, CCSExceptions {

		try {
			String vpc = StringUtils.isNotBlank(System.getenv(ContractConstants.AWS_VPC))
					? System.getenv(ContractConstants.AWS_VPC)
					: "vpce-088a5795f16dd4c2c-dnbntft7";
			String env = StringUtils.isNotBlank(System.getenv(ContractConstants.SHORT_ENV))
					? System.getenv(ContractConstants.SHORT_ENV)
					: "dev";
			String url = "https://" + vpc + "." + ContractConstants.DOMAIN_URL + "/" + env + serviceUrl + pathParam;

			HttpGet getReq = new HttpGet(url);

			Header header = new BasicHeader(HttpHeaders.CONTENT_TYPE, "application/json");
			Header header2 = new BasicHeader("x-apigw-api-id", apiKey);

			List<Header> headers = Arrays.asList(header, header2);
			HttpClient client = HttpClients.custom().setDefaultHeaders(headers).build();
			HttpResponse response = client.execute(getReq);

			if (response.getStatusLine().getStatusCode() == HttpStatus.SC_NOT_FOUND) {
				throw new RecordNotFoundException(
						"Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
			} else if (response.getStatusLine().getStatusCode() != 200) {
				throw new CCSExceptions("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
			}

			BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));

			StringBuffer outputBuff = new StringBuffer();
			String output;
			while ((output = br.readLine()) != null) {
				outputBuff.append(output);

			}

			client.getConnectionManager().shutdown();

			return outputBuff.toString();

		} catch (IOException e) {
			throw new CCSExceptions(e.getMessage());

		}
	}
	
	/****
	 * 
	 * @param apiKey
	 * @param pathParam
	 * @param serviceUrl
	 * @return
	 * @throws MalformedURLException
	 * @throws IOException
	 * @throws RecordNotFoundException
	 * @throws CCSExceptions
	 */
	private String invokePostAPI(String apiKey, String serviceUrl, String requestBody)
			throws MalformedURLException, IOException, RecordNotFoundException, CCSExceptions {

		try {
			
			String vpc = StringUtils.isNotBlank(System.getenv(ContractConstants.AWS_VPC))
					? System.getenv(ContractConstants.AWS_VPC)
					: "vpce-088a5795f16dd4c2c-dnbntft7";
			
			
			String env = StringUtils.isNotBlank(System.getenv(ContractConstants.SHORT_ENV))
					? System.getenv(ContractConstants.SHORT_ENV)
					: "dev";
			String url = "https://" + vpc + "." + ContractConstants.DOMAIN_URL + "/" + env + serviceUrl ;

			logger.info("VPC URL : {} || env : {} || url : {} || key : {}" , vpc, env, url, apiKey );
			HttpPost postReq = new HttpPost(url);
			StringEntity entity = new StringEntity(requestBody);
			postReq.setEntity(entity);

			Header header = new BasicHeader(HttpHeaders.CONTENT_TYPE, "application/json");
			Header header2 = new BasicHeader("x-apigw-api-id", apiKey);

			List<Header> headers = Arrays.asList(header, header2);
			HttpClient client = HttpClients.custom().setDefaultHeaders(headers).build();
			
			HttpResponse response = client.execute(postReq);

			if (response.getStatusLine().getStatusCode() == HttpStatus.SC_NOT_FOUND) {
				throw new RecordNotFoundException(
						"Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
			} else if (response.getStatusLine().getStatusCode() != 200) {
				throw new CCSExceptions("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
			}

			BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));

			StringBuffer outputBuff = new StringBuffer();
			String output;
			while ((output = br.readLine()) != null) {
				outputBuff.append(output);

			}

			client.getConnectionManager().shutdown();
			
			logger.info("invokePOSTAPI response : " + outputBuff.toString());
			
			return outputBuff.toString();

		} catch (IOException e) {
			
			logger.error( " invokePostAPI exception occured" , e);
			throw new CCSExceptions(e.getMessage());

		}
	}

	public static void main(String[] args) {
		ContractServiceImpl i = new ContractServiceImpl();
		String notes ="";
		try {
			
		
			ContractDataMaster c= new ContractDataMaster();
			c.setD402_rpt_off("P");
			c.setD402_note_cd("01020304");
//			String address = i.contratReportingOfficeAddress("P");
//			System.out.println(address);
			
			notes = i.getContractReportingOfficeNotes(c);
			System.out.println(notes);
//			String contractConstantAPIKey = StringUtils.isNotBlank(System.getenv(ContractConstants.CONTRACT_CONSTANT_API_KEY))
//					? System.getenv(ContractConstants.CONTRACT_CONSTANT_API_KEY)
//							: "on890eyswh";
//			CDFMaster cdfMaster = new CDFMaster();
//			cdfMaster.setD430_rpt_off("I");
//			cdfMaster.setD430_rec_type("N");
//			notes = i.invokePostAPI(contractConstantAPIKey, ContractConstants.CONTRACT_CONSTANT_NOTES_API_URL,gson.toJson(cdfMaster) );
//			
//			List<JsonObject> cdfNotesDetails = gson.fromJson(notes, List.class);
//			for (JsonObject jsonObject : cdfNotesDetails) {
//				System.out.println(jsonObject);
//			}
////			ObjectMapper mapper = new ObjectMapper();
////			notes = 
////			List<CDFMaster> cdfNotesDetails = mapper.readValue(notes, new TypeReference<List<CDFMaster>>() {
////			});
////
////			for (CDFMaster cdfMaster2 : cdfNotesDetails) {
////				
////				System.out.println(cdfMaster2);
////			}
//			System.out.println(cdfNotesDetails);
		} catch ( Exception e) {
			
		}
	}
		
		
	

}
