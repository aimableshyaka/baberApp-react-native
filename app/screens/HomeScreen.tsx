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
import MapScreen from "./MapScreen";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = React.useState("home");
  const [showLocationModal, setShowLocationModal] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("All");
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  return (
    <View style={styles.screen}>
      {activeTab === "location" ? (
        <MapScreen onBack={() => setActiveTab("home")} />
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
                  <Text style={styles.greeting}>Hi, Robert Fox</Text>
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
                      source={{ uri: salon.image }}
                      style={styles.resultSalonImage}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultSalonName}>{salon.name}</Text>
                      <Text style={styles.resultSalonAddr}>
                        {salon.address}
                      </Text>
                      <View style={styles.resultSalonFooter}>
                        <Text style={styles.resultRating}>
                          ⭐ {salon.rating}
                        </Text>
                        <Text style={styles.resultDistance}>
                          📍 {salon.distance} km
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
});
