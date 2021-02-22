package contractinformationservice.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.namespace.QName;
import javax.xml.soap.MessageFactory;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPMessage;

public class ContractServiceUtil {
	
	private static final String PREFERRED_PREFIX = "soap";
	private static final String SOAP_ENV_NAMESPACE = "http://schemas.xmlsoap.org/soap/envelope/";
	 
	public static <T> T unmarshall(String xml, Class<T> clazz)
	{
		SOAPMessage message;
		T obj = null;
		try {
			message = MessageFactory.newInstance().createMessage(null, new ByteArrayInputStream(xml.getBytes()));

			JAXBContext jc = JAXBContext.newInstance(clazz);
			Unmarshaller unmarshaller = jc.createUnmarshaller();
			obj = clazz.cast(unmarshaller.unmarshal(message.getSOAPBody().extractContentAsDocument()));
		} catch (JAXBException | SOAPException | IOException  e) {
			e.printStackTrace();
		}

		return obj;
	}

	public static <T> String marshall(T data) {
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(data.getClass());
			Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT,true);
			QName qName = new QName("http://contract/", data.getClass().getSimpleName());

			MessageFactory mf = MessageFactory.newInstance();
			SOAPMessage message = mf.createMessage();
			SOAPBody body = message.getSOAPBody();
			message.getSOAPPart().getEnvelope().removeNamespaceDeclaration(message.getSOAPPart().getEnvelope().getPrefix());
			message.getSOAPPart().getEnvelope().addNamespaceDeclaration(PREFERRED_PREFIX, SOAP_ENV_NAMESPACE);

			message.getSOAPPart().getEnvelope().setPrefix(PREFERRED_PREFIX);
			message.getSOAPBody().setPrefix(PREFERRED_PREFIX);
			message.getSOAPHeader().setPrefix(PREFERRED_PREFIX);
			JAXBElement<T> root = new JAXBElement(qName, data.getClass(),data);
			jaxbMarshaller.marshal(root, body);

			message.saveChanges();
			//return stringWriter.toString();


			ByteArrayOutputStream outstream = new ByteArrayOutputStream();
			message.writeTo(outstream);
			String strMsg = new String(outstream.toByteArray());
			return strMsg;
		} catch (JAXBException | SOAPException | IOException  e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static <T> String marshallException(String faultCode, String faultMessage) {
		String returnString = "";

		try {
			MessageFactory messageFactory = MessageFactory.newInstance();
			SOAPMessage msg = messageFactory.createMessage();

			msg.getSOAPPart().getEnvelope().removeNamespaceDeclaration(msg.getSOAPPart().getEnvelope().getPrefix());
			msg.getSOAPPart().getEnvelope().addNamespaceDeclaration(PREFERRED_PREFIX, SOAP_ENV_NAMESPACE);

			msg.getSOAPPart().getEnvelope().setPrefix(PREFERRED_PREFIX);
			msg.getSOAPBody().setPrefix(PREFERRED_PREFIX);
			msg.getSOAPHeader().setPrefix(PREFERRED_PREFIX);

			msg.getSOAPBody().addFault(new QName("http://schemas.xmlsoap.org/soap/envelope/",faultCode),
					faultMessage);
			msg.getSOAPBody().getFault().setPrefix(PREFERRED_PREFIX);

			ByteArrayOutputStream b = new ByteArrayOutputStream();
			msg.writeTo(b);
			returnString = new String(b.toByteArray());

		} catch (SOAPException | IOException  e) {
			e.printStackTrace();
		}

		return returnString;
	}


}
