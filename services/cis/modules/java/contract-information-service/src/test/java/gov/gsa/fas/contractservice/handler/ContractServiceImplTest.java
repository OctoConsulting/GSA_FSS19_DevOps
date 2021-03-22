package gov.gsa.fas.contractservice.handler;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;

import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.PORecordsType;
import gov.gsa.fas.contractservice.contract.PORequestType;
import gov.gsa.fas.contractservice.dao.ContractServiceDAOImpl;
import gov.gsa.fas.contractservice.exception.ApplicationException;
import gov.gsa.fas.contractservice.model.CDFMaster;
import gov.gsa.fas.contractservice.model.ContractDataMaster;
import gov.gsa.fas.contractservice.service.ContractServiceImpl;
import gov.gsa.fas.contractservice.util.ContractConstants;
import gov.gsa.fas.contractservice.util.ContractServiceUtil;


//@RunWith(MockitoJUnitRunner.class)
public class ContractServiceImplTest {

	
	/*
	@InjectMocks
	ContractServiceImpl contractService = new ContractServiceImpl();
	
	ContractServiceDAOImpl contractDAO;
	
	@Before
	public void setUp() throws Exception {
		MockitoAnnotations.initMocks(this);
		//contractService = new ContractServiceImpl();	
		contractDAO = Mockito.mock(ContractServiceDAOImpl.class);
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testGetContractDataSinglePO() throws ApplicationException {

		final String TEST_BODY = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\"><soapenv:Header/><soapenv:Body><con:PORequest><NumOfRecord>1</NumOfRecord><PurchaseOrders POLineNumber=\"01\"><PurchaseOrderNum>NMNJH753C8</PurchaseOrderNum>"
				+ " <totalPOCost>12.75</totalPOCost>" + "  <ContractNum>47QSEA20T000E</ContractNum>"
				+ "   <BuyerCode></BuyerCode>"

				+ "   <RequisitionRecords requisitionLineNumber=\"1\">"
				+ "    <requisitionNumber>POPlIT4200022</requisitionNumber>"
				+ "     <itemNumber>7510015904409</itemNumber>" + "   <reportingOffice>M</reportingOffice>"
				+ "    <pricingZone>01</pricingZone>" + "   </RequisitionRecords>" + "  </PurchaseOrders>"
				+ "  </con:PORequest>" + "  </soapenv:Body>" + " </soapenv:Envelope>";

		PORequestType reqns = ContractServiceUtil.unmarshall(TEST_BODY, PORequestType.class);
		List<PORecordsType> inPORecords = reqns.getPurchaseOrders();
		//inPORecords.add(Mockito.mock(PORecordsType.class));
		
		ContractDataMaster contractDataMaster = Mockito.mock(ContractDataMaster.class);
		
		//Mockito.when(Mockito.mock(PORecordsType.class).getContractNum()).thenReturn("Z");
		Mockito.when(contractDAO.getContractByGSAM("47QSEA20T000E")).thenReturn(contractDataMaster);
		Mockito.when(contractDataMaster.getD402_cont_no()).thenReturn("NFKA271");
		Mockito.when(contractDAO.getBuyerDetails(Mockito.anyString())).thenReturn(new ArrayList<CDFMaster>());
		CDFMaster cdfMasterFiltered = Mockito.mock(CDFMaster.class);

		Mockito.when(contractDataMaster.getD402_cont_beg_dt()).thenReturn("2020226");
		Mockito.when(contractDataMaster.getD402_cont_end_dt()).thenReturn("2021224");
		Mockito.when(contractDataMaster.getD402_dt_terminated()).thenReturn("");
		Mockito.when(cdfMasterFiltered.getD430_bm_dval_lmt()).thenReturn("20");
		
		//Mockito.when(inPORecords.get(Mockito.anyInt())).thenReturn(Mockito.mock(PORecordsType.class));

		List<CSDetailPO> csDetails = contractService.getContractData(inPORecords);

		assertEquals(ContractConstants.SUCCESS, csDetails.get(0).getResult());
	}
	
	
	/*@Test
	public void testGetContractDataMultiPO() throws ApplicationException {	
		
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
	public void testGetContractDataSinglePOMissingContractNumber() throws ApplicationException {	
		
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
	public void testGetContractDataMultiPONegitive() throws ApplicationException {	
		
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
		assertTrue(responseStream.getBody().contains(ContractConstants.JS007_INVALID_DATA_CONTRACT_NUMBER));
	}
	
	@Test
	public void testGetContractDetailsResponseSuspense() {	
		RequestWrapper inputStream = new RequestWrapper();
		PathParameters pathParams = new PathParameters();
		pathParams.setContractid("123456789");
		inputStream.setPathParameters(pathParams);
		RequestWrapper responseStream = contractService.getContractDetailsResponse(inputStream);
		assertTrue(!responseStream.getBody().contains(ContractConstants.JS007_INVALID_DATA_CONTRACT_NUMBER));
	}
	
	@Test
	public void testListContractsResponseNull() {	
		RequestWrapper inputStream = new RequestWrapper();
		RequestWrapper responseStream = contractService.getListContractResponse(inputStream);
		assertTrue(responseStream.getBody().contains(ContractConstants.JS007_INVALID_ENTITY_ID));
	}
	
	@Test
	public void testListContractsResponseValid() {	
		RequestWrapper inputStream = new RequestWrapper();
		PathParameters pathParams = new PathParameters();
		pathParams.setEntityid("123456789");
		inputStream.setPathParameters(pathParams);
		RequestWrapper responseStream = contractService.getListContractResponse(inputStream);
		assertTrue(!responseStream.getBody().contains(ContractConstants.JS007_INVALID_ENTITY_ID));
	}
	
	*/

}
