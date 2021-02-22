package contractinformationservice.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import contractinformationservice.model.PathParameters;
import contractinformationservice.model.RequestWrapper;
import contractinformationservice.service.ContractService;
import contractinformationservice.service.ContractServiceImpl;
import contractinformationservice.util.ContractConstants;

public class ContractDetailsServiceHandler implements RequestHandler<RequestWrapper, RequestWrapper> {
	public RequestWrapper handleRequest(RequestWrapper inputStream, Context context) {

		ContractService contractService = new ContractServiceImpl();
		return contractService.getContractDetailsResponse(inputStream);

	}

	public static void main(String[] args) {
		ContractDetailsServiceHandler s = new ContractDetailsServiceHandler();

		RequestWrapper wrapper =new RequestWrapper();
		PathParameters pathParams = new PathParameters();
		pathParams.setContractid("123456789");
		wrapper.setPathParameters(pathParams);
		wrapper.setBody(ContractConstants.TEST_MULTIPLE_PO_BODY);
		RequestWrapper outputStream = s.handleRequest(wrapper, null);
		System.out.println(outputStream.getBody());
	}

}