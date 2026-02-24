import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, Circle, Heatmap, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const dummyData = [
    {
      id: 1,
      latitude: 12.9103652,   // Bengaluru
      longitude: 77.556158,
      timestamp: '2025-04-26T10:00:00',
      diseaseType: 'Leaf Blight',
      severity: 'High',
      affectedArea: '2.5 acres',
      imageUrl: 'https://via.placeholder.com/150',
      recommendedAction: 'Apply copper-based fungicide immediately. Isolate affected plants.',
    },
    {
      id: 2,
      latitude: 12.890984, // Kudlu Gate
      longitude: 77.6400098,
      timestamp: '2025-04-26T10:30:00',
      diseaseType: 'Healthy',
      severity: 'None',
      affectedArea: '0 acres',
      imageUrl: 'https://via.placeholder.com/150',
      recommendedAction: 'Continue monitoring. Good growing conditions.',
    },
    {
      id: 3,
      latitude: 12.9166,   // HSR Layout
      longitude: 77.6101,
      timestamp: '2025-04-26T10:35:00',
      diseaseType: 'Powdery Mildew',
      severity: 'Low',
      affectedArea: '0.5 acres',
      imageUrl: 'https://via.placeholder.com/150',
      recommendedAction: 'Apply organic fungicide. Improve ventilation.',
    },
    {
      id: 4,
      latitude: 12.9066,   // Bommanahalli
      longitude: 77.6233,
      timestamp: '2025-04-26T10:40:00',
      diseaseType: 'Rust Disease',
      severity: 'Medium',
      affectedArea: '1.2 acres',
      imageUrl: 'https://via.placeholder.com/150',
      recommendedAction: 'Apply preventive fungicide. Trim infected areas.',
    },
    {
      id: 10,
      latitude: 12.8722,   // Begur
      longitude: 77.6412,
      timestamp: '2025-04-26T10:45:00',
      diseaseType: 'Leaf Spot',
      severity: 'high',
      affectedArea: '1.0 acres',
      imageUrl: 'https://via.placeholder.com/150',
      recommendedAction: 'Spray recommended fungicide. Remove affected leaves.',
    },
    {
      id: 11,
      latitude: 12.8665,   // Singasandra
      longitude: 77.6435,
      timestamp: '2025-04-26T10:50:00',
      diseaseType: 'Healthy',
      severity: 'None',
      affectedArea: '0 acres',
      imageUrl: 'https://via.placeholder.com/150',
      recommendedAction: 'Continue regular monitoring.',
    },
];

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [viewMode, setViewMode] = useState('standard'); // standard, satellite, hybrid
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showAffectedAreas, setShowAffectedAreas] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // all, diseased, healthy
  const [isHistoryView, setIsHistoryView] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadPoints();
  }, []);

  const loadPoints = () => {
    // In a real application, you would fetch this data from your API
    setPoints(dummyData);
    
    // If you have multiple dates, you might want to set the latest date as default
    const dates = [...new Set(dummyData.map(item => item.timestamp.split('T')[0]))];
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  const getDiseaseColor = (diseaseType, severity) => {
    if (diseaseType === 'Healthy') return 'green';
    
    switch (severity) {
      case 'Low': return 'yellow';
      case 'Medium': return 'orange';
      case 'High': return 'red';
      default: return 'red';
    }
  };

  const getCircleRadius = (severity) => {
    switch (severity) {
      case 'Low': return 300; // meters
      case 'Medium': return 600;
      case 'High': return 1000;
      default: return 500;
    }
  };

  const filteredPoints = points.filter(point => {
    if (filterMode === 'all') return true;
    if (filterMode === 'diseased') return point.diseaseType !== 'Healthy';
    if (filterMode === 'healthy') return point.diseaseType === 'Healthy';
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          mapType={viewMode}
          initialRegion={{
            latitude: 20.5937,
            longitude: 78.9629,
            latitudeDelta: 15,
            longitudeDelta: 15,
          }}
        >
          {/* Drone Path Line */}
          <Polyline
            coordinates={filteredPoints.map(point => ({
              latitude: point.latitude,
              longitude: point.longitude,
            }))}
            strokeColor="#3498db" // Blue line
            strokeWidth={3}
          />

          {/* Markers */}
          {filteredPoints.map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              pinColor={getDiseaseColor(point.diseaseType, point.severity)}
              onPress={() => setSelectedPoint(point)}
            >
              <Callout tooltip>
                <View style={styles.calloutView}>
                  <Text style={styles.calloutTitle}>{point.diseaseType}</Text>
                  <Text style={styles.calloutText}>Severity: {point.severity}</Text>
                  <Text style={styles.calloutText}>Tap for details</Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {/* Circles around Diseased Points */}
          {showAffectedAreas && filteredPoints.map((point) => (
            point.diseaseType !== 'Healthy' && (
              <Circle
                key={`circle-${point.id}`}
                center={{ latitude: point.latitude, longitude: point.longitude }}
                radius={getCircleRadius(point.severity)}
                strokeColor={`${getDiseaseColor(point.diseaseType, point.severity)}80`}
                fillColor={`${getDiseaseColor(point.diseaseType, point.severity)}40`}
                strokeWidth={1}
              />
            )
          ))}

          {/* Heatmap for Disease Concentration */}
          {showHeatmap && (
            <Heatmap
              points={filteredPoints
                .filter(p => p.diseaseType !== 'Healthy')
                .map(p => ({
                  latitude: p.latitude,
                  longitude: p.longitude,
                  weight: p.severity === 'High' ? 1 : p.severity === 'Medium' ? 0.7 : 0.4,
                }))
              }
              radius={30}
              opacity={0.5}
              gradient={{
                colors: ["green", "yellow", "orange", "red"],
                startPoints: [0.01, 0.25, 0.5, 0.75],
                colorMapSize: 256,
              }}
            />
          )}
        </MapView>

        {/* Control Panel */}
        <View style={styles.controlPanel}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.controlButton, viewMode === 'standard' && styles.activeButton]} 
              onPress={() => setViewMode('standard')}
            >
              <Text style={styles.controlButtonText}>Map</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, viewMode === 'satellite' && styles.activeButton]} 
              onPress={() => setViewMode('satellite')}
            >
              <Text style={styles.controlButtonText}>Satellite</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, viewMode === 'hybrid' && styles.activeButton]} 
              onPress={() => setViewMode('hybrid')}
            >
              <Text style={styles.controlButtonText}>Hybrid</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, showHeatmap && styles.activeButton]} 
              onPress={() => setShowHeatmap(!showHeatmap)}
            >
              <Text style={styles.controlButtonText}>Heatmap</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, showAffectedAreas && styles.activeButton]} 
              onPress={() => setShowAffectedAreas(!showAffectedAreas)}
            >
              <Text style={styles.controlButtonText}>Affected Areas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, filterMode === 'all' && styles.activeButton]} 
              onPress={() => setFilterMode('all')}
            >
              <Text style={styles.controlButtonText}>Show All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, filterMode === 'diseased' && styles.activeButton]} 
              onPress={() => setFilterMode('diseased')}
            >
              <Text style={styles.controlButtonText}>Diseased Only</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, filterMode === 'healthy' && styles.activeButton]} 
              onPress={() => setFilterMode('healthy')}
            >
              <Text style={styles.controlButtonText}>Healthy Only</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Legend Panel */}
        <View style={styles.legendPanel}>
          <Text style={styles.legendTitle}>Disease Severity</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
            <Text style={styles.legendText}>High</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'orange' }]} />
            <Text style={styles.legendText}>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'yellow' }]} />
            <Text style={styles.legendText}>Low</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
            <Text style={styles.legendText}>Healthy</Text>
          </View>
        </View>

        {/* Refresh Button */}
        <TouchableOpacity style={styles.refreshButton} onPress={loadPoints}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>

        {/* Detail Modal */}
        {selectedPoint && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={!!selectedPoint}
            onRequestClose={() => setSelectedPoint(null)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setSelectedPoint(null)}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                
                <Text style={styles.modalTitle}>
                  {selectedPoint.diseaseType}
                </Text>
                
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: getDiseaseColor(selectedPoint.diseaseType, selectedPoint.severity) }]} />
                  <Text style={styles.statusText}>
                    {selectedPoint.diseaseType === 'Healthy' ? 'Healthy' : `${selectedPoint.severity} Severity`}
                  </Text>
                </View>
                
                <Image
                  source={{ uri: selectedPoint.imageUrl }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                
                <ScrollView style={styles.detailsScroll}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date & Time:</Text>
                    <Text style={styles.detailValue}>{formatDate(selectedPoint.timestamp)}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>
                      {selectedPoint.latitude.toFixed(6)}, {selectedPoint.longitude.toFixed(6)}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Affected Area:</Text>
                    <Text style={styles.detailValue}>{selectedPoint.affectedArea}</Text>
                  </View>
                  
                  {selectedPoint.diseaseType !== 'Healthy' && (
                    <>
                      <Text style={styles.recommendationTitle}>Recommended Action:</Text>
                      <Text style={styles.recommendationText}>
                        {selectedPoint.recommendedAction}
                      </Text>
                    </>
                  )}
                </ScrollView>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>
                    {selectedPoint.diseaseType === 'Healthy' 
                      ? 'Mark for Follow-up' 
                      : 'Mark as Treated'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  controlPanel: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    height: 50,
  },
  controlButton: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#3498db',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  legendPanel: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  legendTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3498db',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  calloutView: {
    width: 160,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    height: height * 0.7,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#e74c3c',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 10,
    marginBottom: 5,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  detailsScroll: {
    flex: 1,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    width: 100,
    fontWeight: '500',
    fontSize: 14,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
  },
  recommendationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  actionButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MapScreen;