package gov.gsa.fas.contractservice.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.log4j.Logger;

import gov.gsa.fas.contractservice.exception.CCSExceptions;

public class FormatDate {
	private static Logger LOGGER = Logger.getLogger(FormatDate.class);

	private FormatDate() {
	}

	public static boolean isValid(String value) throws CCSExceptions {
		String formattedDate = "";
		formattedDate = FormatDate.formatToYYYYMMDD(value);
		formattedDate = FormatDate.formatToMMDDYYYY(value);
		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		formatter.setLenient(false);
		if (formattedDate == null) {
			return false;
		} else {
			try {
				formatter.parse(formattedDate);
			} catch (ParseException e) {
				LOGGER.error(e.getLocalizedMessage());
				throw new CCSExceptions("Invalid Date Parser Exception ", e);
			} 
			return true;
		}
	}

	public static boolean isFuture(String dt, String cdt) {
		String date1 = "";
		String date2 = "";
		date1 = FormatDate.formatToYYYYMMDD(dt);
		date2 = FormatDate.formatToYYYYMMDD(cdt);
		int idt = Integer.parseInt(date1);
		int icdt = Integer.parseInt(date2);
		return idt > icdt ? true:false;
	}

	public static String getMonth(String mon) {
		String month = "";
		if (("01").equals(mon) || ("1").equals(mon)) {
			month = "JAN";
		}
		if (("02").equals(mon) || ("2").equals(mon)) {
			month = "FEB";
		}
		if (("03").equals(mon) || ("3").equals(mon)) {
			month = "MAR";
		}
		if (("04").equals(mon) || ("4").equals(mon)) {
			month = "APR";
		}
		if (("05").equals(mon) || ("5").equals(mon)) {
			month = "MAY";
		}
		if (("06").equals(mon) || ("6").equals(mon)) {
			month = "JUN";
		}
		if (("07").equals(mon) || ("7").equals(mon)) {
			month = "JUL";
		}
		if (("08").equals(mon) || ("8").equals(mon)) {
			month = "AUG";
		}
		if (("09").equals(mon) || ("9").equals(mon)) {
			month = "SEP";
		}
		if (("10").equals(mon) || ("10").equals(mon)) {
			month = "OCT";
		}
		if (("11").equals(mon) || ("11").equals(mon)) {
			month = "NOV";
		}
		if (("12").equals(mon) || ("12").equals(mon)) {
			month = "DEC";
		}
		return month;
	}

	public static String getNMonth(String mon) {
		String month = "";
		if ( "jan".equalsIgnoreCase(mon)) {
			month = "01";
		}
		if ( "feb".equalsIgnoreCase(mon)) {
			month = "02";
		}
		if ( "mar".equalsIgnoreCase(mon)) {
			month = "03";
		}
		if ("apr".equalsIgnoreCase(mon)) {
			month = "04";
		}
		if ( "may".equalsIgnoreCase(mon)) {
			month = "05";
		}
		if ( "jun".equalsIgnoreCase(mon)) {
			month = "06";
		}
		if ("jul".equalsIgnoreCase(mon)) {
			month = "07";
		}
		if ("aug".equalsIgnoreCase(mon)) {
			month = "08";
		}
		if ( "sep".equalsIgnoreCase(mon)) {
			month = "09";
		}
		if ("oct".equalsIgnoreCase(mon)) {
			month = "10";
		}
		if ("nov".equalsIgnoreCase(mon)) {
			month = "11";
		}
		if ("dec".equalsIgnoreCase(mon)) {
			month = "12";
		}
		return month;
	}

	public static String formatToYYYYMMDD(String dt) {
		String mm = "", dd = "", yyyy = "", formattedDate = "";
		if (dt.length() < 11) {
			int fn = dt.indexOf('-');
			if (fn == 1) {
				dd = "0" + dt.substring(0, 1);
				mm = dt.substring(2, 5);
				yyyy = dt.substring(6, 10);
			}
		} else {
			dd = dt.substring(0, 2);
			mm = dt.substring(3, 6);
			yyyy = dt.substring(7, 11);
		}
		formattedDate = yyyy.concat(FormatDate.getNMonth(mm)).concat(dd);
		return formattedDate;
	}

	public static String formatToDDMONYYYY(String dt) {
		String formattedDate = "", mon = dt.substring(4, 6);
		formattedDate = dt.substring(6,
				8).concat("-").concat(FormatDate.getMonth(mon)).
				concat("-").
				concat(dt.substring(0, 4));
		return formattedDate;
	}

	public static String formatToMMDDYYYY(String dt) {
		String formattedDate = dt.substring(4,
				6).concat("/").concat(dt.substring(6,
						8)).concat(
								"/").concat(dt.substring(0, 4));
		return formattedDate;
	}

	public static String formatDateDDMMMYYYY(String dt) {
		String strFormat = "yyyyMMdd";
		DateFormat formattedDate = new SimpleDateFormat(strFormat);
		Date date = null;
		String dateToReturn = "";
		try {
			date = formattedDate.parse(dt);
			String dateFormat = "dd-MMM-yyyy";
			SimpleDateFormat formatter = new SimpleDateFormat(dateFormat);
			dateToReturn = formatter.format(date);
		}catch (ParseException e) {
			LOGGER.error("formatDateDDMMMYYYY Error " +e.getLocalizedMessage() , e);
			//throw new CCSExceptions("Invalid Date Parser Exception ", e);
		}

		return dateToReturn;
	}

	public static String formatTime(String time) {
		String formattedDate = time.substring(0,
				2).concat(":").concat(time.substring(
						2, 4)).concat(
								":").concat(time.substring(4, 6));
		return formattedDate;
	}

	public static boolean compare(String date1, String date2) {
		int d1 = 0, d2 = 0;
		d1 = Integer.parseInt(date1);
		d2 = Integer.parseInt(date2);
		return d1 > d2 ? true : false;
	}

	public static String getPreviousYear(String str) {
		String result = "";
		String year = str.substring(0, 4);
		String month = str.substring(4, 6);
		String day = str.substring(6, 8);
		int yr = Integer.parseInt(year);

		Calendar cal = Calendar.getInstance();
		cal.set(yr - 1, Integer.parseInt(month) - 1,
				Integer.parseInt(day));
		java.util.Date date = cal.getTime();
		java.text.SimpleDateFormat sdf = new SimpleDateFormat("yyyyDDD");
		result = sdf.format(date);
		return result;

	}

}
