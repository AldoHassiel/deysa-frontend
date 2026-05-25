// app/_layout.tsx

import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colores } from "../src/constantes/tema";
import { conectarMQTT } from "../src/servicios/servicio-mqtt";
import { ProveedorCasa } from "../src/estado/ContextoCasa";
import Toast from "react-native-toast-message";

export default function LayoutPrincipal() {
  useEffect(() => {
    conectarMQTT();
  }, []);

  return (
    <ProveedorCasa>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colores.fondoPrincipal },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="luces" />
        <Stack.Screen name="cochera" />
        <Stack.Screen name="pared-llorosa" />
        <Stack.Screen name="configuracion" />
      </Stack>
      <Toast position="bottom" bottomOffset={20} />
    </ProveedorCasa>
  );
}
