package com.gsa;

import java.util.function.Function;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MainApp {

	public static void main(String[] args) {
		SpringApplication.run(MainApp.class, args);
	}

	@Bean
	public Function<String, String> getContracts() {
		return contractId -> {
			return "Sucess";
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