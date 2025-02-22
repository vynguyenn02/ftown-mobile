import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import SelectionModalCategories from "./SelectionModalCategories";
import SelectionModalGenotype from "./SelectionModalGenotype";
import SelectionModalGender from "./SelectionModalGender";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductFormSale = ({
  onCreateConsignment,
  categories,
  genotypes,
  consignmentData, // New prop for existing consignment data
}) => {
  // Consignment states, initialized with consignmentData or default values
  const [productName, setProductName] = useState(
    consignmentData?.productName || ""
  );
  const [ownerId, setOwnerId] = useState();
  const [madeBy, setMadeBy] = useState(consignmentData?.madeBy || "");
  const [gender, setGender] = useState(consignmentData?.gender ?? true);
  const [size, setSize] = useState(consignmentData?.size || "");
  const [yob, setYob] = useState(consignmentData?.yob || "");
  const [character, setCharacter] = useState(consignmentData?.character || "");
  const [foodOnDay, setFoodOnDay] = useState(consignmentData?.foodOnDay || "");
  const [saleType, setSaleType] = useState(
    consignmentData?.saleType || "Online"
  );

  const [description, setDescription] = useState(
    consignmentData?.description || ""
  );

  const [price, setPrice] = useState(consignmentData?.price || 1);
  const [categoryId, setCategoryId] = useState(
    consignmentData?.categoryId || ""
  );
  const [genotypeId, setGenotypeId] = useState(
    consignmentData?.genotypeId || ""
  );

  // Modal visibility states
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isGenotypeModalVisible, setGenotypeModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [saleTypeModalVisible, setSaleTypeModalVisible] = useState(false);

  const genderOptions = [
    { label: "Male", value: true },
    { label: "Female", value: false },
  ];
  const saleTypeOptions = [
    { label: "Online - 5%", value: "Online" },
    { label: "Offline - 10%", value: "Offline" },
  ];
  // Load existing images and userId when component mounts or updates
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        setOwnerId(storedUserId); // Set ownerId with userId from AsyncStorage
      }
    };
    fetchUserId();
  }, []);

  const validateInputs = () => {
    const errors = [];
    if (!productName) errors.push("Tên sản phẩm không được để trống.");
    if (!ownerId) errors.push("ID người sở hữu không được để trống.");
    if (!madeBy) errors.push("Nguồn gốc không được để trống.");
    if (!size || isNaN(size) || size <= 0)
      errors.push("Kích thước phải là một số dương.");
    if (!yob || isNaN(yob) || yob < 2000 || yob > new Date().getFullYear())
      errors.push("Năm sinh lớn hơn 2000 và nhỏ hơn hiện tại.");
    if (!character) errors.push("Tính cách không được để trống.");
    if (!foodOnDay) errors.push("Thức ăn mỗi ngày không được để trống.");
    if (!description) errors.push("Mô tả không được để trống.");
    if (!price || isNaN(price)) errors.push("Giá phải là một số.");
    if (!categoryId) errors.push("Xin hãy chọn giống cá.");
    if (!genotypeId) errors.push("Xin hãy chọn mã genotype.");
    if (!saleType) errors.push("Xin hãy loại ký gửi.");

    return errors;
  };

  // Submit consignment data
  const handleSubmit = () => {
    const validationMessages = validateInputs();
    if (validationMessages.length > 0) {
      alert(validationMessages.join("\n"));
      return;
    }

    const consignmentDataToSubmit = {
      productName,
      ownerId,
      madeBy,
      gender,
      size,
      yob,
      character,
      foodOnDay,
      description,
      price,
      categoryId,
      genotypeId,
      saleType,
    };

    onCreateConsignment(consignmentDataToSubmit);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>Thông Tin Cá Koi (Ký Bán)</Text>
      <Text style={styles.label}>Tên Sản Phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên sản phẩm"
        value={productName}
        onChangeText={setProductName}
      />
      <Text style={styles.label}>Nguồn gốc</Text>
      <TextInput
        style={styles.input}
        placeholder="Nơi sản xuất"
        value={madeBy}
        onChangeText={setMadeBy}
      />
      <Text style={styles.label}>Giới Tính</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setGenderModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {gender === true ? "Male" : "Female"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.label}>Kích Thước (cm)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập kích thước"
        value={size}
        onChangeText={setSize}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Năm Sinh</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập năm sinh"
        value={yob}
        onChangeText={setYob}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Tính Cách</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tính cách"
        value={character}
        onChangeText={setCharacter}
      />
      <Text style={styles.label}>Thức Ăn Mỗi Ngày (g)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số lượng thức ăn mỗi ngày"
        value={foodOnDay}
        onChangeText={setFoodOnDay}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Mô Tả</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mô tả sản phẩm"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Chọn giống cá Koi</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setCategoryModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {categories.find((option) => option._id === categoryId)
            ?.categoryName || "Chọn giống cá Koi"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.label}>Mã Genotype</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setGenotypeModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {genotypes.find((option) => option._id === genotypeId)
            ?.genotypeName || "Chọn mã genotype"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.label}>Nhập giá bán</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập giá bán"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <Text style={styles.label}>Loại ký bán</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setSaleTypeModalVisible(true)}
      >
        <Text style={styles.buttonText}>{saleType} </Text>
      </TouchableOpacity>
      {/* Image Picker */}
      {/* <Text style={styles.label}>Hình Ảnh</Text>
      <ImagePickerComponent
        onImagesSelected={handleImagesSelected}
        existingImages={images} // Pass images to ImagePickerComponent
      /> */}
      <TouchableOpacity style={styles.buttonContinue} onPress={handleSubmit}>
        <Text style={styles.buttonTextContinue}> Tiếp tục</Text>
      </TouchableOpacity>

      <SelectionModalCategories
        visible={isCategoryModalVisible}
        options={categories}
        onSelect={(selected) => setCategoryId(selected._id)}
        onClose={() => setCategoryModalVisible(false)}
      />
      <SelectionModalGenotype
        visible={isGenotypeModalVisible}
        options={genotypes}
        onSelect={(selected) => setGenotypeId(selected._id)}
        onClose={() => setGenotypeModalVisible(false)}
      />
      <SelectionModalGender
        visible={genderModalVisible}
        options={genderOptions}
        onSelect={(selected) => setGender(selected.value)}
        onClose={() => setGenderModalVisible(false)}
      />
      <SelectionModalGender
        visible={saleTypeModalVisible}
        options={saleTypeOptions}
        onSelect={(selected) => setSaleType(selected.value)}
        onClose={() => setSaleTypeModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  button: {
    // backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    color: "#000",
    textAlign: "left",
  },
  buttonContinue: {
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 4,
  },
  buttonTextContinue: {
    color: "#fff",
    textAlign: "center",
  },
});

export default ProductFormSale;
