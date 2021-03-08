package gov.gsa.fas.contractservice.util;

import org.apache.commons.lang3.StringUtils;

public enum ContractInternalIDType {

	DUNS,

	GSAM,

	FCON;

	public String get(String contractID) {
		if (StringUtils.isNotBlank(contractID)) {
			return name() + "_" + contractID;
		}
		return contractID;
	}

}
