import { Feather, Ionicons } from "@expo/vector-icons";
import { allCountries } from "country-telephone-data";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Country flag emoji mapping
const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const PhoneVerificationScreen = ({
  setMode,
}: {
  setMode: (mode: "signup" | "signin" | "phone" | "verify") => void;
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    allCountries.find((c) => c.iso2 === "rw") || allCountries[0],
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isPhoneValid = phoneNumber.length === 9;

  const filteredCountries = allCountries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery),
  );

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setMode("signup")}
      >
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>

      <Text style={styles.title}>Your phone!</Text>
      <Text style={styles.subtitle}>
        A 4-digit security code will be sent via SMS to verify your mobile
        number!
      </Text>

      {/* Phone input with country code */}
      <View style={styles.phoneInputContainer}>
        <TouchableOpacity
          style={styles.countryCodeBtn}
          onPress={() => setShowCountryPicker(true)}
        >
          <Text style={styles.flagEmoji}>
            {getCountryFlag(selectedCountry.iso2)}
          </Text>
          <Text style={styles.countryCodeText}>
            +{selectedCountry.dialCode}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#999" />
        </TouchableOpacity>

        <View style={styles.phoneInputWrapper}>
          <TextInput
            placeholder="Enter number"
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          {phoneNumber.length > 0 &&
            (phoneNumber.length === 9 ? (
              <Ionicons name="checkmark-circle" size={24} color="#6c5ce7" />
            ) : (
              <Ionicons name="close-circle" size={24} color="#ff6b6b" />
            ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.signInBtn}
        onPress={() => isPhoneValid && setMode("verify")}
        disabled={!isPhoneValid}
      >
        <Text style={styles.signInText}>Continue</Text>
      </TouchableOpacity>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Ionicons name="close" size={24} color="#111" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Feather name="search" size={18} color="#999" />
              <TextInput
                placeholder="Search country..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.iso2}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryPicker(false);
                    setSearchQuery("");
                  }}
                >
                  <Text style={styles.countryFlag}>
                    {getCountryFlag(item.iso2)}
                  </Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryDialCode}>+{item.dialCode}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    color: "#aaa",
    marginBottom: 30,
  },
  phoneInputContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  countryCodeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 10,
    minWidth: 100,
  },
  flagEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: "#111",
    marginRight: 4,
  },
  phoneInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 14,
    paddingRight: 12,
    borderRadius: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
  signInBtn: {
    backgroundColor: "#6c5ce7",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#111",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },
  countryDialCode: {
    fontSize: 16,
    color: "#6c5ce7",
    fontWeight: "600",
  },
});
