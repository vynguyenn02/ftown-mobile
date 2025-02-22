import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SelectionModalGenotype = ({ visible, options, onSelect, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => {
                onSelect(option); // Pass the entire option object
                onClose();
              }}
            >
              <Text style={styles.optionText}>{option.genotypeName}</Text>
              {/* Display the label */}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 18,
  },
  closeButton: {
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "blue",
  },
});

export default SelectionModalGenotype;
