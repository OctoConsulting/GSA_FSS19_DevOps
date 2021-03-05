//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.3.0 
// See <a href="https://javaee.github.io/jaxb-v2/">https://javaee.github.io/jaxb-v2/</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2021.01.25 at 12:17:25 PM EST 
//


package gov.gsa.fas.contractservice.contract;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for requisitionRes complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="requisitionRes"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="requisitionNumber" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="reportingOffice" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="itemNotes" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="itemNotesCount" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *       &lt;/sequence&gt;
 *       &lt;attribute name="requistionLineNumber" type="{http://www.w3.org/2001/XMLSchema}int" /&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "requisitionRes", propOrder = {
    "requisitionNumber",
    "reportingOffice",
    "itemNotes",
    "itemNotesCount"
})
public class RequisitionRes {

    @XmlElement(required = true)
    protected String requisitionNumber;
    @XmlElement(required = true)
    protected String reportingOffice;
    @XmlElement(required = true)
    protected String itemNotes;
    @XmlElement(required = true)
    protected String itemNotesCount;
    @XmlAttribute(name = "requistionLineNumber")
    protected Integer requistionLineNumber;

    /**
     * Gets the value of the requisitionNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRequisitionNumber() {
        return requisitionNumber;
    }

    /**
     * Sets the value of the requisitionNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRequisitionNumber(String value) {
        this.requisitionNumber = value;
    }

    /**
     * Gets the value of the reportingOffice property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReportingOffice() {
        return reportingOffice;
    }

    /**
     * Sets the value of the reportingOffice property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReportingOffice(String value) {
        this.reportingOffice = value;
    }

    /**
     * Gets the value of the itemNotes property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getItemNotes() {
        return itemNotes;
    }

    /**
     * Sets the value of the itemNotes property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setItemNotes(String value) {
        this.itemNotes = value;
    }

    /**
     * Gets the value of the itemNotesCount property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getItemNotesCount() {
        return itemNotesCount;
    }

    /**
     * Sets the value of the itemNotesCount property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setItemNotesCount(String value) {
        this.itemNotesCount = value;
    }

    /**
     * Gets the value of the requistionLineNumber property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getRequistionLineNumber() {
        return requistionLineNumber;
    }

    /**
     * Sets the value of the requistionLineNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setRequistionLineNumber(Integer value) {
        this.requistionLineNumber = value;
    }

}