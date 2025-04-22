// screens/FeedbackScreen.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';           // <–– ĐÚNG
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import feedbackApi from '../api/feedbackApi';
import orderApi from '../api/orderApi';

const FeedbackStarRating = ({ rating, setRating }) => {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
          <Ionicons
            name={i < rating ? 'star' : 'star-outline'}
            size={24}
            color="#FFA500"
            style={styles.starIcon}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const FeedbackScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [accountId, setAccountId] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // 1) Xin quyền đọc ảnh
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền', 'Cho phép truy cập thư viện ảnh để gửi hình.');
      }
    })();
  }, []);

  // 2) Load accountId
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('accountId');
      if (stored) setAccountId(+stored);
    })();
  }, []);

  // 3) Lấy order items và init state
  useEffect(() => {
    if (!accountId || !orderId) return;
    setLoading(true);
    orderApi.getOrdersReturnRequest(accountId, orderId)
      .then(res => {
        const items = res.data?.data || [];
        setOrderItems(items);
        const init = {};
        items.forEach(item => {
          init[item.orderDetailId] = { rating: 0, comment: '', imageFile: null };
        });
        setFeedbackInputs(init);
      })
      .catch(() => Alert.alert('Lỗi', 'Không thể tải sản phẩm'))
      .finally(() => setLoading(false));
  }, [accountId, orderId]);

  // 4) Chọn ảnh
  const handlePickImage = async orderDetailId => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        setFeedbackInputs(prev => ({
          ...prev,
          [orderDetailId]: {
            ...prev[orderDetailId],
            imageFile: {
              uri: asset.uri,
              name: asset.uri.split('/').pop(),
              type: asset.type + '/' + asset.uri.split('.').pop(),
            },
          },
        }));
      }
    } catch (err) {
      console.error('Lỗi chọn hình:', err);
    }
  };

  // 5) Render form cho mỗi item
  const renderItem = ({ item }) => {
    const fb = feedbackInputs[item.orderDetailId] || {};
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.productName}</Text>
            <Text>Size: {item.size}</Text>
            <Text>Số lượng: {item.quantity}</Text>
          </View>
        </View>

        <Text>Đánh giá sao:</Text>
        <FeedbackStarRating
          rating={fb.rating}
          setRating={r =>
            setFeedbackInputs(prev => ({
              ...prev,
              [item.orderDetailId]: { ...prev[item.orderDetailId], rating: r },
            }))
          }
        />

        <Text>Bình luận:</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Nhập bình luận..."
          value={fb.comment}
          onChangeText={txt =>
            setFeedbackInputs(prev => ({
              ...prev,
              [item.orderDetailId]: { ...prev[item.orderDetailId], comment: txt },
            }))
          }
          multiline
        />

        <Text>Hình ảnh:</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => handlePickImage(item.orderDetailId)}
          >
            <Text>Chọn ảnh</Text>
          </TouchableOpacity>
          {fb.imageFile && (
            <Image source={{ uri: fb.imageFile.uri }} style={styles.preview} />
          )}
        </View>
      </View>
    );
  };

  // 6) Gửi feedback
  const handleSubmit = async () => {
    const payload = orderItems.map(item => {
      const fb = feedbackInputs[item.orderDetailId];
      return {
        orderDetailId: item.orderDetailId,
        accountId,
        productId: item.productId,
        rating: fb.rating,
        comment: fb.comment.trim(),
        createdDate: new Date().toISOString(),
        imageFile: fb.imageFile,
      };
    });

    console.log('Submitting feedback payload:', payload);

    for (let f of payload) {
      if (!f.rating || !f.comment) {
        return Alert.alert('Thông báo', 'Vui lòng nhập đánh giá và bình luận.');
      }
    }

    setSubmitting(true);
    try {
      const res = await feedbackApi.createFeedback(payload);
      console.log('Feedback API response:', res.data);
      if (res.data.status) {
        Alert.alert('Thành công', 'Đã gửi đánh giá!');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Gửi thất bại.');
      }
    } catch (err) {
      console.error('Submit feedback error:', err);
      Alert.alert('Lỗi', 'Có lỗi xảy ra.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={orderItems}
        keyExtractor={i => String(i.orderDetailId)}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitText}>
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  thumb: { width: 60, height: 60, borderRadius: 6 },
  info: { marginLeft: 12, flex: 1 },
  name: { fontWeight: 'bold', fontSize: 16 },
  card: {
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  starIcon: { marginRight: 4 },
  starRow: { flexDirection: 'row', marginVertical: 4 },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 6,
  },
  preview: { width: 50, height: 50, marginLeft: 10, borderRadius: 6 },
  submitBtn: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  submitText: { color: '#fff', fontWeight: 'bold' },
});
