import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const CareConsignmentForm = ({
  onCreateConsignment,
  handleBack,
  initialData, // New prop for existing data
}) => {
  const [careType, setCareType] = useState(initialData?.careType || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [isModalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(initialData?.startDate || new Date())
  );
  const [endDate, setEndDate] = useState(
    new Date(initialData?.endDate || new Date())
  );

  const options = [
    { label: "Normal", price: 100000 },
    { label: "Special", price: 150000 },
  ];

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
  };

  const handleSubmit = () => {
    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    // Create a date object for comparison
    const startDateWithoutTime = new Date(startDate);
    startDateWithoutTime.setHours(0, 0, 0, 0); // Reset time to midnight

    const endDateWithoutTime = new Date(endDate);
    endDateWithoutTime.setHours(0, 0, 0, 0); // Reset time to midnight

    if (!careType) {
      alert("Vui lòng chọn loại chăm sóc.");
      return;
    }

    // Check if start date is before or equal to today
    if (startDateWithoutTime <= today) {
      alert("Ngày bắt đầu phải lớn hơn ngày hôm nay."); // Alert if start date is today or in the past
      return;
    }

    if (!endDate) {
      alert("Vui lòng chọn ngày kết thúc.");
      return;
    }

    // Check if end date is before or equal to start date
    if (endDateWithoutTime <= startDateWithoutTime) {
      alert("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    const consignmentData = {
      careType: careType,
      price: price,
      startDate: startDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
      endDate: endDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
    };

    onCreateConsignment(consignmentData);
  };

  const handleOptionSelect = (option) => {
    setCareType(option.label);
    setPrice(option.price);
    setModalVisible(false); // Close modal after selection
  };

  useEffect(() => {
    // Set initial data when component mounts or when initialData changes
    if (initialData) {
      setCareType(initialData.careType);
      setPrice(initialData.price);
      setStartDate(new Date(initialData.startDate));
      setEndDate(new Date(initialData.endDate));
    }
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        setOwnerId(storedUserId); // Set ownerId with userId from AsyncStorage
      }
    };
  }, [initialData]);

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>Thông Tin Ký Gửi</Text>

      {/* Care Type Selector */}
      <Text style={styles.label}>Loại Chăm Sóc</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text>
          {careType ? `${careType} - ${price} VND` : "Chọn loại chăm sóc"}
        </Text>
      </TouchableOpacity>

      {/* Modal for Care Type Selection */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn Loại Chăm Sóc</Text>
            {options.map((option) => (
              <Pressable
                key={option.label}
                onPress={() => handleOptionSelect(option)}
                style={styles.optionButton}
              >
                <Text style={styles.optionText}>
                  {option.label} - {option.price} VND
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Other Inputs */}
      <View style={styles.flexBetweenDayPicker}>
        <Text style={styles.label}>Ngày Bắt Đầu</Text>
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
          style={styles.datePicker}
        />
      </View>

      <View style={styles.flexBetweenDayPicker}>
        <Text style={styles.label}>Ngày Kết Thúc</Text>
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
          style={styles.datePicker}
        />
      </View>

      <View style={styles.flexBetween}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Trở lại</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Tạo Ký Gửi Chăm Sóc</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
  },
  backButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  submitButton: {
    padding: 10,
    backgroundColor: "#ba2d32",
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "500",
    fontSize: 16,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    marginBottom: 16,
  },
  flexBetweenDayPicker: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 20,
  },
  flexBetween: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 20,
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 10,
    marginTop: 20,
    backgroundColor: "#ba2d32",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default CareConsignmentForm;
