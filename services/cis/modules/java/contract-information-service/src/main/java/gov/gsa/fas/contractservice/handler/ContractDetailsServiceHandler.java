package gov.gsa.fas.contractservice.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import gov.gsa.fas.contractservice.model.PathParameters;
import gov.gsa.fas.contractservice.model.RequestWrapper;
import gov.gsa.fas.contractservice.service.ContractService;
import gov.gsa.fas.contractservice.service.ContractServiceImpl;
import gov.gsa.fas.contractservice.util.ContractConstants;

public class ContractDetailsServiceHandler implements RequestHandler<RequestWrapper, RequestWrapper> {
	public RequestWrapper handleRequest(RequestWrapper inputStream, Context context) {

		ContractService contractService = new ContractServiceImpl();
		return contractService.getContractDetailsResponse(inputStream);

	}

	public static void main(String[] args) {
		ContractDetailsServiceHandler s = new ContractDetailsServiceHandler();

		RequestWrapper wrapper =new RequestWrapper();
		PathParameters pathParams = new PathParameters();
		pathParams.setContractid("NFCA303");
		wrapper.setPathParameters(pathParams);
		wrapper.setBody(ContractConstants.TEST_MULTIPLE_PO_BODY);
		RequestWrapper outputStream = s.handleRequest(wrapper, null);
		System.out.println(outputStream.getBody());
	}

}