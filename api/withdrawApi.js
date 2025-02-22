import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Function to create a withdrawal
export const createWithdrawal = async (withdrawalData) => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // Fetching the user token
    const response = await fetch(`${API_URL}/withdraws`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token for authorization
      },
      body: JSON.stringify(withdrawalData),
    });

    // Check if response is not ok
    if (!response.ok) {
      const errorData = await response.text(); // Get error response as text
      console.error("Error response from API:", errorData); // Log for debugging
      throw new Error(errorData || "Không thể tạo yêu cầu rút tiền"); // Throw error with message
    }

    // Parse and return the created withdrawal data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createWithdrawal:", error); // Log error for debugging
    throw error; // Re-throw error
  }
};
