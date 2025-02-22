import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

const Blogs = ({ navigation }) => {
  const blogs = [
    {
      title: "How to Care for Koi Fish",
      image: "https://example.com/blog1.jpg",
      snippet: "Caring for Koi fish can be tricky...",
    },
    {
      title: "Best Koi Fish for Beginners",
      image: "https://example.com/blog2.jpg",
      snippet: "Some Koi breeds are easier to care for...",
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Latest Blogs</Text>
      {blogs.map((blog, index) => (
        <Pressable
          key={index}
          onPress={() => navigation.navigate("BlogDetail", { blog })}
        >
          <View style={styles.blogCard}>
            <Image source={{ uri: blog.image }} style={styles.blogImage} />
            <View style={styles.blogContent}>
              <Text style={styles.blogTitle}>{blog.title}</Text>
              <Text style={styles.blogSnippet}>{blog.snippet}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  blogCard: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  blogImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  blogContent: { flex: 1 },
  blogTitle: { fontSize: 16, fontWeight: "bold" },
  blogSnippet: { color: "#555" },
});

export default Blogs;
