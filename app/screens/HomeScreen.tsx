import React from "react";
import {
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

const HomeScreen = () => {
  const [activeTab, setActiveTab] = React.useState("home");
  const [showLocationModal, setShowLocationModal] = React.useState(true);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Hi, Robert Fox</Text>
              <Text style={styles.location}>
                <Ionicons name="location-outline" size={12} /> 6391 Elgin St,
                Celina, Delaware
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
          />
          <Ionicons name="options-outline" size={18} color="#999" />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((item, i) => (
            <View key={i} style={styles.category}>
              <Image source={{ uri: item.image }} style={styles.catImage} />
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

        <View style={styles.salonCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
            }}
            style={styles.salonImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.salonName}>Bella Rinova</Text>
            <Text style={styles.salonAddr}>
              6391 Elgin St, Celina, Delaware
            </Text>

            <View style={styles.salonFooter}>
              <Text style={styles.rating}>⭐ 4.8</Text>
              <Text style={styles.distance}>5 km</Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
          onPress={() => setActiveTab("menu")}
        >
          <Ionicons
            name={activeTab === "menu" ? "apps" : "apps-outline"}
            size={24}
            color={activeTab === "menu" ? "#6c5ce7" : "#999"}
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
  },

  rating: {
    fontSize: 12,
  },

  distance: {
    fontSize: 12,
    color: "#999",
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
});
