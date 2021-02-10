package com.gsa;

import java.util.function.Function;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;

@SpringBootApplication
public class MainApp {

	public static void main(String[] args) {
		SpringApplication.run(MainApp.class, args);
	}

	@Bean
	public Function<String, String> getContracts() {
		return contractId -> {
			DynamoDB client = new AwsConfig().dynamoDB(new AwsConfig().amazonDynamoDb());
			Table table = client.getTable("contract-qa");

			GetItemSpec spec = new GetItemSpec().withPrimaryKey("contractId", "1234", "sk", "detail");

			Item item = table.getItem(spec);
			return item.toJSONPretty();
		};
	}

	@Bean
	public Function<String, String> getContractDetailsByEntityId() {
		return contractId -> {
			return "Sucess";
		};
	}

	@Bean
	public Function<String, String> getContractDetailsByContractId() {
		return contractId -> {
			return "Sucess";
		};
	}

}