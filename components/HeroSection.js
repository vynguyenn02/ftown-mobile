import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Banner from "../assets/images/banner1.jpg"; // Adjust the path if necessary

const HeroSection = () => {
  return (
    <View style={styles.heroSection}>
      <Image source={Banner} style={styles.heroImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    marginBottom: 20,
  },
  heroImage: {
    width: "100%",
    height: 200,
    // borderRadius: 10,
  },
});

export default HeroSection;
