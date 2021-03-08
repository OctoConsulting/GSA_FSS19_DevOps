package gov.gsa.fas.contractservice.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DateUtil {

	private static final Logger LOGGER = LoggerFactory.getLogger(DateUtil.class);
	private final static String DATE_ERROR_TEXT = "error=";
	public static String gregToJulian(String greg) {
		String result = "0";
		String str = greg;
		String year = str.substring(0, 4);
		String month = str.substring(4, 6);
		String day = str.substring(6, 8);
		Calendar cal = Calendar.getInstance();
		try {
			cal.set(Integer.parseInt(year), Integer.parseInt(month) - 1, Integer.parseInt(day));
			java.util.Date date = cal.getTime();
			java.text.SimpleDateFormat sdf = new SimpleDateFormat(ContractConstants.JULIANDATE_FORMAT);
			result = sdf.format(date);
		} catch (NumberFormatException e) {

			
			LOGGER.error(DATE_ERROR_TEXT + e.getLocalizedMessage(), e);
		}
		return result;
	}

	public static String julianToGreg(String julian) throws java.text.ParseException {
		String greg = "";

		SimpleDateFormat sdf = new SimpleDateFormat(ContractConstants.JULIANDATE_FORMAT);
		try {
			java.util.Date date = sdf.parse(julian);
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			SimpleDateFormat sdf2 = new SimpleDateFormat(ContractConstants.MMDDYYYY);

			greg = sdf2.format(date);
		} catch (ParseException ex) {

			LOGGER.error(DATE_ERROR_TEXT + ex.getLocalizedMessage(), ex);
		}
		return greg;

	}

	public static String julianToGregymd(String julian) throws java.text.ParseException {
		String greg = "";

		try {
			SimpleDateFormat sdf = new SimpleDateFormat(ContractConstants.JULIANDATE_FORMAT);
			java.util.Date date = sdf.parse(julian);
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			SimpleDateFormat sdf2 = new SimpleDateFormat(ContractConstants.MMDDYYYY);

			greg = sdf2.format(date);
		} catch (ParseException ex) {

			LOGGER.error(DATE_ERROR_TEXT + ex.getLocalizedMessage(), ex);
		}
		return greg;

	}

	public static String julianToGregf(String julian) throws java.text.ParseException {
		String greg = "";

		try {
			SimpleDateFormat sdf = new SimpleDateFormat(ContractConstants.JULIANDATE_FORMAT);
			java.util.Date date = sdf.parse(julian);
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			SimpleDateFormat sdf2 = new SimpleDateFormat("MM/dd/yyyy");

			greg = sdf2.format(date);
		} catch (ParseException ex) {

			LOGGER.error(DATE_ERROR_TEXT + ex.getLocalizedMessage(), ex);
		}
		return greg;

	}

	public static String julianToGregf2(String julian) {
		if(StringUtils.isNotBlank(julian)) {
			try {
				SimpleDateFormat sdf = new SimpleDateFormat(ContractConstants.JULIANDATE_FORMAT);
				java.util.Date date = sdf.parse(julian);
				Calendar cal = Calendar.getInstance();
				cal.setTime(date);
				SimpleDateFormat sdf2 = new SimpleDateFormat(ContractConstants.YYYYMMDD_FORMAT);
	
				return sdf2.format(date);
			} catch (ParseException ex) {
				LOGGER.error(DATE_ERROR_TEXT + ex.getLocalizedMessage(), ex);
			}
		}
		return null;
	}

	public static XMLGregorianCalendar stringToXMLGregorianCalendar(String s) {
		if(StringUtils.isNotBlank(s)) {
			try {
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat(ContractConstants.YYYYMMDD_FORMAT);
				Date date = simpleDateFormat.parse(s);
				GregorianCalendar gregorianCalendar = (GregorianCalendar) GregorianCalendar.getInstance();
				gregorianCalendar.setTime(date);
				return DatatypeFactory.newInstance().newXMLGregorianCalendar(gregorianCalendar);
			} catch (ParseException | DatatypeConfigurationException ex) {
				LOGGER.error(DATE_ERROR_TEXT + ex.getLocalizedMessage(), ex);
			}
		}
		return null;
	}

	public static int dateCompare(String date1, String date2) throws java.text.ParseException {
		int res = 3;
		try {

			SimpleDateFormat sdf = new SimpleDateFormat(ContractConstants.YYYYMMDD_FORMAT);
			Date cdate1 = sdf.parse(date1);
			Date cdate2 = sdf.parse(date2);

			if (cdate1.after(cdate2)) {
				res = 1;
			}

			if (cdate1.before(cdate2)) {
				res = 2;
			}

			if (date1.equals(date2)) {
				res = 0;
			}

		} catch (ParseException ex) {
			LOGGER.error(DATE_ERROR_TEXT + ex.getLocalizedMessage(), ex);
		}
		return res;
	}
	
	public static String[] getDateTime() {
		String str[] = new String[2];

		try {
			str[0] = new java.text.SimpleDateFormat(ContractConstants.YYYYMMDD_FORMAT).format(new
					java.util.Date());

			str[1] = new java.text.SimpleDateFormat("hhmmss").format(new java.
					util.Date());

		} catch (RuntimeException e) {
			LOGGER.error(e.getLocalizedMessage(),e); 
		}
		return str;

	}
}
