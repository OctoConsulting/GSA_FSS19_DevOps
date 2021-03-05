//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.3.0 
// See <a href="https://javaee.github.io/jaxb-v2/">https://javaee.github.io/jaxb-v2/</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2021.01.25 at 12:17:25 PM EST 
//


package gov.gsa.fas.contractservice.contract;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for CSDetailPO complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="CSDetailPO"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="purchaseOrderNumber" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="ACO" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="buyerCode" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="acceptDays" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="reportingOffice" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="buyerName" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="buyerEmailAddress" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="buyerPhoneNumber" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="PurchaseOrderContractNumber" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="internalContractNumber" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="formalContractNumber" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="contractorAddress" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="discountTerms" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="DORating" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="FOBCode" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="MSDSCOde" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="percentVariationMinus" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="percentVariationPlus" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="shipDeliveryCode" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="ARNCode" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="ARNDays" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="parentMASContractNumber" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="signatureName" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="requisitionLinesRes" type="{http://contract/}requisitionRes" maxOccurs="unbounded"/&gt;
 *         &lt;element name="POPCode" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="contractNotesList" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="contractNotesDetails" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="supplierAddress" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="reportOfficeAddress" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="acoAddress" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="faxNumber" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="efptIndicator" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="inspectionPoint" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="volumeDiscount" type="{http://contract/}Range" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="volumeDiscountAmount" type="{http://www.w3.org/2001/XMLSchema}double"/&gt;
 *         &lt;element name="volumeDiscountPercentage" type="{http://www.w3.org/2001/XMLSchema}double"/&gt;
 *         &lt;element name="inspectAcceptByOriginRegion" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="maxPODollarValue" type="{http://www.w3.org/2001/XMLSchema}decimal"/&gt;
 *         &lt;element name="reportingOfficeAAC" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="instrumentType" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="result" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *       &lt;/sequence&gt;
 *       &lt;attribute name="POLineNumber" type="{http://www.w3.org/2001/XMLSchema}int" /&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "CSDetailPO", propOrder = {
    "purchaseOrderNumber",
    "aco",
    "buyerCode",
    "acceptDays",
    "reportingOffice",
    "buyerName",
    "buyerEmailAddress",
    "buyerPhoneNumber",
    "purchaseOrderContractNumber",
    "internalContractNumber",
    "formalContractNumber",
    "contractorAddress",
    "discountTerms",
    "doRating",
    "fobCode",
    "msdscOde",
    "percentVariationMinus",
    "percentVariationPlus",
    "shipDeliveryCode",
    "arnCode",
    "arnDays",
    "parentMASContractNumber",
    "signatureName",
    "requisitionLinesRes",
    "popCode",
    "contractNotesList",
    "contractNotesDetails",
    "supplierAddress",
    "reportOfficeAddress",
    "acoAddress",
    "faxNumber",
    "efptIndicator",
    "inspectionPoint",
    "volumeDiscount",
    "volumeDiscountAmount",
    "volumeDiscountPercentage",
    "inspectAcceptByOriginRegion",
    "maxPODollarValue",
    "reportingOfficeAAC",
    "instrumentType",
    "result"
})
public class CSDetailPO {

    @XmlElement(required = true)
    protected String purchaseOrderNumber;
    @XmlElement(name = "ACO", required = true)
    protected String aco;
    @XmlElement(required = true)
    protected String buyerCode;
    @XmlElement(required = true)
    protected String acceptDays;
    @XmlElement(required = true)
    protected String reportingOffice;
    @XmlElement(required = true)
    protected String buyerName;
    @XmlElement(required = true)
    protected String buyerEmailAddress;
    @XmlElement(required = true)
    protected String buyerPhoneNumber;
    @XmlElement(name = "PurchaseOrderContractNumber", required = true)
    protected String purchaseOrderContractNumber;
    @XmlElement(required = true)
    protected String internalContractNumber;
    @XmlElement(required = true)
    protected String formalContractNumber;
    @XmlElement(required = true)
    protected String contractorAddress;
    @XmlElement(required = true)
    protected String discountTerms;
    @XmlElement(name = "DORating", required = true)
    protected String doRating;
    @XmlElement(name = "FOBCode", required = true)
    protected String fobCode;
    @XmlElement(name = "MSDSCOde", required = true)
    protected String msdscOde;
    @XmlElement(required = true)
    protected String percentVariationMinus;
    @XmlElement(required = true)
    protected String percentVariationPlus;
    @XmlElement(required = true)
    protected String shipDeliveryCode;
    @XmlElement(name = "ARNCode", required = true)
    protected String arnCode;
    @XmlElement(name = "ARNDays", required = true)
    protected String arnDays;
    @XmlElement(required = true)
    protected String parentMASContractNumber;
    @XmlElement(required = true)
    protected String signatureName;
    @XmlElement(required = true)
    protected List<RequisitionRes> requisitionLinesRes;
    @XmlElement(name = "POPCode", required = true)
    protected String popCode;
    @XmlElement(required = true)
    protected String contractNotesList;
    @XmlElement(required = true)
    protected String contractNotesDetails;
    @XmlElement(required = true)
    protected String supplierAddress;
    @XmlElement(required = true)
    protected String reportOfficeAddress;
    @XmlElement(required = true)
    protected String acoAddress;
    @XmlElement(required = true)
    protected String faxNumber;
    @XmlElement(required = true)
    protected String efptIndicator;
    @XmlElement(required = true)
    protected String inspectionPoint;
    protected List<Range> volumeDiscount;
    protected double volumeDiscountAmount;
    protected double volumeDiscountPercentage;
    @XmlElement(required = true)
    protected String inspectAcceptByOriginRegion;
    @XmlElement(required = true)
    protected BigDecimal maxPODollarValue;
    @XmlElement(required = true)
    protected String reportingOfficeAAC;
    @XmlElement(required = true)
    protected String instrumentType;
    @XmlElement(required = true)
    protected String result;
    @XmlAttribute(name = "POLineNumber")
    protected Integer poLineNumber;

    /**
     * Gets the value of the purchaseOrderNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPurchaseOrderNumber() {
        return purchaseOrderNumber;
    }

    /**
     * Sets the value of the purchaseOrderNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPurchaseOrderNumber(String value) {
        this.purchaseOrderNumber = value;
    }

    /**
     * Gets the value of the aco property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getACO() {
        return aco;
    }

    /**
     * Sets the value of the aco property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setACO(String value) {
        this.aco = value;
    }

    /**
     * Gets the value of the buyerCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBuyerCode() {
        return buyerCode;
    }

    /**
     * Sets the value of the buyerCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBuyerCode(String value) {
        this.buyerCode = value;
    }

    /**
     * Gets the value of the acceptDays property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAcceptDays() {
        return acceptDays;
    }

    /**
     * Sets the value of the acceptDays property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAcceptDays(String value) {
        this.acceptDays = value;
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
     * Gets the value of the buyerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBuyerName() {
        return buyerName;
    }

    /**
     * Sets the value of the buyerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBuyerName(String value) {
        this.buyerName = value;
    }

    /**
     * Gets the value of the buyerEmailAddress property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBuyerEmailAddress() {
        return buyerEmailAddress;
    }

    /**
     * Sets the value of the buyerEmailAddress property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBuyerEmailAddress(String value) {
        this.buyerEmailAddress = value;
    }

    /**
     * Gets the value of the buyerPhoneNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBuyerPhoneNumber() {
        return buyerPhoneNumber;
    }

    /**
     * Sets the value of the buyerPhoneNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBuyerPhoneNumber(String value) {
        this.buyerPhoneNumber = value;
    }

    /**
     * Gets the value of the purchaseOrderContractNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPurchaseOrderContractNumber() {
        return purchaseOrderContractNumber;
    }

    /**
     * Sets the value of the purchaseOrderContractNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPurchaseOrderContractNumber(String value) {
        this.purchaseOrderContractNumber = value;
    }

    /**
     * Gets the value of the internalContractNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getInternalContractNumber() {
        return internalContractNumber;
    }

    /**
     * Sets the value of the internalContractNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setInternalContractNumber(String value) {
        this.internalContractNumber = value;
    }

    /**
     * Gets the value of the formalContractNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFormalContractNumber() {
        return formalContractNumber;
    }

    /**
     * Sets the value of the formalContractNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFormalContractNumber(String value) {
        this.formalContractNumber = value;
    }

    /**
     * Gets the value of the contractorAddress property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getContractorAddress() {
        return contractorAddress;
    }

    /**
     * Sets the value of the contractorAddress property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setContractorAddress(String value) {
        this.contractorAddress = value;
    }

    /**
     * Gets the value of the discountTerms property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDiscountTerms() {
        return discountTerms;
    }

    /**
     * Sets the value of the discountTerms property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDiscountTerms(String value) {
        this.discountTerms = value;
    }

    /**
     * Gets the value of the doRating property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDORating() {
        return doRating;
    }

    /**
     * Sets the value of the doRating property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDORating(String value) {
        this.doRating = value;
    }

    /**
     * Gets the value of the fobCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFOBCode() {
        return fobCode;
    }

    /**
     * Sets the value of the fobCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFOBCode(String value) {
        this.fobCode = value;
    }

    /**
     * Gets the value of the msdscOde property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMSDSCOde() {
        return msdscOde;
    }

    /**
     * Sets the value of the msdscOde property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMSDSCOde(String value) {
        this.msdscOde = value;
    }

    /**
     * Gets the value of the percentVariationMinus property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPercentVariationMinus() {
        return percentVariationMinus;
    }

    /**
     * Sets the value of the percentVariationMinus property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPercentVariationMinus(String value) {
        this.percentVariationMinus = value;
    }

    /**
     * Gets the value of the percentVariationPlus property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPercentVariationPlus() {
        return percentVariationPlus;
    }

    /**
     * Sets the value of the percentVariationPlus property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPercentVariationPlus(String value) {
        this.percentVariationPlus = value;
    }

    /**
     * Gets the value of the shipDeliveryCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getShipDeliveryCode() {
        return shipDeliveryCode;
    }

    /**
     * Sets the value of the shipDeliveryCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setShipDeliveryCode(String value) {
        this.shipDeliveryCode = value;
    }

    /**
     * Gets the value of the arnCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getARNCode() {
        return arnCode;
    }

    /**
     * Sets the value of the arnCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setARNCode(String value) {
        this.arnCode = value;
    }

    /**
     * Gets the value of the arnDays property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getARNDays() {
        return arnDays;
    }

    /**
     * Sets the value of the arnDays property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setARNDays(String value) {
        this.arnDays = value;
    }

    /**
     * Gets the value of the parentMASContractNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getParentMASContractNumber() {
        return parentMASContractNumber;
    }

    /**
     * Sets the value of the parentMASContractNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setParentMASContractNumber(String value) {
        this.parentMASContractNumber = value;
    }

    /**
     * Gets the value of the signatureName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSignatureName() {
        return signatureName;
    }

    /**
     * Sets the value of the signatureName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSignatureName(String value) {
        this.signatureName = value;
    }

    /**
     * Gets the value of the requisitionLinesRes property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the requisitionLinesRes property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getRequisitionLinesRes().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link RequisitionRes }
     * 
     * 
     */
    public List<RequisitionRes> getRequisitionLinesRes() {
        if (requisitionLinesRes == null) {
            requisitionLinesRes = new ArrayList<RequisitionRes>();
        }
        return this.requisitionLinesRes;
    }

    /**
     * Gets the value of the popCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPOPCode() {
        return popCode;
    }

    /**
     * Sets the value of the popCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPOPCode(String value) {
        this.popCode = value;
    }

    /**
     * Gets the value of the contractNotesList property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getContractNotesList() {
        return contractNotesList;
    }

    /**
     * Sets the value of the contractNotesList property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setContractNotesList(String value) {
        this.contractNotesList = value;
    }

    /**
     * Gets the value of the contractNotesDetails property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getContractNotesDetails() {
        return contractNotesDetails;
    }

    /**
     * Sets the value of the contractNotesDetails property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setContractNotesDetails(String value) {
        this.contractNotesDetails = value;
    }

    /**
     * Gets the value of the supplierAddress property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSupplierAddress() {
        return supplierAddress;
    }

    /**
     * Sets the value of the supplierAddress property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSupplierAddress(String value) {
        this.supplierAddress = value;
    }

    /**
     * Gets the value of the reportOfficeAddress property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReportOfficeAddress() {
        return reportOfficeAddress;
    }

    /**
     * Sets the value of the reportOfficeAddress property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReportOfficeAddress(String value) {
        this.reportOfficeAddress = value;
    }

    /**
     * Gets the value of the acoAddress property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAcoAddress() {
        return acoAddress;
    }

    /**
     * Sets the value of the acoAddress property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAcoAddress(String value) {
        this.acoAddress = value;
    }

    /**
     * Gets the value of the faxNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFaxNumber() {
        return faxNumber;
    }

    /**
     * Sets the value of the faxNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFaxNumber(String value) {
        this.faxNumber = value;
    }

    /**
     * Gets the value of the efptIndicator property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEfptIndicator() {
        return efptIndicator;
    }

    /**
     * Sets the value of the efptIndicator property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEfptIndicator(String value) {
        this.efptIndicator = value;
    }

    /**
     * Gets the value of the inspectionPoint property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getInspectionPoint() {
        return inspectionPoint;
    }

    /**
     * Sets the value of the inspectionPoint property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setInspectionPoint(String value) {
        this.inspectionPoint = value;
    }

    /**
     * Gets the value of the volumeDiscount property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the volumeDiscount property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getVolumeDiscount().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Range }
     * 
     * 
     */
    public List<Range> getVolumeDiscount() {
        if (volumeDiscount == null) {
            volumeDiscount = new ArrayList<Range>();
        }
        return this.volumeDiscount;
    }

    /**
     * Gets the value of the volumeDiscountAmount property.
     * 
     */
    public double getVolumeDiscountAmount() {
        return volumeDiscountAmount;
    }

    /**
     * Sets the value of the volumeDiscountAmount property.
     * 
     */
    public void setVolumeDiscountAmount(double value) {
        this.volumeDiscountAmount = value;
    }

    /**
     * Gets the value of the volumeDiscountPercentage property.
     * 
     */
    public double getVolumeDiscountPercentage() {
        return volumeDiscountPercentage;
    }

    /**
     * Sets the value of the volumeDiscountPercentage property.
     * 
     */
    public void setVolumeDiscountPercentage(double value) {
        this.volumeDiscountPercentage = value;
    }

    /**
     * Gets the value of the inspectAcceptByOriginRegion property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getInspectAcceptByOriginRegion() {
        return inspectAcceptByOriginRegion;
    }

    /**
     * Sets the value of the inspectAcceptByOriginRegion property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setInspectAcceptByOriginRegion(String value) {
        this.inspectAcceptByOriginRegion = value;
    }

    /**
     * Gets the value of the maxPODollarValue property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getMaxPODollarValue() {
        return maxPODollarValue;
    }

    /**
     * Sets the value of the maxPODollarValue property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setMaxPODollarValue(BigDecimal value) {
        this.maxPODollarValue = value;
    }

    /**
     * Gets the value of the reportingOfficeAAC property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReportingOfficeAAC() {
        return reportingOfficeAAC;
    }

    /**
     * Sets the value of the reportingOfficeAAC property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReportingOfficeAAC(String value) {
        this.reportingOfficeAAC = value;
    }

    /**
     * Gets the value of the instrumentType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getInstrumentType() {
        return instrumentType;
    }

    /**
     * Sets the value of the instrumentType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setInstrumentType(String value) {
        this.instrumentType = value;
    }

    /**
     * Gets the value of the result property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getResult() {
        return result;
    }

    /**
     * Sets the value of the result property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setResult(String value) {
        this.result = value;
    }

    /**
     * Gets the value of the poLineNumber property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getPOLineNumber() {
        return poLineNumber;
    }

    /**
     * Sets the value of the poLineNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setPOLineNumber(Integer value) {
        this.poLineNumber = value;
    }

}