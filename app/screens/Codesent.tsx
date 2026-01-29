import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EmailIcon from "../../assets/images/customImages/EmailIcon.png";
const router = useRouter();

const Codesent = () => {
  return (
    <View style={styles.container}>
      <Image source={EmailIcon} style={styles.image}></Image>
      <Text style={styles.title}>Code Has been Sent </Text>
      <Text style={styles.bodycontent}>
        You will receive an email shortly withh code to setup a new password
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/screens/ResetPassword")}>
        <Text style={styles.btnText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bodycontent: {
    marginTop: 4,
  },
  button: {
    backgroundColor: "#6c5ce7",
    padding: 10,
    borderRadius: 8,
    width: "7%",
  },
  btnText: {
    color: "#fff",
    justifyContent: "center",
  },
});
export default Codesent;
