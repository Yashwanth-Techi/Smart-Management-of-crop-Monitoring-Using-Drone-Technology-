import axios from "axios";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import diases from "../data.json"; // Ensure data.json has a valid format

const RASPBERRY_PI_IP = "http://192.168.97.136:5000"; // Change to your Raspberry Pi's IP
const ML_API_URL = `${RASPBERRY_PI_IP}/predict`;

// Language translations
const translations = {
  english: {
    appTitle: "Smart Farming System",
    appSubtitle: "Plant Disease Detector",
    startCamera: "Start Camera",
    stopCamera: "Stop Camera",
    captureImage: "Capture Image",
    capturedImage: "Captured Image",
    predictDisease: "Predict Disease",
    processing: "Processing...",
    loadingMessage: "Processing your image. Please wait...",
    diagnosisResults: "Diagnosis Results",
    severity: "Severity",
    recommendedTreatment: "Recommended Treatment",
    organicSolution: "Organic Solution",
    chemicalSolution: "Chemical Solution",
    pesticide: "Pesticide",
    dosageFrequency: "Dosage & Frequency",
    applicationMethod: "Application Method",
    storageDisposal: "Storage & Disposal",
    tipsForFarmers: "Tips for Farmers",
    precautions: "Precautions",
    additionalInfo: "Additional Information",
    changeLanguage: "Change Language",
    selectLanguage: "Select Language",
    close: "Close",
  },
  hindi: {
    appTitle: "स्मार्ट कृषि प्रणाली",
    appSubtitle: "पौधों की बीमारी का पता लगाने वाला",
    startCamera: "कैमरा शुरू करें",
    stopCamera: "कैमरा बंद करें",
    captureImage: "छवि कैप्चर करें",
    capturedImage: "कैप्चर की गई छवि",
    predictDisease: "रोग का अनुमान लगाएं",
    processing: "प्रोसेसिंग...",
    loadingMessage: "आपकी छवि संसाधित हो रही है। कृपया प्रतीक्षा करें...",
    diagnosisResults: "निदान के परिणाम",
    severity: "गंभीरता",
    recommendedTreatment: "अनुशंसित उपचार",
    organicSolution: "जैविक समाधान",
    chemicalSolution: "रासायनिक समाधान",
    pesticide: "कीटनाशक",
    dosageFrequency: "खुराक और आवृत्ति",
    applicationMethod: "आवेदन विधि",
    storageDisposal: "भंडारण और निपटान",
    tipsForFarmers: "किसानों के लिए सुझाव",
    precautions: "सावधानियां",
    additionalInfo: "अतिरिक्त जानकारी",
    changeLanguage: "भाषा बदलें",
    selectLanguage: "भाषा चुनें",
    close: "बंद करें",
  },
  kannada: {
    appTitle: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ವ್ಯವಸ್ಥೆ",
    appSubtitle: "ಸಸ್ಯ ರೋಗ ಪತ್ತೆಹಚ್ಚುವಿಕೆ",
    startCamera: "ಕ್ಯಾಮೆರಾ ಆರಂಭಿಸಿ",
    stopCamera: "ಕ್ಯಾಮೆರಾ ನಿಲ್ಲಿಸಿ",
    capturedImage: "ಸೆರೆಹಿಡಿದ ಚಿತ್ರ",
    predictDisease: "ರೋಗವನ್ನು ಊಹಿಸಿ",
    processing: "ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ...",
    loadingMessage:
      "ನಿಮ್ಮ ಚಿತ್ರವನ್ನು ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...",
    diagnosisResults: "ರೋಗನಿರ್ಣಯ ಫಲಿತಾಂಶಗಳು",
    severity: "ತೀವ್ರತೆ",
    recommendedTreatment: "ಶಿಫಾರಸು ಮಾಡಿದ ಚಿಕಿತ್ಸೆ",
    organicSolution: "ಸಾವಯವ ಪರಿಹಾರ",
    chemicalSolution: "ರಾಸಾಯನಿಕ ಪರಿಹಾರ",
    pesticide: "ಕೀಟನಾಶಕ",
    dosageFrequency: "ಡೋಸೇಜ್ & ಆವರ್ತನ",
    applicationMethod: "ಅಪ್ಲಿಕೇಶನ್ ವಿಧಾನ",
    storageDisposal: "ಸಂಗ್ರಹಣೆ & ವಿಲೇವಾರಿ",
    tipsForFarmers: "ರೈತರಿಗೆ ಸಲಹೆಗಳು",
    precautions: "ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು",
    additionalInfo: "ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ",
    changeLanguage: "ಭಾಷೆ ಬದಲಾಯಿಸಿ",
    selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    close: "ಮುಚ್ಚಿರಿ",
  },
};

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("english");
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  // Get translations for current language
  const t = translations[language];

  // Start Camera (Toggles Live Stream)
  const startCamera = async () => {
    setIsCameraActive((prev) => !prev);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Allow location access to proceed.");
      return;
    }

    // Get current location
    let currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;
    setLocation({ latitude, longitude });

    Alert.alert(
      "Location Captured",
      `Latitude: ${latitude}, Longitude: ${longitude}`
    );
  };

  // Capture Image
  const captureImage = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${RASPBERRY_PI_IP}/capture`);
      console.log("Capture Response:", response.data);

      if (response.data.success) {
        let finalImageUrl = response.data.image_url.startsWith("http")
          ? response.data.image_url
          : `${RASPBERRY_PI_IP}${response.data.image_url}`;

        // Prevent image caching
        finalImageUrl += `?timestamp=${new Date().getTime()}`;
        console.log("Final Image URL:", finalImageUrl);

        setImageUrl(finalImageUrl);
      } else {
        Alert.alert("Capture failed", response.data.error);
      }
    } catch (error) {
      Alert.alert("Error capturing image", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const predictDisease = async () => {
    if (!imageUrl) {
      Alert.alert("Error", "Please capture an image first!");
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      try {
        const response = await axios.get(ML_API_URL);

        if (response.data.success) {
          const diseaseName = response.data.disease;

          if (!diseaseName) {
            Alert.alert("Error", "No disease name found in response!");
            return;
          }

          // Find the disease in the JSON data
          const matchedDisease = diases.find((d) => d.Plant == diseaseName);

          if (matchedDisease) {
            setPrediction(matchedDisease);
          } else {
            setPrediction(diseaseName);
          }
        } else {
          Alert.alert("Prediction failed", response.data.error);
        }
      } catch (error) {
        Alert.alert("Prediction failed", error.message);
      } finally {
        setIsLoading(false);
      }
    }, 10000);
  };

  const renderResultItem = (label, value) => {
    if (!value) return null;

    return (
      <View style={styles.resultItem}>
        <Text style={styles.resultLabel}>{label}:</Text>
        <Text style={styles.resultValue}>{value}</Text>
      </View>
    );
  };

  const toggleLanguageModal = () => {
    setLanguageModalVisible(!isLanguageModalVisible);
  };

  const changeLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setLanguageModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            {/* <Text style={styles.title}>{t.appTitle}</Text>
            <Text style={styles.subtitle}>{t.appSubtitle}</Text> */}

            {/* Language Button */}
            <TouchableOpacity
              style={styles.languageButton}
              onPress={toggleLanguageModal}
            >
              <Text style={styles.languageButtonText}>{t.changeLanguage}</Text>
            </TouchableOpacity>
          </View>

          {/* Camera Controls Section */}
          <View style={styles.controlSection}>
            <TouchableOpacity
              style={[styles.button, isCameraActive ? styles.activeButton : {}]}
              onPress={startCamera}
            >
              <Text style={styles.buttonText}>
                {isCameraActive ? t.stopCamera : t.startCamera}
              </Text>
            </TouchableOpacity>

            {isCameraActive && (
              <TouchableOpacity
                style={[styles.button, styles.captureButton]}
                onPress={captureImage}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>{t.captureImage}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Show Live Camera Stream */}
          {isCameraActive && (
            <View style={styles.videoContainer}>
              <WebView
                source={{ uri: `${RASPBERRY_PI_IP}/video_feed` }}
                style={styles.video}
              />
            </View>
          )}

          {/* Show Captured Image */}
          {imageUrl && (
            <View style={styles.imageContainer}>
              <Text style={styles.sectionTitle}>{t.capturedImage}</Text>
              <Image source={{ uri: imageUrl }} style={styles.image} />

              {/* Predict Disease Button */}
              <TouchableOpacity
                style={[styles.button, styles.predictButton]}
                onPress={predictDisease}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? t.processing : t.predictDisease}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#2E7D32" />
              <Text style={styles.loaderText}>{t.loadingMessage}</Text>
            </View>
          )}

          {/* Show Prediction Result */}
          {prediction && !isLoading && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>{t.diagnosisResults}</Text>
                {typeof prediction === "object" && prediction.Disease_Name && (
                  <Text style={styles.diseaseName}>
                    {prediction.Disease_Name}
                  </Text>
                )}
              </View>

              <View style={styles.resultContent}>
                {typeof prediction === "object" ? (
                  <>
                    {renderResultItem(t.severity, prediction.Severity)}

                    <View style={styles.treatmentSection}>
                      <Text style={styles.treatmentTitle}>
                        {t.recommendedTreatment}
                      </Text>

                      <View style={styles.treatmentCard}>
                        <Text style={styles.cardTitle}>
                          {t.organicSolution}
                        </Text>
                        {renderResultItem(
                          t.pesticide,
                          prediction.Organic_Pesticide
                        )}
                        {renderResultItem(
                          t.dosageFrequency,
                          prediction.Organic_Pesticide_Dosage_and_Frequency
                        )}
                      </View>

                      <View style={styles.treatmentCard}>
                        <Text style={styles.cardTitle}>
                          {t.chemicalSolution}
                        </Text>
                        {renderResultItem(
                          t.pesticide,
                          prediction.Chemical_Pesticide
                        )}
                        {renderResultItem(
                          t.dosageFrequency,
                          prediction.Chemical_Pesticide_Dosage_and_Frequency
                        )}
                        {renderResultItem(
                          t.applicationMethod,
                          prediction.How_to_Use_Chemical_Pesticide
                        )}
                        {renderResultItem(
                          t.storageDisposal,
                          prediction.Pesticide_Storage_and_Disposal
                        )}
                      </View>
                    </View>

                    {prediction.Tips_for_Farmers && (
                      <View style={styles.tipsCard}>
                        <Text style={styles.cardTitle}>{t.tipsForFarmers}</Text>
                        <Text style={styles.tipsText}>
                          {prediction.Tips_for_Farmers}
                        </Text>
                      </View>
                    )}

                    {prediction.Precautions && (
                      <View style={styles.cautionCard}>
                        <Text style={styles.cardTitle}>{t.precautions}</Text>
                        <Text style={styles.cautionText}>
                          {prediction.Precautions}
                        </Text>
                      </View>
                    )}

                    {prediction.Additional_Information && (
                      <View style={styles.infoCard}>
                        <Text style={styles.cardTitle}>{t.additionalInfo}</Text>
                        <Text style={styles.infoText}>
                          {prediction.Additional_Information}
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <Text style={styles.resultText}>Disease: {prediction}</Text>
                )}
              </View>
            </View>
          )}

          {/* Language Selection Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isLanguageModalVisible}
            onRequestClose={toggleLanguageModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t.selectLanguage}</Text>

                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === "english" && styles.selectedLanguage,
                  ]}
                  onPress={() => changeLanguage("english")}
                >
                  <Text style={styles.languageText}>English</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === "hindi" && styles.selectedLanguage,
                  ]}
                  onPress={() => changeLanguage("hindi")}
                >
                  <Text style={styles.languageText}>हिंदी (Hindi)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === "kannada" && styles.selectedLanguage,
                  ]}
                  onPress={() => changeLanguage("kannada")}
                >
                  <Text style={styles.languageText}>ಕನ್ನಡ (Kannada)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={toggleLanguageModal}
                >
                  <Text style={styles.closeButtonText}>{t.close}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F8F5",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: "#2E7D32",
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "#E8F5E9",
    marginTop: 4,
  },
  languageButton: {
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  languageButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  controlSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#388E3C",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#FF5722",
  },
  captureButton: {
    backgroundColor: "#1976D2",
  },
  predictButton: {
    backgroundColor: "#6200EA",
    marginTop: 12,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  videoContainer: {
    marginVertical: 16,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },
  video: {
    width: "100%",
    height: 300,
  },
  imageContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#424242",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    resizeMode: "cover",
  },
  loaderContainer: {
    padding: 20,
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: "#424242",
  },
  resultContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  resultHeader: {
    backgroundColor: "#2E7D32",
    padding: 16,
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  diseaseName: {
    fontSize: 18,
    color: "#E8F5E9",
    marginTop: 4,
  },
  resultContent: {
    padding: 16,
  },
  resultItem: {
    flexDirection: "row",
    marginVertical: 5,
    flexWrap: "wrap",
  },
  resultLabel: {
    fontWeight: "bold",
    color: "#424242",
    fontSize: 15,
    marginRight: 5,
  },
  resultValue: {
    fontSize: 15,
    color: "#212121",
    flex: 1,
  },
  treatmentSection: {
    marginTop: 16,
  },
  treatmentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 8,
  },
  treatmentCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  tipsCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
  },
  cautionCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
  },
  infoCard: {
    backgroundColor: "#F3E5F5",
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#424242",
  },
  tipsText: {
    color: "#0D47A1",
    lineHeight: 20,
  },
  cautionText: {
    color: "#E65100",
    lineHeight: 20,
  },
  infoText: {
    color: "#4A148C",
    lineHeight: 20,
  },
  resultText: {
    fontSize: 16,
    color: "#212121",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2E7D32",
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  selectedLanguage: {
    backgroundColor: "#C8E6C9",
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  languageText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#424242",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default App;
