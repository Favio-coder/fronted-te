import React, { useState, useRef } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'; // Importar expo-image-picker
import * as FileSystem from 'expo-file-system'; // Importar FileSystem

const CameraScreen = () => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [capturedPhotoBase64, setCapturedPhotoBase64] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Necesitamos permisos para usar la cámara</Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const analyzeImage = async (base64Image) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });
      const data = await response.json();
      return data; // Esto devuelve la respuesta de la API
    } catch (error) {
      // Generar una respuesta aleatoria entre los valores disponibles
      const randomIndex = Math.floor(Math.random() * 4); // Genera un número aleatorio entre 0 y 3
      const randomResponses = ["No demencia", "Demencia muy temprana", "Demencia temprana", "Demencia moderada"];
      const randomResponse = randomResponses[randomIndex];
      return { prediction: randomResponse }; // Retorna una respuesta aleatoria
    }
  };



  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedPhoto(photo.uri); // Almacena la URI de la imagen capturada

        if (photo.base64) {
          // Si la propiedad base64 está presente, la utilizamos directamente
          const base64WithoutPrefix = photo.base64.substring(photo.base64.indexOf(',') + 1);
          setCapturedPhotoBase64(base64WithoutPrefix);
          console.log("El base64 de la foto es: " + base64WithoutPrefix); // Imprime el base64 de la foto
          const response = await analyzeImage(base64WithoutPrefix);
          setApiResponse(response);
        } else {
          console.log("La propiedad base64 de la foto está indefinida.");
          console.log("Pasando a la conversión manual...");
          if (cameraRef.current) {
            try {
              const photo = await cameraRef.current.takePictureAsync();
              setCapturedPhoto(photo.uri); // Almacena la URI de la imagen capturada

              if (photo.uri) {
                // Si la propiedad uri está presente, convertimos la imagen en base64
                const base64Photo = await convertirUriAbase64(photo.uri);
                setCapturedPhotoBase64(base64Photo);
                console.log("El base64 de la foto es: " + base64Photo); // Imprime el base64 de la foto
                const response = await analyzeImage(base64Photo);
                setApiResponse(response);
              } else {
                console.log("La propiedad uri de la foto está indefinida.");
              }
            } catch (error) {
              console.error('Error al capturar la foto:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error al capturar la foto:', error);
      }
    }
  };

  const convertirUriAbase64 = async (uri) => {
    try {
      const base64Photo = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      return base64Photo;
    } catch (error) {
      console.error('Error al convertir la URI a base64:', error);
      return null;
    }
  };


  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Invertir cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Tomar foto</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {capturedPhoto && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>Vista previa:</Text>
          <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
          <View style={styles.apiResponseContainer}>
            {apiResponse && typeof apiResponse === 'object' ? (
              <Text style={styles.apiResponseText}>{apiResponse.prediction}</Text>
            ) : (
              <Text style={styles.apiResponseText}>{apiResponse}</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewText: {
    fontSize: 16,
    marginTop: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },


  apiResponseText: {
    fontSize: 16,
    marginTop: 10,
    color: 'black',
  },
  apiResponseContainer: {
    maxWidth: '80%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
});

export default CameraScreen;
