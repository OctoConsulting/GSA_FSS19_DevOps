//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.3.0 
// See <a href="https://javaee.github.io/jaxb-v2/">https://javaee.github.io/jaxb-v2/</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2021.01.25 at 12:17:25 PM EST 
//


package gov.gsa.fas.contractservice.contract;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PORequestType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="PORequestType"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="NumOfRecord" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="PurchaseOrders" type="{http://contract/}PORecordsType" maxOccurs="unbounded"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "PORequestType", propOrder = {
    "numOfRecord",
    "purchaseOrders"
})
@XmlRootElement(name = "PORequest")
public class PORequestType {

    @XmlElement(name = "NumOfRecord")
    protected int numOfRecord;
    @XmlElement(name = "PurchaseOrders", required = true)
    protected List<PORecordsType> purchaseOrders;

    /**
     * Gets the value of the numOfRecord property.
     * 
     */
    public int getNumOfRecord() {
        return numOfRecord;
    }

    /**
     * Sets the value of the numOfRecord property.
     * 
     */
    public void setNumOfRecord(int value) {
        this.numOfRecord = value;
    }

    /**
     * Gets the value of the purchaseOrders property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the purchaseOrders property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPurchaseOrders().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PORecordsType }
     * 
     * 
     */
    public List<PORecordsType> getPurchaseOrders() {
        if (purchaseOrders == null) {
            purchaseOrders = new ArrayList<PORecordsType>();
        }
        return this.purchaseOrders;
    }

}