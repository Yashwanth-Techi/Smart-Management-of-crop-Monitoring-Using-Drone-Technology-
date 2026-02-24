import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  Animated,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Content data for About section
const organicFarmingData = {
  // 1. Videos to promote organic farming
  promotionalVideos: {
    title: "Videos to Promote Organic Farming",
    description:
      "Learn about the benefits and methods of organic farming through these educational videos.",
    videos: [
      {
        id: 1,
        title: "Why Organic Farming Matters",
        description:
          "Understand the ecological importance and health benefits of organic farming practices",
        url: "https://www.youtube.com/watch?v=lRyXlvIJFWI",
        thumbnail:
          "https://cdn.create.vista.com/downloads/0dc4dd54-bfa8-4e7b-a853-a53eae2318b1_1024.jpeg",
      },
      {
        id: 2,
        title: "Transition to Organic Farming",
        description:
          "Step-by-step guide to converting conventional farmland to organic production",
        url: "https://www.youtube.com/watch?v=_w9B8fYlaLw",
        thumbnail:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ6KlmAoKB1oNa1IQDXSHzheNop8oDZxwAcQ&s",
      },
      {
        id: 3,
        title: "Sustainable Farm Management",
        description:
          "Learn sustainable practices for long-term organic farm management",
        url: "https://www.youtube.com/watch?v=iloAQmroRK0",
        thumbnail:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Dbt8EV129GSF2CT_AZkcTsStrEt-EZHTRg&s",
      },
    ],
    headerImage:
      "https://e7.pngegg.com/pngimages/943/785/png-clipart-farm-under-cloudy-sky-agriculture-farmer-organic-farming-agribusiness-farm-company-cloud-thumbnail.png",
  },

  // 2. Organic vs Chemical farming comparison
  farmingComparison: {
    title: "Organic vs Chemical Farming",
    description:
      "A detailed comparison of organic and chemical farming methods and their impacts.",
    headerImage:
      "https://pangti.com/wp-content/uploads/2020/05/Organic-versus-chemical-farming-18-key-differences.jpg",

    // Pros and cons
    prosAndCons: {
      organic: {
        pros: [
          "Environmentally sustainable and builds soil health",
          "Produces food free from synthetic chemicals",
          "Supports biodiversity and ecosystem services",
          "Better for farmer health (no exposure to chemical pesticides)",
          "Typically commands premium market prices",
        ],
        cons: [
          "Often requires more labor and management",
          "May have lower yields in some crop systems",
          "Higher initial costs during transition period",
          "More complex pest management strategies",
          "Certification process can be costly and paperwork-intensive",
        ],
      },
      chemical: {
        pros: [
          "Generally higher yields in short-term",
          "Lower labor requirements",
          "Faster-acting pest and disease control",
          "Lower initial production costs",
          "More predictable production systems",
        ],
        cons: [
          "Degrades soil health over time",
          "Pollution of water systems through runoff",
          "Negative impacts on beneficial insects and biodiversity",
          "Health risks to farmers and farm workers",
          "External costs not reflected in food prices",
        ],
      },
    },

    // Price comparison
    priceComparison: {
      title: "Price Comparison",
      details: [
        "Initial setup costs for organic farming are 20-40% higher",
        "Operating costs typically lower for organic after 3-5 years",
        "Organic produces higher net returns due to premium prices",
        "Chemical farming has hidden environmental and health costs",
        "Long-term profitability often favors organic systems",
      ],
      image: "https://www.slideteam.net/wp/wp-content/uploads/2023/03/Product-comparison-chart-with-service-and-pricing.png",
    },

    // Video about comparison
    video: {
      title: "Understanding Farming Approaches",
      description:
        "Comprehensive comparison of organic vs chemical farming methods",
      url: "https://www.youtube.com/watch?v=yzs-LOJ1w08",
      thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReyyBJ2CsbQEiNUXqE8DWddFwG0Orc_2Kp3A&s",
    },
  },

  // 3. Chemical farming effects
  chemicalEffects: {
    title: "Chemical Farming Effects",
    description:
      "The impacts of conventional chemical farming on soil, water, health, and ecosystems.",
    headerImage:
      "https://www.shutterstock.com/image-photo/tractor-spraying-pesticides-on-corn-600nw-2155752301.jpg",
    effects: [
      {
        category: "Soil Health",
        impacts: [
          "Depletes soil organic matter and fertility",
          "Disrupts soil microbial communities",
          "Increases soil erosion and degradation",
          "Reduces water retention capacity",
          "Creates dependency on synthetic inputs",
        ],
        icon: "earth",
      },
      {
        category: "Water Systems",
        impacts: [
          "Contaminates groundwater with nitrates",
          "Creates harmful algal blooms in waterways",
          "Affects aquatic organisms and fish populations",
          "Reduces drinking water quality",
          "Increases water treatment costs",
        ],
        icon: "water",
      },
      {
        category: "Human Health",
        impacts: [
          "Pesticide exposure linked to various health conditions",
          "Residues remain in food products",
          "Farm worker exposure causes occupational illness",
          "Antibiotic resistance from livestock production",
          "Reduced nutrient density in some crops",
        ],
        icon: "body",
      },
      {
        category: "Ecosystem",
        impacts: [
          "Reduces biodiversity in agricultural landscapes",
          "Harms pollinators, especially bees",
          "Disrupts natural pest-predator relationships",
          "Contributes to greenhouse gas emissions",
          "Creates pesticide-resistant 'super pests'",
        ],
        icon: "leaf",
      },
    ],
    video: {
      title: "The Real Cost of Chemical Agriculture",
      description: "Examining the hidden impacts of chemical farming practices",
      url: "https://www.youtube.com/watch?v=lH_8N9HRsys",
      thumbnail:
        "https://study.com/cimages/videopreview/videopreview-full/h0dqc2hlc6.jpg",
    },
  },

  // 4. Organic pesticides
  organicPesticides: {
    title: "Common Organic Pesticides",
    description:
      "Natural and environmentally-friendly pest control solutions for organic farmers.",
    headerImage:
      "https://media.gettyimages.com/id/1508564030/video/4k-closeup-shot-of-woman-hand-spraying-fertilizer-for-vegetable.jpg?s=640x640&k=20&c=vRI6qRWE9Ca4W0zpKuL4czm89jD1sbUxcKCjc5flkp4=",
    pesticides: [
      {
        name: "Neem Oil",
        source: "Extracted from seeds of the neem tree",
        uses: "Controls aphids, mealybugs, mites, whiteflies, and many fungal diseases",
        application:
          "Dilute 2-4 tablespoons per gallon of water, spray on plants every 7-14 days",
        safety:
          "Low toxicity to mammals and beneficial insects when used correctly",
        image: "https://via.placeholder.com/150x150?text=Neem+Oil",
      },
      {
        name: "Bacillus thuringiensis (Bt)",
        source: "Naturally occurring soil bacteria",
        uses: "Controls caterpillars, worms, and larvae of moths and butterflies",
        application:
          "Mix according to label instructions, apply when larvae are young",
        safety:
          "Target-specific, harmless to humans, animals, and most beneficial insects",
        image: "https://via.placeholder.com/150x150?text=Bt",
      },
      {
        name: "Pyrethrin",
        source: "Extracted from chrysanthemum flowers",
        uses: "Broad-spectrum control of many insects including beetles, leafhoppers, aphids",
        application:
          "Apply as directed on label, most effective in evening hours",
        safety:
          "Breaks down rapidly in sunlight, toxic to bees and aquatic organisms",
        image: "https://via.placeholder.com/150x150?text=Pyrethrin",
      },
      {
        name: "Diatomaceous Earth",
        source: "Fossilized remains of diatoms (type of algae)",
        uses: "Controls crawling insects like ants, slugs, and many soil pests",
        application:
          "Apply as dry powder around plants or mix with water as spray",
        safety:
          "Non-toxic to mammals but can irritate lungs if inhaled, harmless to earthworms",
        image: "https://via.placeholder.com/150x150?text=Diatomaceous+Earth",
      },
      {
        name: "Insecticidal Soap",
        source: "Potassium salts of fatty acids",
        uses: "Controls soft-bodied insects like aphids, whiteflies, and spider mites",
        application:
          "Dilute as directed and spray directly on pests, requires contact to be effective",
        safety: "Low toxicity, breaks down quickly leaving no residue",
        image: "https://via.placeholder.com/150x150?text=Insecticidal+Soap",
      },
      {
        name: "Garlic and Hot Pepper Spray",
        source: "Homemade from garlic bulbs and hot peppers",
        uses: "Repels many insects including aphids, caterpillars, and beetles",
        application:
          "Blend ingredients with water, strain, add soap as surfactant, and spray plants",
        safety:
          "Non-toxic to humans and beneficial insects, may need frequent reapplication",
        image: "https://via.placeholder.com/150x150?text=Garlic+Spray",
      },
    ],
    video: {
      title: "Natural Pest Control Methods",
      description: "How to effectively use organic pesticides in your garden",
      url: "https://www.youtube.com/watch?v=lH_8N9HRsys&t=1s",
      thumbnail:
        "https://media.gettyimages.com/id/1922976745/video/drone-pesticide-and-nature-with-tractor-on-farm-for-fertilizer-pest-control-and.jpg?s=640x640&k=20&c=BLE9BQWPrvsJQiIPMz3f9EUxRsFMxtQmjoK2s0WvgO8=",
    },
  },
};

const AboutScreen = () => {
  const [activeSection, setActiveSection] = useState("promotionalVideos");
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const scrollToSection = (sectionKey) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Change section
      setActiveSection(sectionKey);

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Scroll to top
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
      }
    });
  };

  const openVideo = (url) => {
    Linking.openURL(url);
  };

  const renderPromotionalVideos = () => {
    const section = organicFarmingData.promotionalVideos;

    return (
      <View style={styles.sectionContainer}>
        <Animatable.Text
          style={styles.sectionTitle}
          animation="fadeInDown"
          duration={1000}
        >
          {section.title}
        </Animatable.Text>

        <Animatable.Text
          style={styles.sectionDescription}
          animation="fadeIn"
          delay={300}
          duration={1000}
        >
          {section.description}
        </Animatable.Text>

        <Animatable.Image
          source={{ uri: section.headerImage }}
          style={styles.headerImage}
          animation="fadeIn"
          delay={500}
          duration={1000}
        />

        <Text style={styles.subSectionTitle}>Educational Videos</Text>

        {section.videos.map((video, index) => (
          <Animatable.View
            key={video.id}
            style={styles.videoCard}
            animation="fadeInUp"
            delay={700 + index * 200}
            duration={800}
          >
            <TouchableOpacity onPress={() => openVideo(video.url)}>
              <Image
                source={{ uri: video.thumbnail }}
                style={styles.videoThumbnail}
              />
              <View style={styles.playButtonOverlay}>
                <Ionicons name="play-circle" size={50} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.videoDetails}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoDescription}>{video.description}</Text>
              <TouchableOpacity
                style={styles.watchButton}
                onPress={() => openVideo(video.url)}
              >
                <Text style={styles.watchButtonText}>Watch Now</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        ))}
      </View>
    );
  };

  const renderFarmingComparison = () => {
    const section = organicFarmingData.farmingComparison;

    return (
      <View style={styles.sectionContainer}>
        <Animatable.Text
          style={styles.sectionTitle}
          animation="fadeInDown"
          duration={1000}
        >
          {section.title}
        </Animatable.Text>

        <Animatable.Text
          style={styles.sectionDescription}
          animation="fadeIn"
          delay={300}
          duration={1000}
        >
          {section.description}
        </Animatable.Text>

        <Animatable.Image
          source={{ uri: section.headerImage }}
          style={styles.headerImage}
          animation="fadeIn"
          delay={500}
          duration={1000}
        />

        <Animatable.View
          style={styles.comparisonContainer}
          animation="fadeIn"
          delay={700}
          duration={800}
        >
          <Text style={styles.subSectionTitle}>Pros & Cons</Text>

          <View style={styles.twoColumnLayout}>
            <View style={[styles.comparisonColumn, styles.organicColumn]}>
              <Text style={styles.columnTitle}>Organic Farming</Text>

              <Text style={styles.listTitle}>Pros:</Text>
              {section.prosAndCons.organic.pros.map((item, index) => (
                <View key={`organic-pro-${index}`} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#27ae60" />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}

              <Text style={styles.listTitle}>Cons:</Text>
              {section.prosAndCons.organic.cons.map((item, index) => (
                <View key={`organic-con-${index}`} style={styles.listItem}>
                  <Ionicons name="alert-circle" size={18} color="#e74c3c" />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.comparisonColumn, styles.chemicalColumn]}>
              <Text style={styles.columnTitle}>Chemical Farming</Text>

              <Text style={styles.listTitle}>Pros:</Text>
              {section.prosAndCons.chemical.pros.map((item, index) => (
                <View key={`chemical-pro-${index}`} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#27ae60" />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}

              <Text style={styles.listTitle}>Cons:</Text>
              {section.prosAndCons.chemical.cons.map((item, index) => (
                <View key={`chemical-con-${index}`} style={styles.listItem}>
                  <Ionicons name="alert-circle" size={18} color="#e74c3c" />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animatable.View>

        <Animatable.View
          style={styles.priceComparisonContainer}
          animation="fadeIn"
          delay={900}
          duration={800}
        >
          <Text style={styles.subSectionTitle}>
            {section.priceComparison.title}
          </Text>
          <Image
            source={{ uri: section.priceComparison.image }}
            style={styles.priceComparisonImage}
          />

          {section.priceComparison.details.map((item, index) => (
            <View key={`price-${index}`} style={styles.priceComparisonItem}>
              <Ionicons name="cash-outline" size={22} color="#3498db" />
              <Text style={styles.priceComparisonText}>{item}</Text>
            </View>
          ))}
        </Animatable.View>

        <Animatable.View
          style={styles.videoCard}
          animation="fadeInUp"
          delay={1100}
          duration={800}
        >
          <TouchableOpacity onPress={() => openVideo(section.video.url)}>
            <Image
              source={{ uri: section.video.thumbnail }}
              style={styles.videoThumbnail}
            />
            <View style={styles.playButtonOverlay}>
              <Ionicons name="play-circle" size={50} color="white" />
            </View>
          </TouchableOpacity>
          <View style={styles.videoDetails}>
            <Text style={styles.videoTitle}>{section.video.title}</Text>
            <Text style={styles.videoDescription}>
              {section.video.description}
            </Text>
            <TouchableOpacity
              style={styles.watchButton}
              onPress={() => openVideo(section.video.url)}
            >
              <Text style={styles.watchButtonText}>Watch Now</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    );
  };

  const renderChemicalEffects = () => {
    const section = organicFarmingData.chemicalEffects;

    return (
      <View style={styles.sectionContainer}>
        <Animatable.Text
          style={styles.sectionTitle}
          animation="fadeInDown"
          duration={1000}
        >
          {section.title}
        </Animatable.Text>

        <Animatable.Text
          style={styles.sectionDescription}
          animation="fadeIn"
          delay={300}
          duration={1000}
        >
          {section.description}
        </Animatable.Text>

        <Animatable.Image
          source={{ uri: section.headerImage }}
          style={styles.headerImage}
          animation="fadeIn"
          delay={500}
          duration={1000}
        />

        {section.effects.map((effect, index) => (
          <Animatable.View
            key={`effect-${index}`}
            style={styles.effectCard}
            animation="fadeInUp"
            delay={700 + index * 200}
            duration={800}
          >
            <View style={styles.effectHeader}>
              <Ionicons name={effect.icon} size={24} color="#e74c3c" />
              <Text style={styles.effectTitle}>{effect.category}</Text>
            </View>

            {effect.impacts.map((impact, idx) => (
              <View key={`impact-${idx}`} style={styles.impactItem}>
                <Ionicons name="warning" size={16} color="#e67e22" />
                <Text style={styles.impactText}>{impact}</Text>
              </View>
            ))}
          </Animatable.View>
        ))}

        <Animatable.View
          style={styles.videoCard}
          animation="fadeInUp"
          delay={1500}
          duration={800}
        >
          <TouchableOpacity onPress={() => openVideo(section.video.url)}>
            <Image
              source={{ uri: section.video.thumbnail }}
              style={styles.videoThumbnail}
            />
            <View style={styles.playButtonOverlay}>
              <Ionicons name="play-circle" size={50} color="white" />
            </View>
          </TouchableOpacity>
          <View style={styles.videoDetails}>
            <Text style={styles.videoTitle}>{section.video.title}</Text>
            <Text style={styles.videoDescription}>
              {section.video.description}
            </Text>
            <TouchableOpacity
              style={styles.watchButton}
              onPress={() => openVideo(section.video.url)}
            >
              <Text style={styles.watchButtonText}>Watch Now</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    );
  };

  const renderOrganicPesticides = () => {
    const section = organicFarmingData.organicPesticides;

    return (
      <View style={styles.sectionContainer}>
        <Animatable.Text
          style={styles.sectionTitle}
          animation="fadeInDown"
          duration={1000}
        >
          {section.title}
        </Animatable.Text>

        <Animatable.Text
          style={styles.sectionDescription}
          animation="fadeIn"
          delay={300}
          duration={1000}
        >
          {section.description}
        </Animatable.Text>

        <Animatable.Image
          source={{ uri: section.headerImage }}
          style={styles.headerImage}
          animation="fadeIn"
          delay={500}
          duration={1000}
        />

        <View style={styles.pesticidesContainer}>
          {section.pesticides.map((pesticide, index) => (
            <Animatable.View
              key={`pesticide-${index}`}
              style={styles.pesticideCard}
              animation="fadeInUp"
              delay={700 + index * 200}
              duration={800}
            >
              <Image
                source={{ uri: pesticide.image }}
                style={styles.pesticideImage}
              />
              <Text style={styles.pesticideName}>{pesticide.name}</Text>

              <View style={styles.pesticideDetail}>
                <Text style={styles.pesticideLabel}>Source:</Text>
                <Text style={styles.pesticideValue}>{pesticide.source}</Text>
              </View>

              <View style={styles.pesticideDetail}>
                <Text style={styles.pesticideLabel}>Uses:</Text>
                <Text style={styles.pesticideValue}>{pesticide.uses}</Text>
              </View>

              <View style={styles.pesticideDetail}>
                <Text style={styles.pesticideLabel}>Application:</Text>
                <Text style={styles.pesticideValue}>
                  {pesticide.application}
                </Text>
              </View>

              <View style={styles.pesticideDetail}>
                <Text style={styles.pesticideLabel}>Safety:</Text>
                <Text style={styles.pesticideValue}>{pesticide.safety}</Text>
              </View>
            </Animatable.View>
          ))}
        </View>

        <Animatable.View
          style={styles.videoCard}
          animation="fadeInUp"
          delay={1900}
          duration={800}
        >
          <TouchableOpacity onPress={() => openVideo(section.video.url)}>
            <Image
              source={{ uri: section.video.thumbnail }}
              style={styles.videoThumbnail}
            />
            <View style={styles.playButtonOverlay}>
              <Ionicons name="play-circle" size={50} color="white" />
            </View>
          </TouchableOpacity>
          <View style={styles.videoDetails}>
            <Text style={styles.videoTitle}>{section.video.title}</Text>
            <Text style={styles.videoDescription}>
              {section.video.description}
            </Text>
            <TouchableOpacity
              style={styles.watchButton}
              onPress={() => openVideo(section.video.url)}
            >
              <Text style={styles.watchButtonText}>Watch Now</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "promotionalVideos":
        return renderPromotionalVideos();
      case "farmingComparison":
        return renderFarmingComparison();
      case "chemicalEffects":
        return renderChemicalEffects();
      case "organicPesticides":
        return renderOrganicPesticides();
      default:
        return renderPromotionalVideos();
    }
  };

  return (
    <View style={styles.container}>
      {/* Navigation Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeSection === "promotionalVideos" && styles.activeTab,
          ]}
          onPress={() => scrollToSection("promotionalVideos")}
        >
          <Ionicons
            name="play-circle"
            size={22}
            color={activeSection === "promotionalVideos" ? "#fff" : "#555"}
          />
          <Text
            style={[
              styles.tabText,
              activeSection === "promotionalVideos" && styles.activeTabText,
            ]}
          >
            Organic Farming Videos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeSection === "farmingComparison" && styles.activeTab,
          ]}
          onPress={() => scrollToSection("farmingComparison")}
        >
          <Ionicons
            name="git-compare"
            size={22}
            color={activeSection === "farmingComparison" ? "#fff" : "#555"}
          />
          <Text
            style={[
              styles.tabText,
              activeSection === "farmingComparison" && styles.activeTabText,
            ]}
          >
            Organic vs Chemical
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeSection === "chemicalEffects" && styles.activeTab,
          ]}
          onPress={() => scrollToSection("chemicalEffects")}
        >
          <Ionicons
            name="warning"
            size={22}
            color={activeSection === "chemicalEffects" ? "#fff" : "#555"}
          />
          <Text
            style={[
              styles.tabText,
              activeSection === "chemicalEffects" && styles.activeTabText,
            ]}
          >
            Chemical Effects
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeSection === "organicPesticides" && styles.activeTab,
          ]}
          onPress={() => scrollToSection("organicPesticides")}
        >
          <Ionicons
            name="leaf"
            size={22}
            color={activeSection === "organicPesticides" ? "#fff" : "#555"}
          />
          <Text
            style={[
              styles.tabText,
              activeSection === "organicPesticides" && styles.activeTabText,
            ]}
          >
            Organic Pesticides
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Content Area */}
      <Animated.ScrollView
        ref={scrollViewRef}
        style={[styles.contentContainer, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {renderActiveSection()}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  tabsContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginHorizontal: 15,
    backgroundColor: "#f0f0f0",
  },
  activeTab: {
    backgroundColor: "#27ae60",
  },
  tabText: {
    marginLeft: 8,
    fontWeight: "500",
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
  },
  contentContainer: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },
  sectionDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 20,
    lineHeight: 22,
  },
  headerImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
  },
  subSectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#34495e",
  },
  videoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoThumbnail: {
    width: "100%",
    height: 180,
  },
  playButtonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  videoDetails: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2c3e50",
  },
  videoDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 16,
    lineHeight: 20,
  },
  watchButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  watchButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  comparisonContainer: {
    marginBottom: 24,
  },
});

export default AboutScreen;
