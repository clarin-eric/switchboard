package eu.clarin.switchboard.app.config;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import static eu.clarin.switchboard.app.config.DataStoreConfig.convertStringWithMultiplicatorToLong;

public class DataStoreConfigTest {
    @Test
    public void testConvertStringWithMultiplicatorToLong() {
        Assertions.assertEquals(0, convertStringWithMultiplicatorToLong("0"));
        Assertions.assertEquals(1, convertStringWithMultiplicatorToLong("1"));
        Assertions.assertEquals(1000, convertStringWithMultiplicatorToLong("1000"));
        Assertions.assertEquals(999999, convertStringWithMultiplicatorToLong("999999"));
        Assertions.assertEquals(999999999999L, convertStringWithMultiplicatorToLong("999999999999"));
        Assertions.assertEquals(1234 * 1024, convertStringWithMultiplicatorToLong("1234k"));
        Assertions.assertEquals(1234 * 1024, convertStringWithMultiplicatorToLong("1234K"));
        Assertions.assertEquals(1234 * 1024 * 1024, convertStringWithMultiplicatorToLong("1234m"));
        Assertions.assertEquals(1234 * 1024 * 1024, convertStringWithMultiplicatorToLong("1234M"));
        Assertions.assertEquals(1234 * 1024 * 1024 * 1024L, convertStringWithMultiplicatorToLong("1234g"));
        Assertions.assertEquals(1234 * 1024 * 1024 * 1024L, convertStringWithMultiplicatorToLong("1234G"));
    }

    @Test
    public void testBadNumber() {
        Assertions.assertThrows(NumberFormatException.class, () -> {
            convertStringWithMultiplicatorToLong("23asdf");
        });
    }
}
