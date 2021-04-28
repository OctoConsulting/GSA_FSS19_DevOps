package gov.gsa.fas.contractservice.handler;

import java.util.List;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import org.apache.commons.lang3.StringUtils;
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
import gov.gsa.fas.contractservice.exception.ApplicationException;

public class ServiceHandler implements RequestHandler<RequestWrapper, RequestWrapper> {
	
	Logger logger = LoggerFactory.getLogger(ServiceHandler.class);
	
	public RequestWrapper handleRequest(RequestWrapper inputStream, Context context) {

		logger.info("printing inputStream.getBody() {} " , inputStream.getBody());
		
		if(StringUtils.isEmpty(inputStream.getBody())){
			logger.info("printing inputStream.getBody() is NULL ");
		}
		
		PORequestType reqns = ContractServiceUtil.unmarshall(inputStream.getBody(),
				PORequestType.class);
		
		if(reqns==null) {
			logger.info("issues with unmarshalling the RequestBody to Object  ");
		}

		List<PORecordsType> inPORecords = reqns!=null?reqns.getPurchaseOrders():null;
		GetContractDataResponse finalPORes = new GetContractDataResponse();
		int i = 0;
		try {
			if (reqns!=null && reqns.getNumOfRecord() != reqns.getPurchaseOrders().size()) {

				inputStream.setBody(ContractServiceUtil.marshallException(ContractConstants.FAULT_CODE, ContractConstants.INVALID_DATA));
				return inputStream;

			}

			while (reqns!=null && i < reqns.getPurchaseOrders().size()) {
				if (reqns.getPurchaseOrders().get(i).getPOLineNumber() != i + 1) {
					inputStream.setBody(ContractServiceUtil.marshallException(ContractConstants.FAULT_CODE, ContractConstants.INVALID_DATA));
					return inputStream;
				}
				int j = 0;
				while (j < reqns.getPurchaseOrders().get(i).getRequisitionRecords().size()) {
					if (reqns.getPurchaseOrders().get(i).getRequisitionRecords().get(j).getRequisitionLineNumber() != j
							+ 1) {
						inputStream.setBody(ContractServiceUtil.marshallException(ContractConstants.FAULT_CODE, ContractConstants.INVALID_DATA));
						return inputStream;
					}
					j++;
				}
				i++;
			}

			ContractService contractService = new ContractServiceImpl();

			List<CSDetailPO> csDetails = contractService.getContractData(inPORecords);
			finalPORes.setCSDetails(csDetails);
			inputStream.setBody(ContractServiceUtil.marshall(finalPORes));
		} catch (ApplicationException e) {
			logger.error("Exception in ServiceHandler.handleRequest ", e);
			inputStream.setBody(ContractServiceUtil.marshallException(ContractConstants.FAULT_CODE, ContractConstants.J020_CS_EXCEPTION));
			return inputStream;
		}
		return inputStream;

	}

	public static void main(String[] args) {
		ServiceHandler s = new ServiceHandler();

		RequestWrapper wrapper =new RequestWrapper();
		wrapper.setBody("<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:con=\"http://contract/\"><soapenv:Header/><soapenv:Body><con:PORequest><NumOfRecord>1</NumOfRecord><PurchaseOrders POLineNumber=\"01\"><PurchaseOrderNum>NMNJH753C8</PurchaseOrderNum><totalPOCost>12.5</totalPOCost> <ContractNum>47QREA18D000B</ContractNum><BuyerCode></BuyerCode><RequisitionRecords requisitionLineNumber=\"1\"><requisitionNumber>POPlIT4200022</requisitionNumber><itemNumber>0000000000105</itemNumber> <reportingOffice>M</reportingOffice><pricingZone>01</pricingZone> </RequisitionRecords></PurchaseOrders></con:PORequest> </soapenv:Body> </soapenv:Envelope>");

		RequestWrapper outputStream = s.handleRequest(wrapper, null);
		System.out.println(outputStream.getBody());
	}

}