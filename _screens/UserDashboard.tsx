import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Booking,
  cancelBooking,
  getCustomerBookings,
  rescheduleBooking,
} from "../_api/booking";
import {
  getAllSalons,
  getSalonServices,
  getSalonWorkingHours,
  Salon,
  Service,
  WorkingHours,
} from "../_api/salon";
import { useAuth } from "../_context/AuthContext";
import BookingScreen from "./BookingScreen";
import MapScreen from "./MapScreen";

const HomeScreen = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState("home");
  const [showLocationModal, setShowLocationModal] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("All");
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [salons, setSalons] = React.useState<Salon[]>([]);
  const [loadingSalons, setLoadingSalons] = React.useState(false);

  // Salon detail modal states
  const [selectedSalon, setSelectedSalon] = React.useState<Salon | null>(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [salonServices, setSalonServices] = React.useState<Service[]>([]);
  const [salonWorkingHours, setSalonWorkingHours] =
    React.useState<WorkingHours>({});
  const [loadingDetails, setLoadingDetails] = React.useState(false);

  // Booking modal states
  const [showBookingModal, setShowBookingModal] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<Service | null>(
    null,
  );

  // Bookings management states
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = React.useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(
    null,
  );
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("");

  // Fetch salons and bookings on component mount
  useEffect(() => {
    fetchSalons();
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchSalons = async () => {
    try {
      setLoadingSalons(true);
      const data = await getAllSalons();
      setSalons(data);
      console.log("✅ Salons loaded:", data.length);
    } catch (error) {
      console.error("❌ Failed to fetch salons:", error);
    } finally {
      setLoadingSalons(false);
    }
  };

  const openSalonDetail = async (salon: Salon) => {
    try {
      setSelectedSalon(salon);
      setShowDetailModal(true);
      setLoadingDetails(true);

      const salonId = salon._id || salon.id;
      if (!salonId) {
        console.error("❌ No salon ID available");
        return;
      }

      // Fetch services and working hours in parallel
      const [services, workingHours] = await Promise.all([
        getSalonServices(salonId),
        getSalonWorkingHours(salonId),
      ]);

      setSalonServices(services);
      setSalonWorkingHours(workingHours);
      console.log("✅ Salon details loaded");
    } catch (error) {
      console.error("❌ Error loading salon details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setShowBookingModal(true);
    setShowDetailModal(false);
  };

  const handleBookingSuccess = (booking: Booking) => {
    console.log("✅ Booking successful:", booking);
    setShowBookingModal(false);
    setShowDetailModal(false);
    // Refresh bookings if on bookings tab
    if (activeTab === "bookings") {
      fetchBookings();
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const data = await getCustomerBookings();
      setBookings(data);
      console.log("✅ Bookings loaded:", data.length);
    } catch (error) {
      console.error("❌ Failed to fetch bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancelBooking = (booking: Booking) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const bookingId = booking._id || booking.id;
              if (!bookingId) return;

              await cancelBooking(bookingId);
              Alert.alert("Success", "Booking cancelled successfully");
              fetchBookings();
            } catch (error) {
              Alert.alert("Error", "Failed to cancel booking");
            }
          },
        },
      ],
    );
  };

  const handleRescheduleBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewDate(booking.bookingDate || "");
    setNewTime(booking.startTime || "");
    setShowRescheduleModal(true);
  };

  const submitReschedule = async () => {
    try {
      if (!selectedBooking || !newDate || !newTime) {
        Alert.alert("Error", "Please select a date and time");
        return;
      }

      const bookingId = selectedBooking._id || selectedBooking.id;
      if (!bookingId) return;

      await rescheduleBooking(bookingId, {
        newBookingDate: newDate,
        newStartTime: newTime,
      });

      Alert.alert("Success", "Booking rescheduled successfully");
      setShowRescheduleModal(false);
      fetchBookings();
    } catch (error) {
      Alert.alert("Error", "Failed to reschedule booking");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "cancelled":
        return "#ef4444";
      case "completed":
        return "#6c5ce7";
      default:
        return "#999";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "checkmark-circle";
      case "pending":
        return "time";
      case "cancelled":
        return "close-circle";
      case "completed":
        return "checkmark-done-circle";
      default:
        return "help-circle";
    }
  };

  return (
    <View style={styles.screen}>
      {activeTab === "location" ? (
        <MapScreen onBack={() => setActiveTab("home")} />
      ) : activeTab === "bookings" ? (
        <ScrollView style={styles.bookingsContainer}>
          <View style={styles.bookingsHeader}>
            <Text style={styles.bookingsTitle}>My Bookings</Text>
            <TouchableOpacity onPress={fetchBookings}>
              <Ionicons name="refresh-outline" size={24} color="#6c5ce7" />
            </TouchableOpacity>
          </View>

          {loadingBookings ? (
            <ActivityIndicator
              size="large"
              color="#6c5ce7"
              style={{ marginTop: 40 }}
            />
          ) : bookings.length === 0 ? (
            <View style={styles.emptyBookings}>
              <Ionicons name="calendar-outline" size={64} color="#ddd" />
              <Text style={styles.emptyBookingsText}>
                No bookings yet. Book your first appointment!
              </Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => setActiveTab("home")}
              >
                <Text style={styles.browseBtnText}>Browse Salons</Text>
              </TouchableOpacity>
            </View>
          ) : (
            bookings.map((booking, index) => {
              const bookingId = booking._id || booking.id || index;
              const status = booking.status || "pending";
              const canModify = ["pending", "confirmed"].includes(
                status.toLowerCase(),
              );

              return (
                <View key={bookingId} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(status) + "20" },
                      ]}
                    >
                      <Ionicons
                        name={getStatusIcon(status) as any}
                        size={16}
                        color={getStatusColor(status)}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(status) },
                        ]}
                      >
                        {status}
                      </Text>
                    </View>
                    <Text style={styles.bookingId}>
                      #{String(bookingId).slice(-6).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.bookingBody}>
                    <View style={styles.bookingRow}>
                      <Ionicons name="storefront" size={18} color="#666" />
                      <Text style={styles.bookingLabel}>Salon:</Text>
                      <Text style={styles.bookingValue}>
                        {typeof booking.salonId === "object"
                          ? (booking.salonId as any)?.name ||
                            (booking.salonId as any)?.salonName ||
                            "N/A"
                          : booking.salon?.name ||
                            booking.salon?.salonName ||
                            "N/A"}
                      </Text>
                    </View>

                    <View style={styles.bookingRow}>
                      <Ionicons name="cut" size={18} color="#666" />
                      <Text style={styles.bookingLabel}>Service:</Text>
                      <Text style={styles.bookingValue}>
                        {typeof booking.serviceId === "object"
                          ? (booking.serviceId as any)?.name ||
                            (booking.serviceId as any)?.serviceName ||
                            "N/A"
                          : booking.service?.name ||
                            booking.service?.serviceName ||
                            "N/A"}
                      </Text>
                    </View>

                    <View style={styles.bookingRow}>
                      <Ionicons name="calendar" size={18} color="#666" />
                      <Text style={styles.bookingLabel}>Date:</Text>
                      <Text style={styles.bookingValue}>
                        {booking.bookingDate || "N/A"}
                      </Text>
                    </View>

                    <View style={styles.bookingRow}>
                      <Ionicons name="time" size={18} color="#666" />
                      <Text style={styles.bookingLabel}>Time:</Text>
                      <Text style={styles.bookingValue}>
                        {booking.startTime || "N/A"}
                      </Text>
                    </View>

                    {(booking as any).totalPrice && (
                      <View style={styles.bookingRow}>
                        <Ionicons name="cash" size={18} color="#666" />
                        <Text style={styles.bookingLabel}>Price:</Text>
                        <Text style={styles.bookingPrice}>
                          ${(booking as any).totalPrice}
                        </Text>
                      </View>
                    )}

                    {booking.notes && (
                      <View style={styles.notesSection}>
                        <Ionicons name="document-text" size={18} color="#666" />
                        <Text style={styles.notesText}>{booking.notes}</Text>
                      </View>
                    )}
                  </View>

                  {canModify && (
                    <View style={styles.bookingActions}>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.rescheduleBtn]}
                        onPress={() => handleRescheduleBooking(booking)}
                      >
                        <Ionicons name="calendar" size={18} color="#6c5ce7" />
                        <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, styles.cancelBtn]}
                        onPress={() => handleCancelBooking(booking)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={18}
                          color="#ef4444"
                        />
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.profileRow}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/100" }}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.greeting}>Hi, {user?.firstname}</Text>
                  <Text style={styles.location}>
                    <Ionicons name="location-outline" size={12} /> 6391 Elgin
                    St, Celina, Delaware
                  </Text>
                </View>
              </View>

              <View style={styles.headerIcons}>
                <Ionicons name="notifications-outline" size={22} />
                <Ionicons
                  name="heart-outline"
                  size={22}
                  style={{ marginLeft: 16 }}
                />
              </View>
            </View>

            {/* Search */}
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#999" />
              <TextInput
                placeholder="Search by Salons"
                placeholderTextColor="#aaa"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setShowSearchResults(text.length > 0);
                }}
              />
              <TouchableOpacity onPress={() => setShowSearchResults(true)}>
                <Ionicons name="options-outline" size={18} color="#999" />
              </TouchableOpacity>
            </View>

            {!showSearchResults ? (
              <>
                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((item, i) => (
                    <View key={i} style={styles.category}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.catImage}
                      />
                      <Text style={styles.catText}>{item.title}</Text>
                    </View>
                  ))}
                </ScrollView>

                {/* Promo Card */}
                <View style={styles.promoCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.discount}>-40%</Text>
                    <Text style={styles.promoText}>
                      Voucher for your next haircut service
                    </Text>
                    <TouchableOpacity style={styles.bookBtn}>
                      <Text style={styles.bookText}>Book now</Text>
                    </TouchableOpacity>
                  </View>

                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143",
                    }}
                    style={styles.promoImage}
                  />
                </View>

                {/* Nearest Salon */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Nearest salon</Text>
                  <Text style={styles.viewAll}>View All</Text>
                </View>

                {loadingSalons ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6c5ce7" />
                    <Text style={styles.loadingText}>Loading salons...</Text>
                  </View>
                ) : salons.length > 0 ? (
                  salons.map((salon, index) => (
                    <TouchableOpacity
                      key={salon._id || salon.id || index}
                      style={styles.salonCard}
                      onPress={() => openSalonDetail(salon)}
                    >
                      <Image
                        source={{
                          uri:
                            salon.image ||
                            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
                        }}
                        style={styles.salonImage}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.salonName}>
                          {salon.name || salon.salonName || "Salon Name"}
                        </Text>
                        <Text style={styles.salonAddr}>
                          {salon.address ||
                            salon.location ||
                            "Address not available"}
                        </Text>

                        <View style={styles.salonFooter}>
                          <View style={styles.salonInfo}>
                            <Text style={styles.rating}>
                              ⭐ {salon.rating || 4.5}
                            </Text>
                            <Text style={styles.distance}>
                              {salon.distance || "5"} km
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.salonBookBtn}
                            onPress={(e) => {
                              e.stopPropagation?.();
                              openSalonDetail(salon);
                            }}
                          >
                            <Text style={styles.salonBookBtnText}>Details</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noSalonsText}>No salons available</Text>
                )}
              </>
            ) : (
              <>
                {/* Filter Tabs */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.filterTabsContainer}
                >
                  {filterOptions.map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      style={[
                        styles.filterTab,
                        selectedFilter === filter && styles.filterTabActive,
                      ]}
                      onPress={() => setSelectedFilter(filter)}
                    >
                      <Text
                        style={[
                          styles.filterTabText,
                          selectedFilter === filter &&
                            styles.filterTabTextActive,
                        ]}
                      >
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Popular Artists */}
                <View style={styles.artistsSection}>
                  <Text style={styles.sectionTitle}>Popular artist</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {artists.map((artist, i) => (
                      <TouchableOpacity key={i} style={styles.artistItem}>
                        <Image
                          source={{ uri: artist.image }}
                          style={styles.artistImage}
                        />
                        <Text style={styles.artistName}>{artist.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Search Results */}
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsCount}>
                    Result found({salons.length})
                  </Text>
                </View>

                {salons.map((salon, i) => (
                  <View key={i} style={styles.salonResultCard}>
                    <Image
                      source={{
                        uri:
                          salon.image ||
                          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
                      }}
                      style={styles.resultSalonImage}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultSalonName}>
                        {salon.name || salon.salonName || "Salon Name"}
                      </Text>
                      <Text style={styles.resultSalonAddr}>
                        {salon.address ||
                          salon.location ||
                          "Address not available"}
                      </Text>
                      <View style={styles.resultSalonFooter}>
                        <Text style={styles.resultRating}>
                          ⭐ {salon.rating || 4.5}
                        </Text>
                        <Text style={styles.resultDistance}>
                          📍 {salon.distance || 5} km
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.bookBtnResult}>
                      <Text style={styles.bookBtnResultText}>Book</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
        </>
      )}

      {/* Location Permission Modal */}
      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={50} color="#fff" />
            </View>

            <Text style={styles.modalTitle}>Enable Location</Text>

            <Text style={styles.modalDescription}>
              We need to know your location in order to suggest nearby services.
            </Text>

            <TouchableOpacity
              style={styles.enableBtn}
              onPress={() => setShowLocationModal(false)}
            >
              <Text style={styles.enableBtnText}>Enable</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Salon Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
      >
        <View style={styles.detailModalContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeDetailBtn}
            onPress={() => setShowDetailModal(false)}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          {loadingDetails ? (
            <View style={styles.detailLoadingContainer}>
              <ActivityIndicator size="large" color="#6c5ce7" />
              <Text style={styles.detailLoadingText}>
                Loading salon details...
              </Text>
            </View>
          ) : selectedSalon ? (
            <ScrollView style={styles.detailContent}>
              {/* Salon Image */}
              <Image
                source={{
                  uri:
                    selectedSalon.image ||
                    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
                }}
                style={styles.detailImage}
              />

              {/* Salon Info */}
              <View style={styles.detailHeader}>
                <View>
                  <Text style={styles.detailSalonName}>
                    {selectedSalon.name || selectedSalon.salonName}
                  </Text>
                  <Text style={styles.detailAddress}>
                    📍 {selectedSalon.address || selectedSalon.location}
                  </Text>
                </View>
                <View style={styles.detailRating}>
                  <Text style={styles.detailRatingText}>
                    ⭐ {selectedSalon.rating || 4.5}
                  </Text>
                </View>
              </View>

              {/* Contact Info */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Contact</Text>
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={18} color="#6c5ce7" />
                  <Text style={styles.contactText}>{selectedSalon.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="mail-outline" size={18} color="#6c5ce7" />
                  <Text style={styles.contactText}>{selectedSalon.email}</Text>
                </View>
              </View>

              {/* Description */}
              {selectedSalon.description && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>About</Text>
                  <Text style={styles.descriptionText}>
                    {selectedSalon.description}
                  </Text>
                </View>
              )}

              {/* Working Hours */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Working Hours</Text>
                {Object.entries(salonWorkingHours).length > 0 ? (
                  Object.entries(salonWorkingHours).map(([day, hours]) => {
                    // Ensure hours is a string
                    const hoursText =
                      typeof hours === "string"
                        ? hours
                        : hours &&
                            typeof hours === "object" &&
                            hours.openingTime &&
                            hours.closingTime
                          ? `${hours.openingTime} - ${hours.closingTime}`
                          : "Closed";

                    return (
                      <View key={day} style={styles.hoursItem}>
                        <Text style={styles.dayText}>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </Text>
                        <Text style={styles.hoursText}>{hoursText}</Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noDataText}>
                    No working hours available
                  </Text>
                )}
              </View>

              {/* Services */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Services</Text>
                {salonServices.length > 0 ? (
                  salonServices.map((service, index) => (
                    <View key={service._id || index} style={styles.serviceItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.serviceName}>
                          {service.name || service.serviceName}
                        </Text>
                        {service.description && (
                          <Text style={styles.serviceDesc}>
                            {service.description}
                          </Text>
                        )}
                        {service.duration && (
                          <Text style={styles.serviceMeta}>
                            ⏱️ {service.duration} min
                          </Text>
                        )}
                      </View>
                      <Text style={styles.servicePrice}>
                        ${service.price || "N/A"}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No services available</Text>
                )}
              </View>

              {/* Book Button */}
              <TouchableOpacity
                style={styles.bookDetailBtn}
                onPress={() => {
                  if (salonServices.length > 0) {
                    handleBookService(salonServices[0]);
                  }
                }}
              >
                <Text style={styles.bookDetailBtnText}>Book Appointment</Text>
              </TouchableOpacity>

              <View style={{ height: 30 }} />
            </ScrollView>
          ) : null}
        </View>
      </Modal>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
      >
        {selectedSalon && selectedService ? (
          <BookingScreen
            salon={selectedSalon}
            service={selectedService}
            onClose={() => setShowBookingModal(false)}
            onBookingSuccess={handleBookingSuccess}
          />
        ) : null}
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        visible={showRescheduleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRescheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: "50%" }]}>
            <View style={styles.rescheduleHeader}>
              <Text style={styles.rescheduleTitle}>Reschedule Booking</Text>
              <TouchableOpacity onPress={() => setShowRescheduleModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.rescheduleForm}>
              <Text style={styles.inputLabel}>New Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.rescheduleInput}
                value={newDate}
                onChangeText={setNewDate}
                placeholder="2024-12-25"
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>New Time (HH:MM)</Text>
              <TextInput
                style={styles.rescheduleInput}
                value={newTime}
                onChangeText={setNewTime}
                placeholder="14:00"
                placeholderTextColor="#999"
              />

              <TouchableOpacity
                style={styles.rescheduleSubmitBtn}
                onPress={submitReschedule}
              >
                <Text style={styles.rescheduleSubmitText}>
                  Confirm Reschedule
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("home")}
        >
          <Ionicons
            name={activeTab === "home" ? "home" : "home-outline"}
            size={24}
            color={activeTab === "home" ? "#6c5ce7" : "#999"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("location")}
        >
          <Ionicons
            name={activeTab === "location" ? "location" : "location-outline"}
            size={24}
            color={activeTab === "location" ? "#6c5ce7" : "#999"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("bookings")}
        >
          <Ionicons
            name={activeTab === "bookings" ? "calendar" : "calendar-outline"}
            size={24}
            color={activeTab === "bookings" ? "#6c5ce7" : "#999"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("chat")}
        >
          <Ionicons
            name={activeTab === "chat" ? "chatbubble" : "chatbubble-outline"}
            size={24}
            color={activeTab === "chat" ? "#6c5ce7" : "#999"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("profile")}
        >
          <Ionicons
            name={activeTab === "profile" ? "person" : "person-outline"}
            size={24}
            color={activeTab === "profile" ? "#6c5ce7" : "#999"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const categories = [
  {
    title: "Haircuts",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  {
    title: "Make up",
    image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b",
  },
  {
    title: "Manicure",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371",
  },
  {
    title: "Massage",
    image: "https://images.unsplash.com/photo-1519167471411-74f3b77db0d6",
  },
  {
    title: "Facial",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
  },
];

const filterOptions = ["All", "Indian", "Italian", "Savings", "Sort"];

const artists = [
  {
    name: "Lily",
    image: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Lee",
    image: "https://i.pravatar.cc/100?img=2",
  },
  {
    name: "Connor",
    image: "https://i.pravatar.cc/100?img=3",
  },
  {
    name: "Jason",
    image: "https://i.pravatar.cc/100?img=4",
  },
];

const salons = [
  {
    name: "Green Apple",
    address: "6391 Elgin St, Celina, Delaware",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    rating: 4.5,
    distance: 1.5,
  },
  {
    name: "Bella Rinova",
    address: "5421 Inglewood Dr, Englewood, M",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    rating: 4.0,
    distance: 2.5,
  },
  {
    name: "The Galleria",
    address: "1145 Parker Dr, Albertson, New",
    image: "https://images.unsplash.com/photo-1507925921903-88852de7f0a7",
    rating: 3.0,
    distance: 4.8,
  },
  {
    name: "Michael Saldana",
    address: "3159 Brushwood Dr, Richardson, TX",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
    rating: 4.0,
    distance: 8.9,
  },
];

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  greeting: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  location: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
  },

  category: {
    alignItems: "center",
    marginRight: 16,
  },

  catImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 6,
  },

  catText: {
    fontSize: 12,
    color: "#444",
  },

  promoCard: {
    flexDirection: "row",
    backgroundColor: "#f6f1ff",
    borderRadius: 20,
    padding: 16,
    marginVertical: 20,
  },

  discount: {
    fontSize: 26,
    fontWeight: "700",
    color: "#6c5ce7",
  },

  promoText: {
    color: "#555",
    marginVertical: 8,
  },

  bookBtn: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  bookText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  promoImage: {
    width: 110,
    height: 140,
    borderRadius: 18,
    marginLeft: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  viewAll: {
    fontSize: 12,
    color: "#999",
  },

  salonCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 12,
  },

  salonImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginRight: 12,
  },

  salonName: {
    fontSize: 14,
    fontWeight: "600",
  },

  salonAddr: {
    fontSize: 12,
    color: "#999",
    marginVertical: 4,
  },

  salonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  salonInfo: {
    flexDirection: "row",
    gap: 8,
  },

  rating: {
    fontSize: 12,
  },

  distance: {
    fontSize: 12,
    color: "#999",
  },

  salonBookBtn: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  salonBookBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 12,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "80%",
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6c5ce7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },

  modalDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },

  enableBtn: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },

  enableBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  filterTabsContainer: {
    marginBottom: 20,
  },

  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },

  filterTabActive: {
    backgroundColor: "#6c5ce7",
  },

  filterTabText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },

  filterTabTextActive: {
    color: "#fff",
  },

  artistsSection: {
    marginBottom: 20,
  },

  artistItem: {
    alignItems: "center",
    marginRight: 16,
  },

  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },

  artistName: {
    fontSize: 12,
    color: "#444",
    fontWeight: "500",
  },

  resultsHeader: {
    marginBottom: 16,
  },

  resultsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  salonResultCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  resultSalonImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    marginRight: 12,
  },

  resultSalonName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  resultSalonAddr: {
    fontSize: 12,
    color: "#999",
    marginVertical: 4,
  },

  resultSalonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  resultRating: {
    fontSize: 12,
    color: "#444",
  },

  resultDistance: {
    fontSize: 12,
    color: "#999",
  },

  bookBtnResult: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 12,
  },

  bookBtnResultText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },

  noSalonsText: {
    textAlign: "center",
    fontSize: 14,
    color: "#999",
    paddingVertical: 20,
    fontWeight: "500",
  },

  /* Salon Detail Modal Styles */
  detailModalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 50,
  },

  closeDetailBtn: {
    position: "absolute",
    top: 20,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 50,
  },

  detailLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  detailLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },

  detailContent: {
    flex: 1,
  },

  detailImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#e0e0e0",
  },

  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },

  detailSalonName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },

  detailAddress: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },

  detailRating: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  detailRatingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6c5ce7",
  },

  detailSection: {
    backgroundColor: "#fff",
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  detailSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  contactText: {
    fontSize: 13,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },

  descriptionText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },

  hoursItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  dayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },

  hoursText: {
    fontSize: 13,
    color: "#666",
  },

  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },

  serviceDesc: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },

  serviceMeta: {
    fontSize: 12,
    color: "#999",
  },

  servicePrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6c5ce7",
  },

  noDataText: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
  },

  bookDetailBtn: {
    backgroundColor: "#6c5ce7",
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  bookDetailBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Bookings Management Styles
  bookingsContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  bookingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  bookingsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },

  emptyBookings: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },

  emptyBookingsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },

  browseBtn: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },

  browseBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  bookingCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  bookingId: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },

  bookingBody: {
    padding: 16,
  },

  bookingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },

  bookingLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    width: 70,
  },

  bookingValue: {
    fontSize: 14,
    color: "#111",
    fontWeight: "600",
    flex: 1,
  },

  bookingPrice: {
    fontSize: 16,
    color: "#6c5ce7",
    fontWeight: "700",
    flex: 1,
  },

  notesSection: {
    flexDirection: "row",
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    gap: 8,
  },

  notesText: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    flex: 1,
  },

  bookingActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    padding: 12,
    gap: 12,
  },

  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },

  rescheduleBtn: {
    backgroundColor: "#6c5ce720",
  },

  rescheduleBtnText: {
    color: "#6c5ce7",
    fontSize: 14,
    fontWeight: "600",
  },

  cancelBtn: {
    backgroundColor: "#ef444420",
  },

  cancelBtnText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },

  // Reschedule Modal Styles
  rescheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  rescheduleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  rescheduleForm: {
    padding: 16,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },

  rescheduleInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },

  rescheduleSubmitBtn: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },

  rescheduleSubmitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export const UserDashboard = HomeScreen;
