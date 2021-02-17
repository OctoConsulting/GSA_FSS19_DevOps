package contractinformationservice.handler;

import static org.junit.Assert.assertEquals;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import contractinformationservice.model.RequestWrapper;
import contractinformationservice.util.ContractConstants;
import contractinformationservice.util.ContractServiceUtil;
import contractinfromationservice.exception.SoapFaultException;
import gov.gsa.fas.contractservice.contract.PORequestType;

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
	public void testGetContractDataSinglePO() {	
		final String TEST_BODY = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\"><soapenv:Header/><soapenv:Body>"
				+ "<con:PORequest><NumOfRecord>2</NumOfRecord><PurchaseOrders POLineNumber=\"01\"><PurchaseOrderNum>NMNJH753C8</PurchaseOrderNum>"
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
		SoapFaultException fault = ContractServiceUtil.unmarshall(outputStream.getBody(),
				SoapFaultException.class);
		assertEquals(ContractConstants.INVALID_DATA, fault.getFaultString());
	}

}
