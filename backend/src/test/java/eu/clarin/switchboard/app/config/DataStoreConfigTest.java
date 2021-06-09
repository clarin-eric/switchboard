package eu.clarin.switchboard.app.config;

import org.junit.Assert;
import org.junit.Test;

import static eu.clarin.switchboard.app.config.DataStoreConfig.convertStringWithMultiplicatorToLong;

public class DataStoreConfigTest {
    @Test
    public void testConvertStringWithMultiplicatorToLong() {
        Assert.assertEquals(0, convertStringWithMultiplicatorToLong("0"));
        Assert.assertEquals(1, convertStringWithMultiplicatorToLong("1"));
        Assert.assertEquals(1000, convertStringWithMultiplicatorToLong("1000"));
        Assert.assertEquals(999999, convertStringWithMultiplicatorToLong("999999"));
        Assert.assertEquals(999999999999L, convertStringWithMultiplicatorToLong("999999999999"));
        Assert.assertEquals(1234 * 1024, convertStringWithMultiplicatorToLong("1234k"));
        Assert.assertEquals(1234 * 1024, convertStringWithMultiplicatorToLong("1234K"));
        Assert.assertEquals(1234 * 1024 * 1024, convertStringWithMultiplicatorToLong("1234m"));
        Assert.assertEquals(1234 * 1024 * 1024, convertStringWithMultiplicatorToLong("1234M"));
        Assert.assertEquals(1234 * 1024 * 1024 * 1024L, convertStringWithMultiplicatorToLong("1234g"));
        Assert.assertEquals(1234 * 1024 * 1024 * 1024L, convertStringWithMultiplicatorToLong("1234G"));
    }

    @Test(expected = NumberFormatException.class)
    public void testBadNumber() {
        convertStringWithMultiplicatorToLong("23asdf");
        Assert.fail(); // will not get here
    }
}
