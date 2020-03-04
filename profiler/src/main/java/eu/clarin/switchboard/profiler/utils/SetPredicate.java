package eu.clarin.switchboard.profiler.utils;

import com.google.common.base.MoreObjects;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.function.Predicate;


/**
 * Utility class for testing if a given value "matches" a set of preinserted values.
 * It can also match any value whatsoever.
 */
public class SetPredicate<K> implements Predicate<K> {
    private Set<K> values = new HashSet<>();

    public static <K> Builder<K> builder() {
        return new Builder<>();
    }

    public boolean test(K value) {
        return values == null || values.contains(value);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SetPredicate<?> that = (SetPredicate<?>) o;
        return Objects.equals(values, that.values);
    }

    @Override
    public int hashCode() {
        return Objects.hash(values);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this).add("values", values).toString();
    }

    private SetPredicate(Set<K> values) {
        this.values = values;
    }

    public static class Builder<K> {
        private Set<K> values = new HashSet<>();

        public void acceptAnyValue() {
            values = null;
        }

        public void acceptValue(K value) {
            if (values != null) {
                values.add(value);
            }
        }

        public SetPredicate<K> build() {
            return new SetPredicate<>(values);
        }
    }
}
