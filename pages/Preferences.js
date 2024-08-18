import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { horizontalScale, verticalScale, width } from '../themes/Metrics';
import * as Progress from 'react-native-progress';
import { useAuth } from '../authContext/AuthContext';
import NameInput from '../components/preferences/NameInput';
import DatePickerSection from '../components/preferences/DatePickerSection';
import ImagePickerSection from '../components/preferences/ImagePickerSection';
import BioInput from '../components/preferences/BioInput';
import GenderSelection from '../components/preferences/GenderSelection';
import InterestSelection from '../components/preferences/InterestSelection';

export default function Preferences({ navigation }) {
  const { user } = useAuth();
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const totalPages = 6;

  const scrollToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      scrollViewRef.current?.scrollTo({ x: page * width, y: 0, animated: true });
      setCurrentPage(page);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Please enter your name';
    if (!imageUrl) newErrors.image = 'Please upload an image';
    if (!selectedGender) newErrors.gender = 'Please select your gender';
    if (!selectedInterests.length) newErrors.interests = 'Please select at least one interest';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (userId, name, date, image, bio, gender, interests) => {
    try {

      if (!validateForm()) return;

      const response = await fetch('https://test-socket-ffe88ccac614.herokuapp.com/.netlify/functions/index/user/savePreferences', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "userId":userId,
            "preferences":{
              "name": name,            
              "date": date,
              "bio":bio,
              "imageUrl": image,
              "gender":gender,
              "interests": interests 
            }
        })  
      })
      if(response.status == 200){
        navigation.replace("Dashboard")
      }else{
        console.log("error:",response.status)
      }

    } catch (error) {
      console.log("error:",error)
    }

  }


  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Progress.Bar borderColor="#fefefe" color="#66FF99" unfilledColor="#4C4C4C" progress={currentPage / 5} width={horizontalScale(300)} />
      </View>
      <Animated.ScrollView
        horizontal
        ref={scrollViewRef}
        pagingEnabled
        contentContainerStyle={styles.scrollViewContent}
      >
        <NameInput name={name} setName={setName} error={errors.name} />
        <DatePickerSection date={date} setDate={setDate} />
        <ImagePickerSection imageUrl={imageUrl} setImageUrl={setImageUrl} loading={loading} setLoading={setLoading} error={errors.image} />
        <BioInput bio={bio} setBio={setBio} />
        <GenderSelection selectedGender={selectedGender} setSelectedGender={setSelectedGender} error={errors.gender} />
        <InterestSelection selectedInterests={selectedInterests} setSelectedInterests={setSelectedInterests} error={errors.interests} />
      </Animated.ScrollView>
      <View style={styles.navigationButtons}>
        {currentPage > 0 && (
          <TouchableOpacity style={styles.prevButton} onPress={() => scrollToPage(currentPage - 1)}>
            <Text style={styles.prevButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentPage < totalPages - 1 ? (
          <TouchableOpacity style={styles.nextButton} onPress={() => scrollToPage(currentPage + 1)}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.completeButton} onPress={onSubmit}>
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressBar: { alignItems: 'center', marginTop: verticalScale(50) },
  scrollViewContent: { flexDirection: 'row', alignItems: 'center' },
  navigationButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 20 },
  prevButton: { paddingVertical: verticalScale(10), paddingHorizontal: horizontalScale(18), borderRadius: 10, borderWidth: 2, borderColor: '#FFB366', backgroundColor: '#F5F5F5', marginLeft: horizontalScale(20) },
  prevButtonText: { color: '#FFB366' },
  nextButton: { paddingVertical: verticalScale(10), paddingHorizontal: horizontalScale(18), borderRadius: 10, borderColor: '#F5F5F5', backgroundColor: '#FFB366', borderWidth: 2, marginRight: horizontalScale(20) },
  nextButtonText: { color: '#FEFEFE' },
  completeButton: { paddingVertical: verticalScale(10), paddingHorizontal: horizontalScale(18), borderRadius: 10, borderColor: '#3CCC7A', backgroundColor: '#3CCC7A', borderWidth: 2, marginRight: horizontalScale(20) },
  completeButtonText: { color: '#FEFEFE' },
});
