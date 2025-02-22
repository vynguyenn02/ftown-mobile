import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const News = ({ navigation }) => {
  const news = [
    { title: "New Shipment of Koi Arrived!", date: "October 18, 2024" },
    { title: "Koi Fish Championship Results", date: "October 10, 2024" },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent News</Text>
      {news.map((newsItem, index) => (
        <Pressable
          key={index}
          onPress={() => navigation.navigate("NewsDetail", { newsItem })}
        >
          <View style={styles.newsCard}>
            <Text style={styles.newsTitle}>{newsItem.title}</Text>
            <Text style={styles.newsDate}>{newsItem.date}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  newsCard: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  newsDate: {
    color: "#888",
    fontSize: 12,
  },
});

export default News;
