// AdminLogin.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Admin credentials
const ADMIN_EMAIL = "adminams@rguktrkv.ac.in";
const ADMIN_PASSWORD = "#Admin@CBS#123";

export default function AdminLogin() {
  const router = useRouter();

  // UI state
  const [showCard, setShowCard] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Animations
  const logoScale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.8)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardShake = useRef(new Animated.Value(0)).current;

  // Pulsing glow
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1600, useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration: 1600, useNativeDriver: false }),
      ])
    ).start();
  }, [glow]);

  // Open login card
  const openCard = () => {
    setErrorMsg("");
    Animated.sequence([
      Animated.timing(logoScale, { toValue: 0.92, duration: 160, useNativeDriver: true }),
      Animated.timing(logoScale, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setShowCard(true);
      cardScale.setValue(0.8);
      cardOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(cardScale, { toValue: 1, duration: 360, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 360, useNativeDriver: true }),
      ]).start();
    });
  };

  // Close login card
  const closeCard = () => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 0.8, duration: 280, useNativeDriver: true }),
    ]).start(() => {
      setShowCard(false);
      setErrorMsg("");
      setEmail("");
      setPassword("");
    });
  };

  // Shake animation for invalid login
  const shakeCard = () => {
    cardShake.setValue(0);
    Animated.sequence([
      Animated.timing(cardShake, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(cardShake, { toValue: -1, duration: 80, useNativeDriver: true }),
      Animated.timing(cardShake, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(cardShake, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  // Handle login submit
  const handleSubmit = () => {
    setErrorMsg("");
    Keyboard.dismiss();

    const emailOK = email.trim().toLowerCase() === ADMIN_EMAIL;
    const passOK = password === ADMIN_PASSWORD;

    if (emailOK && passOK) {
      // Navigate to admin dashboard (Expo Router)
      router.push("/admin/dashboard");
    } else {
      setErrorMsg("Invalid email or password. Please try again.");
      shakeCard();
    }
  };

  // Glow effects
  const auraOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.5] });
  const auraScale = glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  // Shake transform
  const shakeInterpolation = cardShake.interpolate({
    inputRange: [-1, -0.5, 0, 0.5, 1],
    outputRange: [-8, -4, 0, 4, 8],
  });

  return (
    <LinearGradient colors={["#4B0000", "#8B0000", "#C62828"]} style={styles.root}>
      <View style={styles.centerArea}>
        {/* Aura / glow behind logo */}
        <Animated.View
          style={[styles.aura, { opacity: auraOpacity, transform: [{ scale: auraScale }], pointerEvents: "none" }]}
        />

        {/* Logo */}
        <Animated.View style={[styles.logoWrap, { transform: [{ scale: logoScale }] }]}>
          <TouchableOpacity activeOpacity={0.85} onPress={openCard}>
            <Image
              source={require("../../assets/images/RGUKTLOGO.png")}
              style={styles.logo}
            />
          </TouchableOpacity>
          <Text style={styles.brandText}>AMS - RGUKT RKV</Text>
        </Animated.View>

        {/* Login card */}
        {showCard && (
          <Animated.View
            style={[
              styles.cardContainer,
              {
                opacity: cardOpacity,
                transform: [
                  { scale: cardScale },
                  { translateX: shakeInterpolation },
                ],
              },
            ]}
          >
            <BlurView intensity={85} tint="light" style={styles.cardInner}>
              <Text style={styles.cardTitle}>Admin Login</Text>
              <Text style={styles.cardSub}>Enter RGUKT admin credentials</Text>

              <TextInput
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.9}>
                <Text style={styles.submitText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={closeCard}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centerArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "#8B0000",
  },
  aura: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#fff",
  },
  logoWrap: { alignItems: "center", zIndex: 1 },
  logo: { width: 220, height: 220, resizeMode: "contain", borderRadius: 110 },
  brandText: { color: "#fff", marginTop: 10, fontSize: 18, fontWeight: "700", letterSpacing: 0.6 },

  cardContainer: {
    position: "absolute",
    width: Math.min(440, width * 0.84),
    maxWidth: 440,
    alignItems: "center",
    zIndex: 4,
    top: "42%",
  },
  cardInner: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },

  cardTitle: { color: "#8B0000", fontSize: 22, fontWeight: "700", marginBottom: 6 },
  cardSub: { color: "#333", fontSize: 14, marginBottom: 14, textAlign: "center" },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    marginBottom: 12,
    color: "#333",
    backgroundColor: "#f7f7f7",
  },

  errorText: { color: "#ff3333", marginBottom: 8, textAlign: "center" },

  submitBtn: {
    width: "100%",
    backgroundColor: "#8B0000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  submitText: { color: "#fff", fontWeight: "700" },

  cancelBtn: { marginTop: 12 },
  cancelText: { color: "#333", textDecorationLine: "underline", fontWeight: "600" },
});
