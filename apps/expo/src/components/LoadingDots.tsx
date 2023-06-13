import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  TextStyle,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

interface LoadingDotsProps {
  size?: number;
  color?: string;
  dotStyle?: StyleProp<ViewStyle>;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 10,
  color = "black",
  dotStyle,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const dotSize = size;
  const dotColor = color;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const animateDots = () => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]),
    );
  };

  useEffect(() => {
    animationRef.current = animateDots();
    animationRef.current.start();
    return () => {
      animationRef.current && animationRef.current.stop();
    };
  }, []);

  const interpolateDots = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dotSize * 2],
  });

  const dotStyleDefault: StyleProp<ViewStyle> = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: dotColor,
    marginHorizontal: dotSize / 2,
    transform: [{ translateX: interpolateDots as unknown as number }],
  };

  const combinedDotStyle: StyleProp<ViewStyle> = [dotStyleDefault, dotStyle];

  return (
    <View style={{ flexDirection: "row" }}>
      <Animated.View style={combinedDotStyle} />
      <Animated.View style={combinedDotStyle} />
      <Animated.View style={combinedDotStyle} />
    </View>
  );
};

export default LoadingDots;
