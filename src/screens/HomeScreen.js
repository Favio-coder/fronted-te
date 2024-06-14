import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Acceder a Cámara"
          onPress={() => navigation.navigate('Camera')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Acceder a Galería"
          onPress={() => navigation.navigate('Gallery')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 20, 
  },
});

export default HomeScreen;
