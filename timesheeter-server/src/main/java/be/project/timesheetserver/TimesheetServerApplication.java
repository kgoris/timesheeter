package be.project.timesheetserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("be.project.timesheetserver")
public class TimesheetServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TimesheetServerApplication.class, args);
	}
}
