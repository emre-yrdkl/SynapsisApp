import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { verticalScale, horizontalScale } from '../../themes/Metrics';
import { API_KEYS } from './config';

const ImagePickerSection = ({ imageUrl, setImageUrl, loading, setLoading, error }) => {
  const api_key = API_KEYS.IMAGE_API_KEY;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (result.canceled) return;

    let formData = new FormData();
    formData.append("image", {
      uri: result.assets[0].uri,
      type: "image/jpeg",
      name: 'image.jpg',
    });

    try {
      setLoading(true);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${api_key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const data = await response.json();
      setLoading(false);
      if (response.status === 200) {
        setImageUrl(data.data.display_url);
      } else {
        alert('Error uploading image.');
      }
    } catch (error) {
      setLoading(false);
      alert('Error uploading image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Photos</Text>
      <TouchableOpacity onPress={pickImage} style={styles.addButton}>
        <Text style={styles.addButtonText}>{loading ? "Loading..." : "Add a photo"}</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', height: '100%' },
  title: { color: '#E69400', fontFamily: 'ArialRoundedMTBold', fontSize: 32, fontWeight: '400', marginTop: verticalScale(50) },
  addButton: { borderWidth: 2, borderColor: '#FFB366', backgroundColor: '#F5F5F5', marginTop: verticalScale(50), paddingHorizontal: horizontalScale(10), paddingVertical: verticalScale(15), borderRadius: 10 },
  addButtonText: { color: '#FFB366', fontSize: 20 },
  errorText: { color: 'red', marginTop: 4 },
  image: { width: 200, height: 250, borderRadius: 10, marginTop: verticalScale(50) },
});

export default ImagePickerSection;
