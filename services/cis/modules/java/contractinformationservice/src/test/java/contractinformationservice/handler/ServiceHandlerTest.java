package contractinformationservice.handler;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.util.List;

import javax.xml.soap.SOAPException;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import contractinformationservice.model.RequestWrapper;
import contractinformationservice.util.ContractConstants;
import contractinformationservice.util.ContractServiceUtil;
import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.GetContractDataResponse;

public class ServiceHandlerTest {
	
	ServiceHandler serviceHandler;
	
	@Before
	public void setUp() throws Exception {
		serviceHandler = new ServiceHandler();

			
	}

	@After
	public void tearDown() throws Exception {
	}
	
	@Test
	public void testGetContractDataSinglePOSuccess() throws SOAPException, IOException {	
		final String TEST_BODY = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\"><soapenv:Header/><soapenv:Body>"
				+ "<con:PORequest><NumOfRecord>1</NumOfRecord><PurchaseOrders POLineNumber=\"01\"><PurchaseOrderNum>NMNJH753C8</PurchaseOrderNum>"
				+ " <totalPOCost>12.75</totalPOCost>" + "  <ContractNum>47QSEA20T000E</ContractNum>"
				+ "   <BuyerCode></BuyerCode>"

				+ "   <RequisitionRecords requisitionLineNumber=\"1\">"
				+ "    <requisitionNumber>POPlIT4200022</requisitionNumber>"
				+ "     <itemNumber>7510015904409</itemNumber>" + "   <reportingOffice>N</reportingOffice>"
				+ "    <pricingZone>01</pricingZone>" + "   </RequisitionRecords>" + "  </PurchaseOrders>"
				+ "  </con:PORequest>" + "  </soapenv:Body>" + " </soapenv:Envelope>";
		RequestWrapper wrapper =new RequestWrapper();
		wrapper.setBody(TEST_BODY);
		RequestWrapper outputStream = serviceHandler.handleRequest(wrapper, null);	
		
		GetContractDataResponse resultPORes = ContractServiceUtil.unmarshall(outputStream.getBody(),
				GetContractDataResponse.class); 
		assertNotNull(outputStream.getBody());
		List<CSDetailPO>csDetails = resultPORes.getCSDetails();
		csDetails.forEach(x->{
			assertEquals(ContractConstants.SUCCESS, x.getResult());
		});
		
	}
	
	@Test
	public void testGetContractDataMultiplePOSuccess() throws SOAPException, IOException {	
	 
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
		RequestWrapper wrapper =new RequestWrapper();
		wrapper.setBody(TEST_MULTIPLE_PO_BODY);
		RequestWrapper outputStream = serviceHandler.handleRequest(wrapper, null);	
		
		GetContractDataResponse resultPORes = ContractServiceUtil.unmarshall(outputStream.getBody(),
				GetContractDataResponse.class); 
		assertNotNull(outputStream.getBody());
		List<CSDetailPO>csDetails = resultPORes.getCSDetails();
		csDetails.forEach(x->{
			assertEquals(ContractConstants.SUCCESS, x.getResult());
		});
		
	}
	
	@Test
	public void testGetContractDataSinglePONumberOfRecordsNeg() throws SOAPException, IOException {	
		final String TEST_BODY = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\"><soapenv:Header/><soapenv:Body>"
				+ "<con:PORequest><NumOfRecord>2</NumOfRecord><PurchaseOrders POLineNumber=\"01\"><PurchaseOrderNum>NMNJH753C8</PurchaseOrderNum>"
				+ " <totalPOCost>12.75</totalPOCost>" + "  <ContractNum>47QSEA20T000E</ContractNum>"
				+ "   <BuyerCode></BuyerCode>"

				+ "   <RequisitionRecords requisitionLineNumber=\"1\">"
				+ "    <requisitionNumber>POPlIT4200022</requisitionNumber>"
				+ "     <itemNumber>7510015904409</itemNumber>" + "   <reportingOffice>N</reportingOffice>"
				+ "    <pricingZone>01</pricingZone>" + "   </RequisitionRecords>" + "  </PurchaseOrders>"
				+ "  </con:PORequest>" + "  </soapenv:Body>" + " </soapenv:Envelope>";
		final String outPut = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Header/><soap:Body><soap:Fault><faultcode>soap:soap:Server</faultcode><faultstring>J090_Invalid Data Request</faultstring></soap:Fault></soap:Body></soap:Envelope>"; 
		RequestWrapper wrapper =new RequestWrapper();
		wrapper.setBody(TEST_BODY);
		RequestWrapper outputStream = serviceHandler.handleRequest(wrapper, null);	
		
		assertEquals(outPut, outputStream.getBody());
	}
	
	@Test
	public void testGetContractDataSinglePOLineNumberNeg() throws SOAPException, IOException {	
		final String TEST_BODY = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\"><soapenv:Header/><soapenv:Body>"
				+ "<con:PORequest><NumOfRecord>1</NumOfRecord><PurchaseOrders POLineNumber=\"01\"><PurchaseOrderNum>NMNJH753C8</PurchaseOrderNum>"
				+ " <totalPOCost>12.75</totalPOCost>" + "  <ContractNum>47QSEA20T000E</ContractNum>"
				+ "   <BuyerCode></BuyerCode>"

				+ "   <RequisitionRecords requisitionLineNumber=\"2\">"
				+ "    <requisitionNumber>POPlIT4200022</requisitionNumber>"
				+ "     <itemNumber>7510015904409</itemNumber>" + "   <reportingOffice>N</reportingOffice>"
				+ "    <pricingZone>01</pricingZone>" + "   </RequisitionRecords>" + "  </PurchaseOrders>"
				+ "  </con:PORequest>" + "  </soapenv:Body>" + " </soapenv:Envelope>";
		final String outPut = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Header/><soap:Body><soap:Fault><faultcode>soap:soap:Server</faultcode><faultstring>J090_Invalid Data Request</faultstring></soap:Fault></soap:Body></soap:Envelope>"; 
		RequestWrapper wrapper =new RequestWrapper();
		wrapper.setBody(TEST_BODY);
		RequestWrapper outputStream = serviceHandler.handleRequest(wrapper, null);	
		
		assertEquals(outPut, outputStream.getBody());
	}

}
