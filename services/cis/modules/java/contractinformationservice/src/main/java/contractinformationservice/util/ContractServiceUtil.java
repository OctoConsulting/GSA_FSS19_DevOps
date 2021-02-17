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
import javax.xml.soap.SOAPFactory;
import javax.xml.soap.SOAPFault;
import javax.xml.soap.SOAPMessage;
import javax.xml.ws.soap.SOAPFaultException;

import contractinfromationservice.exception.SoapFaultException;

public class ContractServiceUtil {
	public static <T> T unmarshall(String xml, Class<T> clazz)
	{
		SOAPMessage message;
		T obj = null;
		try {
			message = MessageFactory.newInstance().createMessage(null, new ByteArrayInputStream(xml.getBytes()));

			JAXBContext jc = JAXBContext.newInstance(clazz);
			Unmarshaller unmarshaller = jc.createUnmarshaller();
			obj = clazz.cast(unmarshaller.unmarshal(message.getSOAPBody().extractContentAsDocument()));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SOAPException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch (JAXBException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return obj;
	}
	
	public static <T> String marshall(T data) {
	    try {
	        JAXBContext jaxbContext = JAXBContext.newInstance(data.getClass());
	        Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
	        StringWriter stringWriter=new StringWriter();
	        jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT,true);
	        QName qName = new QName("http://contract/", data.getClass().getSimpleName());
	        //JAXBElement<T> root = new JAXBElement(qName, data.getClass(),data);
	        //jaxbMarshaller.marshal(root, stringWriter);
	        
	        MessageFactory mf = MessageFactory.newInstance();
	        SOAPMessage message = mf.createMessage();
	        SOAPBody body = message.getSOAPBody();
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
	
	public static String createSOAPFaultException(String faultString) {
		  SOAPFault soapFault;
		  try {
		        
		    SOAPFactory soapFactory = SOAPFactory.newInstance();
		    soapFault = soapFactory.createFault();
		    soapFault.setFaultString(faultString);
		    
		    JAXBContext jaxbContext = JAXBContext.newInstance(SOAPFaultException.class);
	        Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
	        
	        jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT,true);
	        QName qName = new QName("http://contract/", SOAPFault.class.getSimpleName());
	        //JAXBElement<T> root = new JAXBElement(qName, data.getClass(),data);
	        //jaxbMarshaller.marshal(root, stringWriter);
	        
	        MessageFactory mf = MessageFactory.newInstance();
	        SOAPMessage message = mf.createMessage();
	        SOAPBody body = message.getSOAPBody();
	        //JAXBElement<SoapFaultException> root = new JAXBElement(qName, SoapFaultException.class,soapFault);
	        jaxbMarshaller.marshal(soapFault, body);

	        message.saveChanges();
	        //return stringWriter.toString();
	        
	        
	        ByteArrayOutputStream outstream = new ByteArrayOutputStream();
	        message.writeTo(System.out);
	        String strMsg = new String(outstream.toByteArray());
	        return strMsg;
		  } catch (SOAPException | JAXBException | IOException e) {
		    System.out.println(e);
			  throw new RuntimeException("SOAP error");
		  }
		   
		}
}
