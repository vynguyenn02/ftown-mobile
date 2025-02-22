// ImagePickerComponent.js
import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const ImagePickerComponent = ({ onImagesSelected, existingImages = [] }) => {
  const [images, setImages] = useState(existingImages);

  useEffect(() => {
    setImages(existingImages); // Set existing images when component mounts or existingImages change
  }, [existingImages]);

  const pickImages = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Open image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      selectionLimit: 0,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages); // Update local state
      onImagesSelected(updatedImages); // Pass up to parent
    }
  };

  const removeImage = (uri) => {
    const filteredImages = images.filter((image) => image !== uri);
    setImages(filteredImages);
    onImagesSelected(filteredImages); // Update parent with new image list
  };

  return (
    <View>
      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity
          style={styles.button}
          // title="Chọn Hình Ảnh"
          onPress={pickImages}
        >
          <Text style={styles.buttonText}>Chọn hình ảnh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={{ marginVertical: 10 }}>
        {images.map((uri, index) => (
          <View key={index} style={{ marginRight: 10 }}>
            <Image source={{ uri }} style={{ width: 100, height: 100 }} />
            <TouchableOpacity onPress={() => removeImage(uri)}>
              <Text style={{ color: "red", textAlign: "center" }}>Xóa</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ImagePickerComponent;
const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 8,
    borderColor: "#ccc",
    // marginBottom: 16,
    borderWidth: 1,
    width: 140,
  },
  buttonText: {
    color: "#333",
    textAlign: "center",
  },
});
