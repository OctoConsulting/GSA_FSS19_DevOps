package gov.gsa.fas.contractservice.model;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.http.Header;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;

import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.GlobalSecondaryIndex;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.Projection;
import com.amazonaws.services.dynamodbv2.model.ProjectionType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.google.gson.Gson;


public class App2 {

	public static void main(String[] args) throws InterruptedException {
		AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().withEndpointConfiguration(
				new AwsClientBuilder.EndpointConfiguration("http://localhost:8000", "us-east1")).build();

		DynamoDB dynamoDB = new DynamoDB(client);

	//	deleteTable(dynamoDB);
		
	//	createTable(dynamoDB);

		insertdata(dynamoDB);

	}

	private static void deleteTable(DynamoDB dynamoDB) {
		Table table = dynamoDB.getTable("contract_data");
		table.delete();
		
	}

	public static void insertdata(DynamoDB dynamoDB) throws InterruptedException {
		Table table = dynamoDB.getTable("contract_data");
		Item item = new Item().withPrimaryKey("internal_contract_number", "NFKA271")
				.withString("contract_details_identity", "GSAM_47QSEA20T000E");

		Item item2 = new Item().withPrimaryKey("internal_contract_number", "NFKA271")
				.withString("contract_details_identity", "detail_d402_NFKA271")
				.withJSON("details", getContractMaster());

		Item item3 = new Item().withPrimaryKey("internal_contract_number", "NFKA271")
				.withString("contract_details_identity", "detail_d410_NFKA271").withJSON("details", getAddress());

		Item item4 = new Item().withPrimaryKey("internal_contract_number", "NFKA271")
				.withString("contract_details_identity", "detail_d407_NFKA271").withJSON("details", getNSN());

		Item item5 = new Item().withPrimaryKey("internal_contract_number", "NFKA271")
				.withString("contract_details_identity", "detail_d403_NFKA271").withJSON("details", getnif());

		Item item6 = new Item().withPrimaryKey("internal_contract_number", "NFKA271")
				.withString("contract_details_identity", "detail_d430_NFKA271").withJSON("details", getCDFMaster());

		Item item7 = new Item().withPrimaryKey("internal_contract_number", "NFKA271")
				.withString("contract_details_identity", "FCON_47QSEA20T000E");

		Item item8 = new Item().withPrimaryKey("internal_contract_number", "NFKA271")
				.withString("contract_details_identity", "DUNS_080970255");//
		
		Item item9 = new Item().withPrimaryKey("internal_contract_number", "NFKA271")
				.withString("contract_details_identity", "detail_d411_NFKA271").withJSON("details", getEdiFaxTable());
		
		Item item10 =
				new Item().withPrimaryKey("internal_contract_number", "NFKA271")
				.withString("contract_details_identity", "detail_MQCID_NFKA271_C08_C_A").withJSON("details", getMQCIDData());

		
		System.out.println(getContractMaster());
		System.out.println(getAddress());
		System.out.println(getNSN());
		System.out.println(getCDFMaster());
		System.out.println(getEdiFaxTable());
		System.out.println(getMQCIDData());
		
		table.putItem(item);
		table.putItem(item2);
		table.putItem(item3);
		table.putItem(item4);
		table.putItem(item5);
		table.putItem(item6);
		table.putItem(item7);
		table.putItem(item8);
		table.putItem(item9);
		table.putItem(item10);
	
		//table.deleteItem(new PrimaryKey("internal_contract_number", "12345x","contract_details_identity", "detail_d411_NFKA271"));
		
	//	System.out.println(table.getItem("internal_contract_number", "NFKA271"));
		
	//	System.out.println(table.getItem());

		
		
		table.waitForActive();
	}

	private static String getAddress() {
		String d410_data = "{\"d410_actn_dt\":\"2020226\",\"d410_adrs1\":\"JTF BUSINESS SOLUTIONS CORP\",\"d410_name15\":\"JTF BUSINESS SO\",\"d410_name12\":\"JTF BUSINESS\",\"d410_name13_15\":\"SO\",\"d410_name17\":\"LUTIONS CORP\",\"d410_name33_120\":\"\",\"d410_adrs2\":\"85 S BRAGG ST STE 601\",\"d410_adrs3\":\"\",\"d410_city_name\":\"ALEXANDRIA\",\"d410_st\":\"VA\",\"d410_zip\":\"223122798\",\"d410_aloc_ppp\":\"5101000\",\"d410_cage_code\":\"82L11\",\"d410_cec\":\"080970255\",\"d410_edi_id_1\":\"\",\"d410_edi_id_2\":\"\",\"d410_efpt_ind\":\"F\",\"d410_phone_no\":\"703-658-2000\",\"d410_email_adrs\":\"\",\"d410_inet_adrs\":\"www.jtfgov.com\",\"d410_user_id\":\"D4002900 UPDATE-FROM-CCR\",\"d410_status\":\"A\",\"d410_cntry_cd\":\"USA\",\"d410_name_as\":\"\",\"d410_lst_dt_chg\":\"20200802\",\"d410_lst_ext_code\":\"A\",\"d410_foreign_st\":\"\",\"d410_mail_adrs_pc\":\"JTF BUSINESS SOLUTIONS CORP\",\"d410_mail_adrs1\":\"7368 STEEL MILL DRIVE\",\"d410_mail_adrs2\":\"\",\"d410_mail_city_nm\":\"SPRINGFIELD\",\"d410_mail_st\":\"VA\",\"d410_mail_zip\":\"22150\",\"d410_mail_country\":\"USA\",\"d410_mail_for_st\":\"\",\"d410_optout_pdisp\":\"\",\"d410_congress_dist\":\"8\",\"d410_prime_naics\":\"423420\",\"d410_db_out_busind\":\"\",\"d410_delinquent_flag\":\"N\",\"d410_exclusion_stat\":\"\",\"d410_sam_dodaac\":\"\",\"d410_dod\":\"\",\"d410_dodaac\":\"\"}";

		return d410_data;
	}

	private static String getContractMaster() {
		String cmd_data = "{\"d402_aco\":\"5\",\"d402_accept_dys\":\"7\",\"d402_byr_cd\":\"JV\",\"d402_cecc\":\"080970255\",\"d402_cecs\":\"080970255\",\"d402_cecm\":\"\",\"d402_cont_no\":\"NFKA271\",\"d402_disc_terms\":\"00.000%-00 00.000%-00 NET-30\",\"d402_fob_cd\":\"E\",\"d402_pct_var_mi\":\"00\",\"d402_pct_var_pl\":\"00\",\"d402_ship_del_cd\":\"D\",\"d402_note_cd\":\"26\",\"d402_arn_aro_cd\":\"O\",\"d402_arn_aro_dys\":\"7\",\"d402_sch_cont_no\":\"\",\"d402_pr_mthd\":\"T\",\"d402_cont_ind\":\"B\",\"d402_note_cd\":\"26\",\"d402_cont_beg_dt\":\"2020226\",\"d402_cont_end_dt\":\"2021224\",\"d402_dt_terminated\":\"\",\"d402_rpt_off\":\"M\",\"d402_fssi_type\":\"\",\"d402_insp_cd\":\"D\",\"d402_dval_min_ord\":\"0\",\"d402_bpa_service_chg\":\"0\",\"d402_dval_max_ord\":\"0\",\"d421_f_cont_no_ows\":\"47QSEA20T000E\",\"d402_qc_aco\":\"C08\"}";
		return cmd_data;
	}

	private static void createTable(DynamoDB dynamoDB) {
		try {
			// Attribute definitions
			ArrayList<AttributeDefinition> attributeDefinitions = new ArrayList<AttributeDefinition>();

			attributeDefinitions.add(
					new AttributeDefinition().withAttributeName("internal_contract_number").withAttributeType("S"));
			attributeDefinitions.add(
					new AttributeDefinition().withAttributeName("contract_details_identity").withAttributeType("S"));

			// Table key schema
			ArrayList<KeySchemaElement> tableKeySchema = new ArrayList<KeySchemaElement>();
			tableKeySchema.add(
					new KeySchemaElement().withAttributeName("internal_contract_number").withKeyType(KeyType.HASH)); // Partition
																														// key
			tableKeySchema.add(
					new KeySchemaElement().withAttributeName("contract_details_identity").withKeyType(KeyType.RANGE)); // Sort
																														// key

			GlobalSecondaryIndex precipIndex = new GlobalSecondaryIndex().withIndexName("contract_details_identity_index")
					.withProvisionedThroughput(new ProvisionedThroughput().withReadCapacityUnits((long) 10)
							.withWriteCapacityUnits((long) 1))
					.withProjection(new Projection().withProjectionType(ProjectionType.ALL));

			ArrayList<KeySchemaElement> indexKeySchema = new ArrayList<KeySchemaElement>();

			indexKeySchema.add(
					new KeySchemaElement().withAttributeName("contract_details_identity").withKeyType(KeyType.HASH)); // Partition
																														// key

			precipIndex.setKeySchema(indexKeySchema);
			CreateTableRequest createTableRequest = new CreateTableRequest().withTableName("contract_data")
					.withProvisionedThroughput(new ProvisionedThroughput().withReadCapacityUnits((long) 5)
							.withWriteCapacityUnits((long) 1))
					.withAttributeDefinitions(attributeDefinitions).withKeySchema(tableKeySchema)
					.withGlobalSecondaryIndexes(precipIndex);

			Table table = dynamoDB.createTable(createTableRequest);
			System.out.println("Success.  Table status: " + table.getDescription().getTableStatus() +  table.getDescription() +  table.getTableName() +  table.toString());

		} catch (Exception e) {
			System.err.println("Cannot retrieve items.");
			System.err.println(e.getMessage());
		}
	}

	private static String getNSN() {

		String nsns = "[{\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"1\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"2\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"3\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"4\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"5\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"6\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"7\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"8\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"9\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"10\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"11\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"12\"}, "
				+ " {\"d407_cont_no\":\"NFKA271\",\"d407_byr_cd\":\"JV\",\"d407_cecs\":\"\",\"d407_fob_cd\":\"\",\"d407_msds_cd\":\"N\",\"d407_pop_cd\":\"M\",\"d407_note_cd\":\"\",\"d407_rpt_off\":\"N\",\"d407_nsn\":\"7510015904409\",\"d407_zone_sdf\":\"13\"}]";
		return nsns;
	}

	private static String getnif() {

		String tt = "{\"d403_d_o_rating\":\"N\",\"d403_proper_name\":\"\",\"d403_dac\":\"\",\"d403_nsn\":\"7510015904409\"}";
		return tt;
	}

	private static List<VolumeDiscount> getVolumeDiscount() {

		/*
		 * VolumeDiscount NFCA302_vd1 = new VolumeDiscount("NFKA271", "01", "0",
		 * "GEORGEDOUKAS", "20160729", "155134"); VolumeDiscount NFCA302_vd2 = new
		 * VolumeDiscount("NFKA271", "02", "0", "GEORGEDOUKAS", "20160729", "155134");
		 * VolumeDiscount NFCA302_vd3 = new VolumeDiscount("NFKA271", "03", "3",
		 * "GEORGEDOUKAS", "20160729", "155134"); VolumeDiscount NFCA302_vd4 = new
		 * VolumeDiscount("NFKA271", "04", "5", "GEORGEDOUKAS", "20160729", "155134");
		 * VolumeDiscount NFCA302_vd5 = new VolumeDiscount("NFKA271", "05", "15.5",
		 * "GEORGEDOUKAS", "20160729", "155134"); List<VolumeDiscount>
		 * volDiscountList_NFCA302 = new ArrayList<VolumeDiscount>();
		 * volDiscountList_NFCA302.add(NFCA302_vd1);
		 * volDiscountList_NFCA302.add(NFCA302_vd2);
		 * volDiscountList_NFCA302.add(NFCA302_vd3);
		 * volDiscountList_NFCA302.add(NFCA302_vd4);
		 * volDiscountList_NFCA302.add(NFCA302_vd5);
		 */

		return null;
	}

	private static String getCDFMaster() {
		String cdf = "[{\"d430_aco\":\"\",\"d430_actn_cd\":\"\",\"d430_actn_dt\":\"\",\"d430_adrs1\":\"\",\"d430_adrs2\":\"\",\"d430_adrs3\":\"\",\"d430_adrs4\":\"\",\"d430_bm_cd\":\"\",\"d430_bm_cd_alt\":\"\",\"d430_bm_dval_lmt\":\"0\",\"d430_bm_name\":\"\",\"d430_bm_phone_no\":\"\",\"d430_email_adrs\":\"\",\"d430_fax_phone_no\":\"\",\"d430_long_desc\":\"\",\"d430_note_cd\":\"26\",\"d430_note1\":\"-\",\"d430_note2\":\"-\",\"d430_office\":\"\",\"d430_pac_fac\":\"\",\"d430_rec_type\":\"N\",\"d430_rpt_off\":\"V\",\"d430_sdf\":\"\",\"d430_st\":\"\"},"
				+ "{\"d430_aco\":\"\",\"d430_actn_cd\":\"\",\"d430_actn_dt\":\"\",\"d430_adrs1\":\"\",\"d430_adrs2\":\"\",\"d430_adrs3\":\"\",\"d430_adrs4\":\"\",\"d430_bm_cd\":\"\",\"d430_bm_cd_alt\":\"\",\"d430_bm_dval_lmt\":\"0\",\"d430_bm_name\":\"\",\"d430_bm_phone_no\":\"\",\"d430_email_adrs\":\"\",\"d430_fax_phone_no\":\"\",\"d430_long_desc\":\"\",\"d430_note_cd\":\"26\",\"d430_note1\":\"-\",\"d430_note2\":\"-\",\"d430_office\":\"\",\"d430_pac_fac\":\"\",\"d430_rec_type\":\"N\",\"d430_rpt_off\":\"U\",\"d430_sdf\":\"\",\"d430_st\":\"\"},"
				+ "{\"d430_aco\":\"\",\"d430_actn_cd\":\"\",\"d430_actn_dt\":\"\",\"d430_adrs1\":\"\",\"d430_adrs2\":\"\",\"d430_adrs3\":\"\",\"d430_adrs4\":\"\",\"d430_bm_cd\":\"\",\"d430_bm_cd_alt\":\"\",\"d430_bm_dval_lmt\":\"0\",\"d430_bm_name\":\"\",\"d430_bm_phone_no\":\"\",\"d430_email_adrs\":\"\",\"d430_fax_phone_no\":\"\",\"d430_long_desc\":\"\",\"d430_note_cd\":\"26\",\"d430_note1\":\"-\",\"d430_note2\":\"-\",\"d430_office\":\"\",\"d430_pac_fac\":\"\",\"d430_rec_type\":\"N\",\"d430_rpt_off\":\"O\",\"d430_sdf\":\"\",\"d430_st\":\"\"},"
				+ "{\"d430_aco\":\"\",\"d430_actn_cd\":\"\",\"d430_actn_dt\":\"\",\"d430_adrs1\":\"\",\"d430_adrs2\":\"\",\"d430_adrs3\":\"\",\"d430_adrs4\":\"\",\"d430_bm_cd\":\"\",\"d430_bm_cd_alt\":\"\",\"d430_bm_dval_lmt\":\"0\",\"d430_bm_name\":\"\",\"d430_bm_phone_no\":\"\",\"d430_email_adrs\":\"\",\"d430_fax_phone_no\":\"\",\"d430_long_desc\":\"\",\"d430_note_cd\":\"26\",\"d430_note1\":\"RETURN NOTICE OF SHIPMENT ATTACHED TO\",\"d430_note2\":\"PO WHEN SHIPMENT IS COMPLETED.\",\"d430_office\":\"\",\"d430_pac_fac\":\"\",\"d430_rec_type\":\"N\",\"d430_rpt_off\":\"G\",\"d430_sdf\":\"\",\"d430_st\":\"\"},"
				+ "{\"d430_aco\":\"\",\"d430_actn_cd\":\"\",\"d430_actn_dt\":\"\",\"d430_adrs1\":\"\",\"d430_adrs2\":\"\",\"d430_adrs3\":\"\",\"d430_adrs4\":\"\",\"d430_bm_cd\":\"\",\"d430_bm_cd_alt\":\"\",\"d430_bm_dval_lmt\":\"0\",\"d430_bm_name\":\"\",\"d430_bm_phone_no\":\"\",\"d430_email_adrs\":\"\",\"d430_fax_phone_no\":\"\",\"d430_long_desc\":\"\",\"d430_note_cd\":\"26\",\"d430_note1\":\"-\",\"d430_note2\":\"\",\"d430_office\":\"\",\"d430_pac_fac\":\"\",\"d430_rec_type\":\"N\",\"d430_rpt_off\":\"A\",\"d430_sdf\":\"\",\"d430_st\":\"\"},"
				+ "{\"d430_aco\":\"\",\"d430_actn_cd\":\"C\",\"d430_actn_dt\":\"95045\",\"d430_adrs1\":\"\",\"d430_adrs2\":\"\",\"d430_adrs3\":\"\",\"d430_adrs4\":\"\",\"d430_bm_cd\":\"\",\"d430_bm_cd_alt\":\"\",\"d430_bm_dval_lmt\":\"0\",\"d430_bm_name\":\"\",\"d430_bm_phone_no\":\"\",\"d430_email_adrs\":\"\",\"d430_fax_phone_no\":\"\",\"d430_long_desc\":\"\",\"d430_note_cd\":\"26\",\"d430_note1\":\"$3.00 SURCHARGE ON ORDERS UNDER $100\",\"d430_note2\":\"\",\"d430_office\":\"\",\"d430_pac_fac\":\"\",\"d430_rec_type\":\"N\",\"d430_rpt_off\":\"E\",\"d430_sdf\":\"\",\"d430_st\":\"\"},"
				+ "{\"d430_aco\":\"\",\"d430_actn_cd\":\"C\",\"d430_actn_dt\":\"11241\",\"d430_adrs1\":\"\",\"d430_adrs2\":\"\",\"d430_adrs3\":\"\",\"d430_adrs4\":\"\",\"d430_bm_cd\":\"\",\"d430_bm_cd_alt\":\"\",\"d430_bm_dval_lmt\":\"0\",\"d430_bm_name\":\"\",\"d430_bm_phone_no\":\"\",\"d430_email_adrs\":\"\",\"d430_fax_phone_no\":\"\",\"d430_long_desc\":\"\",\"d430_note_cd\":\"26\",\"d430_note1\":\"MARKING IAW MIL-STD 129 IS REQUIRED.\",\"d430_note2\":\"\",\"d430_office\":\"\",\"d430_pac_fac\":\"\",\"d430_rec_type\":\"N\",\"d430_rpt_off\":\"M\",\"d430_sdf\":\"\",\"d430_st\":\"\"}]";
		return cdf;
	}
	
	private static String getEdiFaxTable() {
		String edifax = "{\"d411_efpt_ind\" : \"E\",\"d411_fax1\" : \"703-658-2001\",\"d411_cont_no\" : \"NFKA271\",\"d411_cecs\" : \"080970255\",\"d411_x12_version\" : \"3040\"}";
		

		return edifax;
	}
	
	private static String getMQCIDData() {
		String mqcid = "{\"full_name\" : \"Aretha J Clayton\",\"phone\" : \"3128868879\",\"gen_email\" : \"aretha.clayton@gsa.gov\"}";
		

		return mqcid;
	}
	
	private static void invokeLambda() {

		try {

			String url = "https://vpce-088a5795f16dd4c2c-dnbntft7.execute-api.us-east-1.vpce.amazonaws.com/dev/entityManagement/v1/details/00012403C";

			HttpGet getReq = new HttpGet(url);

			Header header = new BasicHeader(HttpHeaders.CONTENT_TYPE, "application/json");
			Header header2 = new BasicHeader("x-apigw-api-id", "xehygqufuk");
			
			List<Header> headers = Arrays.asList(header,header2);
			HttpClient client = HttpClients.custom().setDefaultHeaders(headers).build();
			HttpResponse response = client.execute(getReq);

			if (response.getStatusLine().getStatusCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + response.getStatusLine().getStatusCode());
			}

			BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));

			StringBuffer outputBuff = new StringBuffer();
			String output;
			System.out.println("Output from Server .... \n");
			while ((output = br.readLine()) != null) {
				System.out.println(output);
				outputBuff.append(output);

			}
			Address adress = new Gson().fromJson(outputBuff.toString(), Address.class);
			//System.out.println(adress.getD410_adrs1());

			client.getConnectionManager().shutdown();

		} catch (MalformedURLException e) {

			e.printStackTrace();

		} catch (IOException e) {

			e.printStackTrace();

		}
	}

	
}
