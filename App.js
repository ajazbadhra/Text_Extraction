import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {androidCameraPermission} from './permissions';
import axios from 'axios';
// import codePush from 'react-native-code-push';
import RBSheet from 'react-native-raw-bottom-sheet';

// let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};

const App = () => {
  const refRBSheet = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   codePush.sync({
  //     updateDialog: true,
  //     installMode: codePush.InstallMode.IMMEDIATE,
  //   });
  // }, []);

  const onCamera = () => {
    ImagePicker.openCamera({
      multiple: true,
      multipleShot: true,
      cropping: true,
      freeStyleCropEnabled: true,
    })
      .then(image => {
        imageUpload(image.path);
      })
      .catch(e => {
        console.log('oncam', e);
      });
  };

  const onGallery = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      cropping: true,
      freeStyleCropEnabled: true,
    })
      .then(image => {
        console.log('selected Image', image);
        imageUpload(image.path);
      })
      .catch(e => {
        console.log('ongal', e);
      });
  };

  const imageUpload = imagePath => {
    setLoading(true);
    const imageData = new FormData();
    imageData.append('image', {
      uri: imagePath,
      name: 'image.jpg',
      fileName: 'img',
      type: 'image/jpeg',
    });
    console.log('form data', imageData);
    axios({
      headers: {'content-type': 'multipart/form-data'},
      method: 'post',
      url: 'https://termsconditionsapi.herokuapp.com/api/text_extract/',
      data: imageData,
    })
      .then(function (response) {
        setData(response.data);
        setLoading(false);
        console.log('image upload successfully', response.data);
      })
      .then(error => {
        console.log('error riased', error);
      });
  };

  return (
    <>
      {loading && (
        <View style={styles.loadstyle}>
          <ActivityIndicator
            animating={true}
            size="large"
            textContent={'Loading...'}
            color="#0000ff"
          />
        </View>
      )}

      {data && (
        <ScrollView>
          <Text selectable={true} style={styles.text}>
            {data}
          </Text>
        </ScrollView>
      )}

      <View>
        <TouchableOpacity
          style={styles.btnStyle}
          activeOpacity={0.8}
          onPress={() => {
            refRBSheet.current.open();
          }}>
          <Text style={styles.textStyle}>select your image</Text>
        </TouchableOpacity>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={200}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <TouchableOpacity
            style={styles.menuStyle}
            onPress={async () => {
              const permissionStatus = await androidCameraPermission();
              if (permissionStatus || Platform.OS == 'android') {
                setData([]);
                onCamera();
                refRBSheet.current.close();
              }
            }}>
            <Text style={{fontSize: 20}}>Take Picture</Text>
            <Text style={{fontSize: 10, color: 'red'}}>
              ! use This for single image
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.menuStyle}
            onPress={async () => {
              const permissionStatus = await androidCameraPermission();
              if (permissionStatus || Platform.OS == 'android') {
                setData([]);
                onGallery();
                refRBSheet.current.close();
              }
            }}>
            <Text style={{fontSize: 20}}>Select Picture</Text>
            <Text style={{fontSize: 10, color: 'red'}}>
              ! use This for multiple images{' '}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.menuStyle}
            onPress={() => {
              refRBSheet.current.close();
            }}>
            <Text style={{fontSize: 20}}>Close</Text>
          </TouchableOpacity>
        </RBSheet>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  loadstyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btnStyle: {
    backgroundColor: 'blue',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  text: {
    marginLeft: 10,
  },
  menuStyle: {
    flex: 1,
    margin: 5,
  },
});

// export default codePush(codePushOptions)(App);
export default App;
