import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const GalleryScreen = () => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
      // Aquí puedes añadir la lógica para subir la imagen a la base de datos
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    // Lógica para subir la imagen a tu base de datos
    // Ejemplo: Convertir la imagen a base64 y enviarla a tu servidor

    let base64Img = `data:image/jpg;base64,${await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })}`;

    // Configuración de tu servidor, reemplaza con tu endpoint
    let apiUrl = 'https://your-server.com/upload';
    let data = {
      file: base64Img,
      upload_preset: 'your_upload_preset', // Solo si estás usando un servicio como Cloudinary
    };

    fetch(apiUrl, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })
      .then(async (response) => {
        let data = await response.json();
        if (data.secure_url) {
          console.log('Upload successful: ', data.secure_url);
        }
      })
      .catch((err) => {
        console.log('Upload failed: ', err);
      });
  };

  return (
    <View style={styles.container}>
      <Button title="Arrastra imagen o selecciona" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default GalleryScreen;
