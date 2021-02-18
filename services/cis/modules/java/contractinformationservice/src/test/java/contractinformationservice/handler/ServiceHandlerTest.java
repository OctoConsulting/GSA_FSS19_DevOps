package contractinformationservice.handler;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import javax.xml.soap.MessageFactory;
import javax.xml.soap.MimeHeaders;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPMessage;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import contractinformationservice.model.RequestWrapper;
import contractinformationservice.util.ContractServiceUtil;
import contractinfromationservice.exception.SoapFaultException;

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
	public void testGetContractDataSinglePO() throws SOAPException, IOException {	
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
		
		/*MessageFactory mf = MessageFactory.newInstance();
        // headers for a SOAP message
        MimeHeaders header = new MimeHeaders();     
        header.addHeader("Content-Type", "text/xml");
        InputStream is = new ByteArrayInputStream(outputStream.getBody().getBytes());

        // create the SOAPMessage
        SOAPMessage soapMessage = mf.createMessage(header,is);
        // get the body
        SOAPBody soapBody = soapMessage.getSOAPBody();
        // find your node based on tag name
        NodeList nodes = soapBody.getChildNodes();

       
        Node node = nodes.item(1);
		System.out.println(node.getNodeValue());
		*/
		assertNotNull(outputStream.getBody());
	}

}
