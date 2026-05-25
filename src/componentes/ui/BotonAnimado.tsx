import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// Convertimos el Pressable nativo en un componente que Reanimated pueda animar
const PressableAnimado = Animated.createAnimatedComponent(Pressable);

interface BotonAnimadoProps extends PressableProps {
  children: React.ReactNode;
  estilo?: StyleProp<ViewStyle>;
}

export default function BotonAnimado({ children, estilo, ...props }: BotonAnimadoProps) {
  // El valor inicial de escala es 1 (tamaño normal)
  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => {
    return {
      transform: [{ scale: escala.value }],
    };
  });

  return (
    <PressableAnimado
      {...props}
      style={[estilo, estiloAnimado]}
      onPressIn={(e) => {
        // Al tocar, se encoge al 95% de su tamaño
        escala.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        if (props.onPressIn) props.onPressIn(e);
      }}
      onPressOut={(e) => {
        // Al soltar, rebota de regreso a su tamaño original
        escala.value = withSpring(1, { damping: 15, stiffness: 300 });
        if (props.onPressOut) props.onPressOut(e);
      }}
    >
      {children}
    </PressableAnimado>
  );
}