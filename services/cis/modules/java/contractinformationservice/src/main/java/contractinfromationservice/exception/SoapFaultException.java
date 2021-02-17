package contractinfromationservice.exception;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "soapFaultException", propOrder = {
    "faultString"
})
public class SoapFaultException{

	/**
	 * 
	 */
	//private static final long serialVersionUID = 1L;
	private String faultString;


	public String getFaultString() {
		return faultString;
	}


	public void setFaultString(String faultString) {
		this.faultString = faultString;
	}


	public SoapFaultException(String faultString) {
        this.faultString = faultString;
    }
    /*public SoapFaultException(String message, SoapFaultException faultInfo) {
        super(message);
        this.faultInfo = faultInfo;
    }

    public SoapFaultException(String message, SoapFaultException faultInfo, Throwable cause) {
        super(message, cause);
        this.faultInfo = faultInfo;
    }

    public SoapFaultException getFaultInfo() {
        return faultInfo;
    }
    */
}
