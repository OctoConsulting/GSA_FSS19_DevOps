package gov.gsa.fas.contractservice.util;

public class ContractConstants {
	
	public static final String SHORT_ENV = "SHORT_ENV";
	public static final String DB_CONNECTION_END_POINT = "http://localhost:8000";
	public static final String REGION = "us-east1";
	public static final String CONTRACT_SERVICE_TABLE_NAME = "contract_data";
	public static final String CONTRACT_SERVICE_TABLE_NAME_PREFIX = "contract-";
	public static final String CONTRACT_SERVICE_GSI = "contract_details_identity";
	public static final String CONTRACT_SERVICE_GSI_IDX = "contract_details_identity_index";
	public static final String CONTRACT_SERVICE_PK = "internal_contract_number";
	public static final String CONTRACT_SERVICE_SK_D402 = "detail_d402";
	public static final String CONTRACT_SERVICE_SK_D403 = "detail_d403";
	public static final String CONTRACT_SERVICE_SK_D407 = "detail_d407";
	public static final String CONTRACT_SERVICE_SK_D410 = "detail_d410";
	public static final String CONTRACT_SERVICE_SK_D430 = "detail_d430";
	
	public static final String TEST_BODY = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\"><soapenv:Header/><soapenv:Body><con:PORequest><NumOfRecord>1</NumOfRecord><PurchaseOrders POLineNumber=\"01\"><PurchaseOrderNum>NMNJH753C8</PurchaseOrderNum>"
			+ " <totalPOCost>12.75</totalPOCost>" + "  <ContractNum>47QSEA20T000E</ContractNum>"
			+ "   <BuyerCode></BuyerCode>"

			+ "   <RequisitionRecords requisitionLineNumber=\"1\">"
			+ "    <requisitionNumber>POPlIT4200022</requisitionNumber>"
			+ "     <itemNumber>7510015904409</itemNumber>" + "   <reportingOffice>N</reportingOffice>"
			+ "    <pricingZone>01</pricingZone>" + "   </RequisitionRecords>" + "  </PurchaseOrders>"
			+ "  </con:PORequest>" + "  </soapenv:Body>" + " </soapenv:Envelope>";
	
	public static final String TEST_MULTIPLE_PO_BODY = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\">\n" + 
			"   <soapenv:Header/>\n" + 
			"   <soapenv:Body>\n" + 
			"      <con:PORequest>\n" + 
			"         <NumOfRecord>2</NumOfRecord>\n" + 
			"         <!--1 or more repetitions:-->\n" + 
			"         <PurchaseOrders POLineNumber=\"1\">\n" + 
			"            <PurchaseOrderNum>FMNJBE45R8</PurchaseOrderNum>\n" + 
			"            <totalPOCost>500.00</totalPOCost>\n" + 
			"            <ContractNum>GS07FDA026</ContractNum>\n" + 
			"            <!--1 or more repetitions:-->\n" + 
			"            <RequisitionRecords requisitionLineNumber=\"1\">\n" + 
			"               <requisitionNumber>POPLIT4200001</requisitionNumber>\n" + 
			"               <itemNumber>7530015567917</itemNumber>\n" + 
			"               <reportingOffice>F</reportingOffice>\n" + 
			"               <pricingZone>99</pricingZone>\n" + 
			"            </RequisitionRecords>\n" + 
			"         </PurchaseOrders>\n" + 
			"          <PurchaseOrders POLineNumber=\"1\">\n" + 
			"            <PurchaseOrderNum>FMNJBE45S8</PurchaseOrderNum>\n" + 
			"            <totalPOCost>500.00</totalPOCost>\n" + 
			"            <ContractNum>GS02FCA013</ContractNum>\n" + 
			"            <!--1 or more repetitions:-->\n" + 
			"            <RequisitionRecords requisitionLineNumber=\"1\">\n" + 
			"               <requisitionNumber>POPLIT4200001</requisitionNumber>\n" + 
			"               <itemNumber>7530015567917</itemNumber>\n" + 
			"               <reportingOffice>F</reportingOffice>\n" + 
			"               <pricingZone>99</pricingZone>\n" + 
			"            </RequisitionRecords>\n" + 
			"         </PurchaseOrders>\n" + 
			"      </con:PORequest>\n" + 
			"   </soapenv:Body>\n" + 
			"</soapenv:Envelope>";
	
	
	public static final String SUCCESS = "SUCCESS";
	
	// Error Codes Get contract Data
	public static final String MISSING_TOTAL = "FAIL JS999: Missing Total PO Cost";
	public static final String MISSING_CONTRACT_NUMBER="FAIL JS999  Missing contract Number /Contract number is too short ";
	public static final String MISSING_PURCHASE_NUMBER="FAIL JS999: Missing Purchase Order Number";
	public static final String INVALID_DATA ="J090_Invalid Data Request";
	public static final String JS001_BEGIN_DATE = "JS001: Contract has not begun yet. Contract %1$s begin date is %2$s";
	public static final String JS002_END_DATE = "JS002: Contract has ended. Contract %1$s end date was %2$s";
	public static final String JS003_TERMINATION_DATE = "JS003: JS003: Contract has been terminated. Contract %1$s was terminated on %2$s";
	public static final String MISSING_REQUISITION_NUMBER = "FAIL JS999: Missing Requisition Number";
	public static final String MISSING_REPORTING_OFFICE = "FAIL JS999: Missing or bad Reporting Office value; The value submitted was: \"\"";
	public static final String JS004_CONTRACT_DATA = "FAIL JS004: Buyer Code not defined for the Reporting Office : The Buyer code %1$s not defined in Reporting Office %2$s";
	public static final String JS005_CONTRACT_DATA = "FAIL JS005: Buyer Dollar Limit exceeded:The Buyer/Spervisor %1$s has only $ %2$s and the PO Total Cost was %3$s";
	public static final String JS000_CONTRACT_DATA = "FAIL " + "JS000: Contract not found Contract %1$s is not a valid contract number";
	
	
	public static final String JS007_INVALID_DATA_CONTRACT_NUMBER = "JS007_Invalid Contract Number -";
	
	public static final String JS007_INVALID_ENTITY_ID = "JS007_Invalid Data Request- Invalid Entity ID";
	public static final String JS007_NO_CONTRACTS_ENTITY_ID = "Data Unavailable � Resend the request";
	public static final String J090_INVALID_DATA = "Invalid Data Request";
	
	public static final String J020_CS_EXCEPTION = "J020_CSException";
	
	public static final String FAULT_CODE = "Server";
	
	// Error Codes ContractDetails
	
	//DATE FORMATS
	public static final String YYYYMMDD_FORMAT = "yyyyMMdd";
	public static final String JULIANDATE_FORMAT = "yyyyDDD";
	public static final String MMDDYYYY = "MMddyyyy";
}
