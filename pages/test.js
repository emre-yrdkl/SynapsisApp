import { View, Text, StyleSheet, Image, Modal, Pressable, TouchableOpacity, Alert} from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../constants/Colors'
import CustomButton from '../components/CustomButton'
import {MaterialCommunityIcons} from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { useAuth } from '../AuthContext';

const FormData = global.FormData;

const AddClothesImageScreen = ({}) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const { user, signOut } = useAuth();
    const apiKey = process.env.IMAGE_KEY; // API Key for ImgBB
    const uploadImage = async (mode) => {
        console.log("Upload Image");
        try{
            let result = {};
            if(mode === "gallery"){
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [3,4],
                    quality: 1,
                });
            }
            else{
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                allowsEditing: true,
                aspect: [3,4],
                quality: 1,
            });
            }
            if(!result.canceled){
                console.log(result.assets[0].uri);
                await saveImage(result.assets[0].uri);
                setModalVisible(false);
            }
        }
        catch(error){
            console.log(error);
        }
    };

    const VisionImage = async () => {
        try {
            const response = await axios.get(https://dressmate-server-4876d863f0d8.herokuapp.com/suggestClothingItemDetails?imageUrl=${imageUrl},
            {
                headers: {
                  'Authorization': 'Bearer ' + user.token,
                },
            });

            if (response.status === 200) {
                console.log("Suggesting clothing item details successful");
                const clothingItemDetails = response.data.objects;
                console.log(clothingItemDetails);
                navigation.navigate('AddClothes', {imageUrl, ...clothingItemDetails})
            }
            else{
                console.log("Suggesting clothing item details failed");
            }
        } catch (error) {
            console.log("Suggesting clothing item details failed", error);
        }
    };

    const saveImage = async (imageUri) => {
        try{
            if (!imageUri) {
                console.error('No image selected');
                return;
            }
            const formData = new FormData();
            formData.append("image",
            {
                uri: imageUri,
                type: "image/jpeg",
                name: 'image.jpg',
            });
            const response = await axios.post(https://api.imgbb.com/1/upload?key=${apiKey}, formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
            });
            
            console.log("Response from ImgBB API:", response.data); // Log the response data
            if (response.status === 200 && response.data.data.display_url) {
                console.log("Image uploaded succesfully: ", response.data.data.display_url);
                setImageUrl(response.data.data.display_url);
                Alert.alert(
                    'Image uploaded successfully',
                    'You can now continue to add clothing item property',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') }
                    ],
                );
            } else {
                console.error('Error uploading image:');
            }
        }
        catch(error){
            console.error('Error uploading image:', error);
            throw error;
        }
    };
    const onCameraPress = async () => {
        console.log("Camera pressed");
        await uploadImage();
    };
    const onGalleryPress = async () => {
        await uploadImage("gallery");
    };
    const onRemovePress = async () => {
        /* try{
            setSelectedImage(null);
        }
        catch({message}){
            alert(message);
            setModalVisible(false);
        } */
    };
    return (
        <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.between}>
                <Text style={styles.text}>Photo</Text>
                <MaterialCommunityIcons name="close" size={30} color="black" onPress={() => setModalVisible(!modalVisible)}></MaterialCommunityIcons>
            </View>
            <View style={[styles.row,{backgroundColor: Colors.pink}]}>
                    <View style={styles.icons} >
                        <TouchableOpacity style={styles.optionBtn} onPress={onCameraPress}>
                            <MaterialCommunityIcons name="camera-outline" size={30} color= {Colors.darkPurple}></MaterialCommunityIcons> 
                            <Text style={styles.iconText}>Camera</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.icons}  >
                        <TouchableOpacity style={styles.optionBtn} onPress={onGalleryPress}>
                            <MaterialCommunityIcons name="image-outline" size={30} color= {Colors.darkPurple}></MaterialCommunityIcons> 
                            <Text style={styles.iconText}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.icons} >
                        <TouchableOpacity style={styles.optionBtn} onPress={onRemovePress}>
                            <MaterialCommunityIcons name="trash-can-outline" size={30} color= {Colors.darkPurple}></MaterialCommunityIcons> 
                            <Text style={styles.iconText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        >
        <CustomButton text="Add Cloth Image" type='TERTIARY'
            onPress={() => setModalVisible(!modalVisible)}
        ></CustomButton>
        <View style={styles.imageContainer}>
            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
        </View>
        <CustomButton text="Continue to add cloth property" type='TERTIARY'
            onPress={VisionImage}
        ></CustomButton>
      </Pressable>
    </View>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: "center",
        padding: 40,
        flex: 1,
      },
      modalView:{
        margin: 30,
        padding: 20,
      },
      row:{
        flexDirection: 'row',
        padding: 20,
      },
      between:{
        flexDirection: 'row',
        padding: 10,
        alignContent: 'center',
        alignItems: 'center'
      },
      icons:{
        padding: 10,
        alignContent: 'center',
        alignItems: 'center',
      },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.darkPurple,
        textAlign: "left",
    },
    iconText:{
        fontSize: 14,
        fontWeight: "normal",
        color: Colors.darkPurple,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    image: {
        width: 180,
        height: 240,
        borderRadius: 10,
        marginTop: 150,
    },
})

export default AddClothesImageScreen;