package contractinformationservice.handler;

import java.util.List;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import contractinformationservice.model.RequestWrapper;
import contractinformationservice.service.ContractService;
import contractinformationservice.service.ContractServiceImpl;
import contractinformationservice.util.ContractConstants;
import contractinformationservice.util.ContractServiceUtil;
import gov.gsa.fas.contractservice.contract.CSDetailPO;
import gov.gsa.fas.contractservice.contract.GetContractDataResponse;
import gov.gsa.fas.contractservice.contract.PORecordsType;
import gov.gsa.fas.contractservice.contract.PORequestType;

public class ServiceHandler implements RequestHandler<RequestWrapper, RequestWrapper> {
	public RequestWrapper handleRequest(RequestWrapper inputStream, Context context) {

		//LambdaLogger logger = context.getLogger();
		PORequestType reqns = ContractServiceUtil.unmarshall(inputStream.getBody(),
				PORequestType.class);

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
			e.printStackTrace();
		}
		return inputStream;

	}

	public static void main(String[] args) {
		ServiceHandler s = new ServiceHandler();

		RequestWrapper wrapper =new RequestWrapper();
		wrapper.setBody(ContractConstants.TEST_MULTIPLE_PO_BODY);
		RequestWrapper outputStream = s.handleRequest(wrapper, null);
		System.out.println(outputStream.getBody());
	}

}