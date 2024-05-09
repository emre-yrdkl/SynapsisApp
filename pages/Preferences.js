import React, {useRef, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Button, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { horizontalScale, moderateScale, verticalScale, width, height } from '../themes/Metrics';
import * as Progress from 'react-native-progress';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../authContext/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as fd from "form-data";
const api_key = "bd11fa2ede77feb1dde0bdc20ea88bf5"

export default function Preferences({navigation}) {
  const { user, socket, receiveMessage, setCheckInPlace, checkInPlace, setRoomId, roomId } = useAuth();
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0); // Start at page 6 (index 5)
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);


  const totalPages = 6;
  
  // Define content for each page
  const pageContents = [
    { title: "Your Name", description: "This is the Welcome page." },
    { title: "Your Birthday", description: "This is your Profile page." },
    { title: "Add Photos", description: "Adjust your settings here." },
    { title: "Your Bio", description: "View your notifications." },
    { title: "Your Gender", description: "Learn more about our team." },
    { title: "Your Interests", description: "Contact us for more information." },
  ];

  const interests = [
    'Running', 'Soccer', 'Art', 'Make-up', 'Photography', 'Singing',
    'Concert', 'Theater', 'Bars', 'Video games', 'Cooking', 'Drama',
    'Comedy', 'Fantasy', 'Anime', 'Manga', 'Mystery',
  ]

  const genders = [
    "Man", "Woman", "Non-binary", "Prefer not to say"
  ]

  const isGenderSelected = (gender) => {
    return selectedGender === gender;
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date; // Backup to current date if the user cancels
    setDate(currentDate);
  };

  const toggleInterest = (interest) => {
    const index = selectedInterests.indexOf(interest);
    if (index !== -1) {
        // If interest is already selected, remove it
        setSelectedInterests(prevSelectedInterests =>
            prevSelectedInterests.filter(item => item !== interest)
        );
    } else {
        // If interest is not selected, add it
        setSelectedInterests(prevSelectedInterests => [
            ...prevSelectedInterests,
            interest
        ]);
    }
  };

  const isInterestSelected = (interest) => {
      return selectedInterests.includes(interest);
  };

  const scrollToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      scrollViewRef.current?.scrollTo({
        x: page * width,
        y: 0,
        animated: true,
      });
      setCurrentPage(page); // Update the current page index
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if(result.canceled){
      return;
    }
    let formData = new FormData();
    formData.append("image",
            {
                uri: result.assets[0].uri,
                type: "image/jpeg",
                name: 'image.jpg',
            });

    try {
      setLoading(true)
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${api_key}`, formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false)
      if(response.status == 200){
        setImageUrl(response.data.data.display_url);
        alert('Image uploaded successfully');
      }
      else{
        console.log("error:",response.status)
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  const Onsubmit = async (userId, name, date, image, bio, gender, interests) => {
    try {
      console.log("userId1",userId, name, date, gender, interests)

      if(name == "" || !date || gender == ""){//bio ve image eklenebilir
        Alert.alert("Error","Please fill all the fields")
      }
      else{
        console.log("userId",userId, name, date, gender, interests)
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
      }

    } catch (error) {
      console.log("error:",error)
    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.ProgressBar}>
            <Progress.Bar borderColor="#fefefe" color='#66FF99' unfilledColor="#4C4C4C" progress={(currentPage)/5} width={horizontalScale(300)} />
      </View>
      <Animated.ScrollView
        horizontal
        ref={scrollViewRef}
        pagingEnabled // this snaps the ScrollView to pages
        contentContainerStyle={styles.scrollViewContent}>
        {pageContents.map((content, index) => 
        {
              if (index === 0) {//Name page
                  return (
                    <View key={index} style={styles.containerName}>
                    <Text style={styles.titleName}>{content.title}</Text>
                    <TextInput
                      style={styles.inputName}
                      onChangeText={setName}
                      value={name}
                      placeholder="Name"
                    />
                    </View>
                  );
              } else if (index === 1) {
                  return (
                  <View key={index} style={styles.containerName}>
                    <Text style={styles.titleName}>{content.title}</Text>
                  
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={'date'}
                      is24Hour={true}
                      display="default"
                      onChange={onChangeDate}
                      style={{marginTop: verticalScale(50), marginRight: horizontalScale(20)}}
                    />
                  </View>
                  );
              } else if (index == 2){
                return (
                  <View key={index} style={styles.containerName}>
                    <Text style={styles.titleName}>{content.title}</Text>
                    <TouchableOpacity onPress={pickImage} 
                      style={{borderWidth: 2, borderColor: '#FFB366', backgroundColor: '#F5F5F5', 
                      marginTop: verticalScale(50), paddingHorizontal:horizontalScale(10), 
                      paddingVertical:verticalScale(15), borderRadius:10 }} >
                      <Text style={{color: '#FFB366', fontSize: 20}}>{loading? "Loading.." :"Add a photo"}</Text>
                    </TouchableOpacity>
                    {loading && 
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/gifs/loading.gif')} style={{width:250, height:250}}/>
                        </View>
                    }
                    {imageUrl && <Image source={{ uri: imageUrl }}style={styles.image} />}

                  </View>
                );
              }
              else if (index == 3){
                return (
                  <View key={index} style={styles.containerName}>
                    <Text style={styles.titleName}>{content.title}</Text>
                    <TextInput
                      style={styles.inputBio}
                      multiline={true}
                      onChangeText={setBio}
                      placeholder='Enter your bio here'
                      numberOfLines={4}
                    />
                  </View>
                );
              }
              else if (index == 4){
                return (
                  <View key={index} style={styles.containerName}>
                    <Text style={styles.titleName}>{content.title}</Text>
                    <View style={styles.optionsContainer}>
                      {genders.map((gender) => (
                        <TouchableOpacity
                          key={gender}
                          style={[
                            styles.option,
                            selectedGender === gender ? styles.optionSelected : styles.optionNotSelected
                          ]}
                          onPress={() => setSelectedGender(gender)}
                        >
                          <Text style={isGenderSelected(gender) ? styles.optionText : styles.optionNotText}>{gender}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              }
              else if (index == 5){
                return (
                  <View key={index} style={styles.containerName}>
                    <Text style={styles.titleName}>{content.title}</Text>
                    <View style={styles.interestsContainer}>
                      {interests.map((interest) => (
                        <TouchableOpacity
                          key={interest}
                          style={[
                            styles.interest,
                            isInterestSelected(interest) ? styles.interestSelected : styles.interestNotSelected,
                          ]}
                          onPress={() => toggleInterest(interest)}
                        >
                          <Text style={isInterestSelected(interest) ? styles.interestText : styles.interestNotText}>{interest}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              }
          }
          
        )}
      </Animated.ScrollView>
      <View style={styles.TouchableOpacityContainer}>
        
          {
          currentPage == 0 ? 
          <TouchableOpacity title=""/>
          : 
          <TouchableOpacity
          style={{
            paddingVertical: verticalScale(10),
            paddingHorizontal: horizontalScale(18),
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#FFB366',
            backgroundColor: '#F5F5F5',
            marginLeft: horizontalScale(20),}}
          onPress={() => scrollToPage(currentPage - 1)}
          disabled={currentPage === 0} // Disable TouchableOpacity if on the first page
          >
          <Text style={{color: '#FFB366',}}>Previous</Text>
          </TouchableOpacity>
          }

          {
          currentPage == 5 ? 
          <TouchableOpacity
          style={{
            paddingVertical: verticalScale(10),
            paddingHorizontal: horizontalScale(18),
            borderRadius: 10,
            borderColor: '#3CCC7A',
            backgroundColor: '#3CCC7A',
            borderWidth: 2,
            marginRight: horizontalScale(20),}}
          onPress={() => Onsubmit(user.userId, name, date, imageUrl, bio, selectedGender, selectedInterests)}
          >
          <Text style={{color: '#FEFEFE',}}>Complete</Text>
          </TouchableOpacity>
          : 
          <TouchableOpacity
          style={{
            paddingVertical: verticalScale(10),
            paddingHorizontal: horizontalScale(18),
            borderRadius: 10,
            borderColor: '#F5F5F5',
            backgroundColor: '#FFB366',
            borderWidth: 2,
            marginRight: horizontalScale(20),}}
          onPress={() => scrollToPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1} // Disable TouchableOpacity if on the last page
          >
          <Text style={{color: '#FEFEFE',}}>Next</Text>
          </TouchableOpacity>
          }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 250,
    borderRadius: 10,
    marginTop: verticalScale(50),
  },
  ProgressBar:{
    alignItems: 'center',
    marginTop:verticalScale(50)
},
  TouchableOpacityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  scrollViewContent: {
    flexDirection: 'row', // Ensures horizontal layout
    alignItems: 'center',
  },
  containerName: {
    width: width,
    alignItems: 'center',
    height: "100%",
  },
  titleName: {
    color: "#E69400",
    fontFamily: "ArialRoundedMTBold",
    fontSize: 32,
    fontWeight: "400",
    marginTop: verticalScale(50),
  },
  inputName:{
    flexDirection: 'row',
    width: horizontalScale(280),
    height: verticalScale(55),
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4C4C4C',
    marginTop: verticalScale(50),
    fontSize: 16,
  },
  item:{
    width: width,
  },
  inputBio:{
    marginTop: verticalScale(50),
    borderWidth: 1,
    width: horizontalScale(280),
    minHeight: verticalScale(100),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4C4C4C",
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: verticalScale(50),
  },
  option: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(18),
    borderRadius: 10,
    margin: 5,
  },
  optionSelected: {
    borderColor: '#F5F5F5',
    backgroundColor: '#FFB366',
    borderWidth: 2,
    borderColor: '#FFB366',
  },
  optionNotSelected:{
    borderWidth: 2,
    borderColor: '#FFB366',
    backgroundColor: '#F5F5F5',

  },
  optionText: {
    color: '#FEFEFE',
    textAlign: 'center',
    fontSize: 18,
  },
  optionNotText: {
    color: '#FFB366',
    textAlign: 'center',
    fontSize: 18,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: verticalScale(50),
  },
  interest: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(18),
    borderRadius: 10,
    margin: 5,
  },
  interestSelected: {
    borderColor: '#F5F5F5',
    backgroundColor: '#FFB366',
    borderWidth: 2,
    borderColor: '#FFB366',
  },
  interestNotSelected:{
    borderWidth: 2,
    borderColor: '#FFB366',
    backgroundColor: '#F5F5F5',

  },
  interestText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  interestNotText: {
    color: '#FFB366',
    textAlign: 'center',
    fontSize: 16,
  },
});