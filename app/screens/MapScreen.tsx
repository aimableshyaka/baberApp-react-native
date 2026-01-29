import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const MapScreen = ({ onBack }) => {
  const [selectedSalon, setSelectedSalon] = React.useState({
    name: "Bella Rinova",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    rating: 4.8,
    distance: 2.5,
    address: "6391 Elgin St, Celina, Delaware 10299",
  });

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <View style={styles.mapContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>

        {/* Map placeholder with markers */}
        <View style={styles.mapContent}>
          <Text style={styles.mapText}>Map View</Text>

          {/* User Location Marker */}
          <View style={styles.userMarkerContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              style={styles.userAvatar}
            />
          </View>

          {/* Salon Markers */}
          <View style={styles.salonMarker1}>
            <Ionicons name="location" size={32} color="#6c5ce7" />
          </View>

          <View style={styles.salonMarker2}>
            <Ionicons name="location" size={32} color="#e0e0e0" />
          </View>
        </View>
      </View>

      {/* Salon Card */}
      <ScrollView style={styles.bottomSheet} scrollEnabled={false}>
        {/* Drag Handle */}
        <View style={styles.dragHandle} />

        {/* Salon Card Content */}
        <View style={styles.salonCard}>
          <Image
            source={{ uri: selectedSalon.image }}
            style={styles.salonImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.salonName}>{selectedSalon.name}</Text>
            <View style={styles.salonMeta}>
              <Text style={styles.rating}>⭐ {selectedSalon.rating}</Text>
              <Text style={styles.distance}>
                📍 {selectedSalon.distance} km
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bookBtn}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
              }}
              style={styles.bookBtnImage}
            />
          </TouchableOpacity>
        </View>

        {/* Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.addressRow}>
            <Ionicons name="location" size={20} color="#6c5ce7" />
            <Text style={styles.addressText}>{selectedSalon.address}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#999" />
          <TextInput
            placeholder="Search by Salons"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={18} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  mapContainer: {
    flex: 1,
    backgroundColor: "#e8e8f0",
    position: "relative",
  },

  mapContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  mapText: {
    fontSize: 16,
    color: "#999",
    position: "absolute",
    top: 20,
    right: 20,
  },

  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  userMarkerContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(108, 92, 231, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#6c5ce7",
    position: "absolute",
    left: 40,
    top: 80,
  },

  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  salonMarker1: {
    position: "absolute",
    right: 60,
    top: 100,
  },

  salonMarker2: {
    position: "absolute",
    right: 40,
    bottom: 150,
  },

  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },

  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },

  salonCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
  },

  salonImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },

  cardContent: {
    flex: 1,
  },

  salonName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },

  salonMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rating: {
    fontSize: 12,
    color: "#444",
  },

  distance: {
    fontSize: 12,
    color: "#999",
  },

  bookBtn: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    marginLeft: 12,
  },

  bookBtnImage: {
    width: "100%",
    height: "100%",
  },

  addressSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  addressRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    alignItems: "flex-start",
  },

  addressText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginHorizontal: 16,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
  },
});
