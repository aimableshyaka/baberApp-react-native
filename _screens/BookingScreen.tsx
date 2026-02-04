import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  DatePickerIOS,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Booking, createBooking } from "../_api/booking";
import { Salon, Service } from "../_api/salon";

interface BookingScreenProps {
  salon: Salon;
  service: Service;
  onClose: () => void;
  onBookingSuccess?: (booking: Booking) => void;
}

const BookingScreen: React.FC<BookingScreenProps> = ({
  salon,
  service,
  onClose,
  onBookingSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate time slots (every 30 minutes)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${String(hour).padStart(2, "0")}:${String(
          minute,
        ).padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleDateChange = () => {
    // Show date picker on both platforms using inline picker
    setShowDatePicker(!showDatePicker);
  };

  const handleIOSDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Generate date options for manual selection (next 30 days)
  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleBooking = async () => {
    try {
      // Validate
      if (!selectedDate || !selectedTime) {
        Alert.alert("Error", "Please select a date and time");
        return;
      }

      // Check if date is in the future
      const now = new Date();
      if (selectedDate < now) {
        Alert.alert("Error", "Please select a future date");
        return;
      }

      setLoading(true);

      const bookingData = {
        salonId: salon._id || salon.id || "",
        serviceId: service._id || service.id || "",
        bookingDate: formatDate(selectedDate),
        startTime: selectedTime,
        notes: notes || undefined,
      };

      console.log("🔄 Creating booking:", bookingData);

      const booking = await createBooking(bookingData);

      Alert.alert(
        "Success",
        "Booking created successfully!\nAwaiting salon owner approval.",
        [
          {
            text: "OK",
            onPress: () => {
              onBookingSuccess?.(booking);
              onClose();
            },
          },
        ],
      );
    } catch (error: any) {
      console.error("❌ Booking error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to create booking";
      Alert.alert("Booking Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const endTime = calculateEndTime(selectedTime, service.duration || 30);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Service Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Service</Text>
        <Text style={styles.serviceName}>
          {service.name || service.serviceName}
        </Text>
        <Text style={styles.serviceDesc}>{service.description}</Text>
        <View style={styles.serviceDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{service.duration || 30} min</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>${service.price || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Salon Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Salon</Text>
        <Text style={styles.salonName}>{salon.name || salon.salonName}</Text>
        <View style={styles.contactRow}>
          <Ionicons name="location-outline" size={16} color="#6c5ce7" />
          <Text style={styles.contactText}>
            {salon.address || salon.location}
          </Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="call-outline" size={16} color="#6c5ce7" />
          <Text style={styles.contactText}>{salon.phone}</Text>
        </View>
      </View>

      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={handleDateChange}>
          <Ionicons name="calendar-outline" size={20} color="#6c5ce7" />
          <Text style={styles.dateButtonText}>
            {selectedDate.toDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            {Platform.OS === "ios" ? (
              <>
                <DatePickerIOS
                  value={selectedDate}
                  mode="date"
                  onDateChange={handleIOSDateChange}
                  minimumDate={new Date()}
                />
                <TouchableOpacity
                  style={styles.datePickerDoneButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.datePickerDoneText}>Done</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.dateGridContainer}>
                  <Text style={styles.dateGridTitle}>Pick a date</Text>
                  <View style={styles.dateGrid}>
                    {dateOptions.map((date, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dateGridItem,
                          selectedDate.toDateString() === date.toDateString() &&
                            styles.dateGridItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedDate(date);
                          setShowDatePicker(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dateGridText,
                            selectedDate.toDateString() ===
                              date.toDateString() &&
                              styles.dateGridTextSelected,
                          ]}
                        >
                          {date.getDate()}
                        </Text>
                        <Text
                          style={[
                            styles.dateGridMonth,
                            selectedDate.toDateString() ===
                              date.toDateString() &&
                              styles.dateGridMonthSelected,
                          ]}
                        >
                          {date.toLocaleDateString("en-US", { month: "short" })}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.datePickerDoneButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.datePickerDoneText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>

      {/* Time Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                selectedTime === time && styles.timeSlotSelected,
              ]}
              onPress={() => handleTimeSelect(time)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  selectedTime === time && styles.timeSlotTextSelected,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Time Summary */}
      <View style={styles.timeSummary}>
        <View style={styles.timeSummaryItem}>
          <Text style={styles.timeSummaryLabel}>Start Time</Text>
          <Text style={styles.timeSummaryValue}>{selectedTime}</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color="#999" />
        <View style={styles.timeSummaryItem}>
          <Text style={styles.timeSummaryLabel}>End Time</Text>
          <Text style={styles.timeSummaryValue}>{endTime}</Text>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="e.g., Please use beard oil, short fade haircut..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Booking Summary */}
      <View style={styles.bookingSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service</Text>
          <Text style={styles.summaryValue}>${service.price || "N/A"}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          <Text style={styles.summaryTotalValue}>
            ${service.price || "N/A"}
          </Text>
        </View>
        <Text style={styles.summaryNote}>
          Payment will be collected at the salon
        </Text>
      </View>

      {/* Booking Button */}
      <TouchableOpacity
        style={styles.bookingButton}
        onPress={handleBooking}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.bookingButtonText}>Confirm Booking</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

// Helper function to calculate end time
const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
    2,
    "0",
  )}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  closeBtn: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  summaryCard: {
    backgroundColor: "#fff",
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },

  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },

  serviceDesc: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },

  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6c5ce7",
  },

  salonName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  contactText: {
    fontSize: 13,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },

  section: {
    backgroundColor: "#fff",
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
  },

  dateButtonText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    fontWeight: "500",
  },

  datePickerContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },

  dateGridContainer: {
    padding: 16,
  },

  dateGridTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
    textAlign: "center",
  },

  dateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  dateGridItem: {
    width: "22%",
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  dateGridItemSelected: {
    backgroundColor: "#6c5ce7",
    borderColor: "#6c5ce7",
  },

  dateGridText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  dateGridTextSelected: {
    color: "#fff",
  },

  dateGridMonth: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },

  dateGridMonthSelected: {
    color: "#fff",
  },

  iosDatePickerContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },

  datePickerDoneButton: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  datePickerDoneText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  timeSlot: {
    width: "23%",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },

  timeSlotSelected: {
    backgroundColor: "#6c5ce7",
    borderColor: "#6c5ce7",
  },

  timeSlotText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },

  timeSlotTextSelected: {
    color: "#fff",
  },

  timeSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 10,
  },

  timeSummaryItem: {
    flex: 1,
  },

  timeSummaryLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },

  timeSummaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  noteInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#333",
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
  },

  bookingSummary: {
    backgroundColor: "#fff",
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#666",
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },

  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  summaryTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6c5ce7",
  },

  summaryNote: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    fontStyle: "italic",
  },

  bookingButton: {
    backgroundColor: "#6c5ce7",
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  bookingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default BookingScreen;
