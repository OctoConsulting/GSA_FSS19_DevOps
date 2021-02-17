package contractinformationservice.util;

public class ContractConstants {
	
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
	
	public static final String MISSING_TOTAL = "FAIL JS999: Missing Total PO Cost.";
	public static final String MISSING_CONTRACT_NUMBER="FAIL JS999: Missing contract Number/Contract number is too short/too long." +
			" Contract Number submitted was Empty";
	public static final String MISSING_PURCHASE_NUMBER="FAIL JS999: Missing Purchase Order Number";
	public static final String SUCCESS = "SUCCESS";
	public static final String INVALID_DATA ="J090_Invalid Data Request";

}
