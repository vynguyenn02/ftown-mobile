import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FAQs = () => {
  const faqs = [
    {
      question: "How often should I feed my Koi?",
      answer:
        "Feed your Koi once or twice daily with a high-quality fish food.",
    },
    {
      question: "What is the best water temperature for Koi?",
      answer: "Koi thrive in water temperatures between 60-75°F (15-24°C).",
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.faqQuestion}>{faq.question}</Text>
          <Text style={styles.faqAnswer}>{faq.answer}</Text>
        </View>
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
  faqItem: {
    marginBottom: 10,
  },
  faqQuestion: {
    fontWeight: "bold",
  },
  faqAnswer: {
    color: "#555",
  },
});

export default FAQs;
