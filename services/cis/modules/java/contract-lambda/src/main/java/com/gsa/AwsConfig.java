package com.gsa;

import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;

public class AwsConfig {


	public AmazonDynamoDB amazonDynamoDb() {
		return AmazonDynamoDBClientBuilder.standard()
//				.withEndpointConfiguration(new EndpointConfiguration("http://localhost:8000", "us-east-1"))
				.build();
	}

	public DynamoDB dynamoDB(AmazonDynamoDB dynamoDb) {
		return new DynamoDB(dynamoDb);
	}
}
