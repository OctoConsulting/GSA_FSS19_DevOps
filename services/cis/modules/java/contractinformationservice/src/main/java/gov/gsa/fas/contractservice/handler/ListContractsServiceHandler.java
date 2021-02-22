package gov.gsa.fas.contractservice.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import gov.gsa.fas.contractservice.model.PathParameters;
import gov.gsa.fas.contractservice.model.RequestWrapper;
import gov.gsa.fas.contractservice.service.ContractService;
import gov.gsa.fas.contractservice.service.ContractServiceImpl;
import gov.gsa.fas.contractservice.util.ContractConstants;

public class ListContractsServiceHandler implements RequestHandler<RequestWrapper, RequestWrapper> {
	public RequestWrapper handleRequest(RequestWrapper inputStream, Context context) {

		ContractService contractService = new ContractServiceImpl();
		return contractService.getListContractResponse(inputStream);

	}

	public static void main(String[] args) {
		ListContractsServiceHandler s = new ListContractsServiceHandler();

		RequestWrapper wrapper =new RequestWrapper();
		PathParameters pathParams = new PathParameters();
		pathParams.setEntityid("12345678");
		wrapper.setPathParameters(pathParams);
		wrapper.setBody(ContractConstants.TEST_MULTIPLE_PO_BODY);
		RequestWrapper outputStream = s.handleRequest(wrapper, null);
		System.out.println(outputStream.getBody());
	}

}
