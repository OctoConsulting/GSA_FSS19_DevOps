package gov.gsa.fas.contractservice.handler;

import java.util.List;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.gsa.fas.contractservice.model.RequestWrapper;
import gov.gsa.fas.contractservice.service.ContractService;
import gov.gsa.fas.contractservice.service.ContractServiceImpl;
import gov.gsa.fas.contractservice.util.ContractConstants;
import gov.gsa.fas.contractservice.util.ContractServiceUtil;
import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.GetContractDataResponse;
import gov.gsa.fas.contractservice.contract.PORecordsType;
import gov.gsa.fas.contractservice.contract.PORequestType;

public class ServiceHandler implements RequestHandler<RequestWrapper, RequestWrapper> {
	
	Logger logger = LoggerFactory.getLogger(ServiceHandler.class);
	
	public RequestWrapper handleRequest(RequestWrapper inputStream, Context context) {

		logger.info("printing inputStream.getBody() : " + inputStream.getBody());
		
		if(inputStream.getBody()==null) {
			logger.info("printing inputStream.getBody() is NULL ");
		}
		
		//LambdaLogger logger = context.getLogger();
		PORequestType reqns = ContractServiceUtil.unmarshall(inputStream.getBody(),
				PORequestType.class);
		
		if(reqns==null) {
			logger.info("issues with unmarshalling the RequestBody to Object  ");
		}

		List<PORecordsType> inPORecords = reqns.getPurchaseOrders();
		GetContractDataResponse finalPORes = new GetContractDataResponse();
		int i = 0, j = 0;
		try {
			if (reqns.getNumOfRecord() != reqns.getPurchaseOrders().size()) {

				inputStream.setBody(ContractServiceUtil.marshallException("soap:Server", ContractConstants.INVALID_DATA));
				return inputStream;

			}

			while (i < reqns.getPurchaseOrders().size()) {
				if (reqns.getPurchaseOrders().get(i).getPOLineNumber() != i + 1) {
					// throw new CCSExceptions(ContractConstants.INVALID_DATA);
					
					inputStream.setBody(ContractServiceUtil.marshallException("soap:Server", ContractConstants.INVALID_DATA));
					return inputStream;
				}
				j = 0;
				while (j < reqns.getPurchaseOrders().get(i).getRequisitionRecords().size()) {
					if (reqns.getPurchaseOrders().get(i).getRequisitionRecords().get(j).getRequisitionLineNumber() != j
							+ 1) {
						inputStream.setBody(ContractServiceUtil.marshallException("soap:Server", ContractConstants.INVALID_DATA));
						return inputStream;
					}
					j++;
				}
				i++;
			}

			ContractService ContractService = new ContractServiceImpl();

			List<CSDetailPO> csDetails = ContractService.getContractData(inPORecords);
			finalPORes.setCSDetails(csDetails);
			inputStream.setBody(ContractServiceUtil.marshall(finalPORes));
		} catch (Exception e) {
			logger.error("Exception in ServiceHandler.handleRequest ", e);
			e.printStackTrace();
		}
		return inputStream;

	}

	public static void main(String[] args) {
		ServiceHandler s = new ServiceHandler();

		RequestWrapper wrapper =new RequestWrapper();
		wrapper.setBody("<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\"><soapenv:Header/><soapenv:Body><con:PORequest><NumOfRecord>1</NumOfRecord><PurchaseOrders POLineNumber=\"01\"><PurchaseOrderNum>NMNJH753C8</PurchaseOrderNum><totalPOCost>12.75</totalPOCost> <ContractNum>47QSEA20T000E</ContractNum><BuyerCode></BuyerCode><RequisitionRecords requisitionLineNumber=\"1\"><requisitionNumber>POPlIT4200022</requisitionNumber><itemNumber>7510015904409</itemNumber>   <reportingOffice>N</reportingOffice><pricingZone>01</pricingZone>   </RequisitionRecords></PurchaseOrders></con:PORequest>  </soapenv:Body> </soapenv:Envelope>");
				
				//ContractConstants.TEST_MULTIPLE_PO_BODY);
		RequestWrapper outputStream = s.handleRequest(wrapper, null);
		System.out.println(outputStream.getBody());
	}

}