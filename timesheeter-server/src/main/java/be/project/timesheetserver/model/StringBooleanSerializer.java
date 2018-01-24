package be.project.timesheetserver.model;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

/**
 * Created by kevgo on 25-01-18.
 */
public class StringBooleanSerializer extends JsonSerializer<Boolean> {
    @Override
    public void serialize(Boolean bool, JsonGenerator generator, SerializerProvider provider) throws IOException, JsonProcessingException {
        generator.writeString(bool ? "true" : "false");
    }
}
