package contractinformationservice.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import contractinformationservice.model.PathParameters;
import contractinformationservice.model.RequestWrapper;
import contractinformationservice.util.ContractConstants;
import contractinformationservice.util.ContractServiceUtil;
import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.PORecordsType;
import gov.gsa.fas.contractservice.contract.PORequestType;

public class ContractServiceImplTest {
	
	ContractService contractService;
	
	@Before
	public void setUp() throws Exception {
		contractService = new ContractServiceImpl();		
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testGetContractDataSinglePO() {	
		
		final String TEST_BODY = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\"><soapenv:Header/><soapenv:Body><con:PORequest><NumOfRecord>1</NumOfRecord><PurchaseOrders POLineNumber=\"01\"><PurchaseOrderNum>NMNJH753C8</PurchaseOrderNum>"
				+ " <totalPOCost>12.75</totalPOCost>" + "  <ContractNum>47QSEA20T000E</ContractNum>"
				+ "   <BuyerCode></BuyerCode>"

				+ "   <RequisitionRecords requisitionLineNumber=\"1\">"
				+ "    <requisitionNumber>POPlIT4200022</requisitionNumber>"
				+ "     <itemNumber>7510015904409</itemNumber>" + "   <reportingOffice>N</reportingOffice>"
				+ "    <pricingZone>01</pricingZone>" + "   </RequisitionRecords>" + "  </PurchaseOrders>"
				+ "  </con:PORequest>" + "  </soapenv:Body>" + " </soapenv:Envelope>";
		
		PORequestType reqns = ContractServiceUtil.unmarshall(TEST_BODY,
				PORequestType.class);
		List<PORecordsType> inPORecords = reqns.getPurchaseOrders();
		List<CSDetailPO> csDetails = contractService.getContractData(inPORecords);
		assertEquals(ContractConstants.SUCCESS, csDetails.get(0).getResult());
	}
	
	
	@Test
	public void testGetContractDataMultiPO() {	
		
		final String TEST_MULTIPLE_PO_BODY = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\">\n" + 
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
				"          <PurchaseOrders POLineNumber=\"2\">\n" + 
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
		
		PORequestType reqns = ContractServiceUtil.unmarshall(TEST_MULTIPLE_PO_BODY,
				PORequestType.class);
		List<PORecordsType> inPORecords = reqns.getPurchaseOrders();
		List<CSDetailPO> csDetails = contractService.getContractData(inPORecords);
		
		csDetails.forEach(x->{
			assertEquals(ContractConstants.SUCCESS, x.getResult());
		});
		
	}
	@Test
	public void testGetContractDataSinglePOMissingContractNumber() {	
		
		final String TEST_BODY = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\"><soapenv:Header/><soapenv:Body><con:PORequest><NumOfRecord>1</NumOfRecord><PurchaseOrders POLineNumber=\"01\"><PurchaseOrderNum>NMNJH753C8</PurchaseOrderNum>"
				+ " <totalPOCost>12.75</totalPOCost>" + "  <ContractNum></ContractNum>"
				+ "   <BuyerCode></BuyerCode>"

				+ "   <RequisitionRecords requisitionLineNumber=\"1\">"
				+ "    <requisitionNumber>POPlIT4200022</requisitionNumber>"
				+ "     <itemNumber>7510015904409</itemNumber>" + "   <reportingOffice>N</reportingOffice>"
				+ "    <pricingZone>01</pricingZone>" + "   </RequisitionRecords>" + "  </PurchaseOrders>"
				+ "  </con:PORequest>" + "  </soapenv:Body>" + " </soapenv:Envelope>";
		
		PORequestType reqns = ContractServiceUtil.unmarshall(TEST_BODY,
				PORequestType.class);
		List<PORecordsType> inPORecords = reqns.getPurchaseOrders();
		List<CSDetailPO> csDetails = contractService.getContractData(inPORecords);
		assertEquals(ContractConstants.MISSING_CONTRACT_NUMBER, csDetails.get(0).getResult());
	}
	
	@Test
	public void testGetContractDataMultiPONegitive() {	
		
		final String TEST_MULTIPLE_PO_BODY = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\">\n" + 
				"   <soapenv:Header/>\n" + 
				"   <soapenv:Body>\n" + 
				"      <con:PORequest>\n" + 
				"         <NumOfRecord>2</NumOfRecord>\n" + 
				"         <!--1 or more repetitions:-->\n" + 
				"         <PurchaseOrders POLineNumber=\"1\">\n" + 
				"            <PurchaseOrderNum>FMNJBE45R8</PurchaseOrderNum>\n" + 
				"            <totalPOCost></totalPOCost>\n" + 
				"            <ContractNum>GS07FDA026</ContractNum>\n" + 
				"            <!--1 or more repetitions:-->\n" + 
				"            <RequisitionRecords requisitionLineNumber=\"1\">\n" + 
				"               <requisitionNumber>POPLIT4200001</requisitionNumber>\n" + 
				"               <itemNumber>7530015567917</itemNumber>\n" + 
				"               <reportingOffice>F</reportingOffice>\n" + 
				"               <pricingZone>99</pricingZone>\n" + 
				"            </RequisitionRecords>\n" + 
				"         </PurchaseOrders>\n" + 
				"          <PurchaseOrders POLineNumber=\"2\">\n" + 
				"            <PurchaseOrderNum></PurchaseOrderNum>\n" + 
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
		
		PORequestType reqns = ContractServiceUtil.unmarshall(TEST_MULTIPLE_PO_BODY,
				PORequestType.class);
		List<PORecordsType> inPORecords = reqns.getPurchaseOrders();
		List<CSDetailPO> csDetails = contractService.getContractData(inPORecords);
		
		assertEquals(ContractConstants.MISSING_TOTAL, csDetails.get(0).getResult());
		assertEquals(ContractConstants.MISSING_PURCHASE_NUMBER, csDetails.get(1).getResult());
		
	}
	
	@Test
	public void testGetContractDetailsResponse() {	
		RequestWrapper inputStream = new RequestWrapper();
		RequestWrapper responseStream = contractService.getContractDetailsResponse(inputStream);
		assertTrue(responseStream.getBody().contains(ContractConstants.INVALID_DATA_CONTRACT_NUMBER_JS007));
	}
	
	@Test
	public void testGetContractDetailsResponseSuspense() {	
		RequestWrapper inputStream = new RequestWrapper();
		PathParameters pathParams = new PathParameters();
		pathParams.setContractid("123456789");
		inputStream.setPathParameters(pathParams);
		RequestWrapper responseStream = contractService.getContractDetailsResponse(inputStream);
		assertTrue(!responseStream.getBody().contains(ContractConstants.INVALID_DATA_CONTRACT_NUMBER_JS007));
	}

}
