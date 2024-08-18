import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../authContext/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import InterestsList from './InterestsList';
import { API_KEYS } from '../../config';

const EditProfileModal = ({ userInfo, onClose, onSave }) => {
  const { user } = useAuth();
  const [editName, setEditName] = useState(userInfo.preferences.name);
  const [editBio, setEditBio] = useState(userInfo.preferences.bio);
  const [editDate, setEditDate] = useState(new Date(userInfo.preferences.date));
  const [editImageUrl, setEditImageUrl] = useState(userInfo.preferences.imageUrl);
  const [editInterests, setEditInterests] = useState(userInfo.preferences.interests);
  const [loadingImage, setLoadingImage] = useState(false);

  const api_key = API_KEYS.IMAGE_API_KEY;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });
    if (!result.canceled) {
      const formData = new FormData();
      formData.append('image', { uri: result.assets[0].uri, type: 'image/jpeg', name: 'image.jpg' });
      try {
        setLoadingImage(true);
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${api_key}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setLoadingImage(false);
        if (response.status === 200) {
          setEditImageUrl(response.data.data.display_url);
        } else {
          alert('Error uploading image.');
        }
      } catch (error) {
        setLoadingImage(false);
        alert('Error uploading image. Please try again.');
      }
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setEditDate(selectedDate || editDate);
  };

  const saveProfile = async () => {
    const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/user/savePreferences', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.userId,
        preferences: { name: editName, bio: editBio, date: editDate, imageUrl: editImageUrl, interests: editInterests, gender: userInfo.preferences.gender },
      }),
    });
    if (response.status === 200) {
      onSave();
      onClose();
    } else {
      alert('Error saving profile.');
    }
  };

  const isInterestSelected = (interest) => editInterests.includes(interest);

  const toggleInterest = (interest) => {
    if (isInterestSelected(interest)) {
      setEditInterests((prev) => prev.filter((i) => i !== interest));
    } else {
      setEditInterests((prev) => [...prev, interest]);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <TextInput style={styles.inputName} value={editName} placeholder="Name" onChangeText={setEditName} />
          <DateTimePicker testID="dateTimePicker" value={editDate} mode="date" is24Hour={true} display="default" onChange={onChangeDate} />
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Image source={{ uri: editImageUrl }} style={styles.imageEdit} resizeMode="cover" />
            {loadingImage && <Text style={styles.loadingText}>Loading...</Text>}
          </TouchableOpacity>
          <TextInput style={styles.inputBio} value={editBio} placeholder="Enter your bio here" multiline onChangeText={setEditBio} />
          <InterestsList title="Your Interests" interests={editInterests} onToggleInterest={toggleInterest} />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1 },
  scrollView: { marginTop: 20 },
  formContainer: { paddingHorizontal: 20 },
  inputName: { fontSize: 20, marginBottom: 20, borderBottomWidth: 1, borderColor: '#ddd' },
  imagePicker: { marginVertical: 20 },
  imageEdit: { width: 200, height: 250, borderRadius: 10 },
  loadingText: { textAlign: 'center', marginTop: 10 },
  inputBio: { fontSize: 17, marginVertical: 20, borderBottomWidth: 1, borderColor: '#ddd' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
  saveButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  cancelButton: { backgroundColor: '#F44336', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});

export default EditProfileModal;
