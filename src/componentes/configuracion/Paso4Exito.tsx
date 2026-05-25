// src/componentes/configuracion/Paso4Exito.tsx
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { CheckCircle } from "lucide-react-native";
import { Colores, Tipografia, Espaciado } from "../../constantes/tema";
import BotonAnimado from "../ui/BotonAnimado";
import { useRouter } from "expo-router";

interface Props {
  estadoEnvio: "cargando" | "exito";
}

export default function Paso4Exito({ estadoEnvio }: Props) {
  const router = useRouter();

  return (
    <View style={estilos.contenedorPaso}>
      {estadoEnvio === "cargando" ? (
        <>
          <ActivityIndicator size="large" color={Colores.botonEncendido} />
          <Text
            style={[estilos.textoInstruccion, { marginTop: Espaciado.mediano }]}
          >
            Transfiriendo credenciales a la casa...
          </Text>
        </>
      ) : (
        <>
          <View style={[estilos.circuloIcono, { backgroundColor: "#4CAF50" }]}>
            <CheckCircle color="#FFF" size={48} />
          </View>
          <Text
            style={[
              estilos.textoInstruccion,
              { fontSize: Tipografia.tamanos.titulo },
            ]}
          >
            ¡Configuración Exitosa!
          </Text>
          <BotonAnimado
            estilo={estilos.botonPrimario}
            onPress={() => router.push("/")}
          >
            <Text style={estilos.textoBotonPrimario}>Ir al Inicio</Text>
          </BotonAnimado>
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorPaso: { alignItems: "center", width: "100%" },
  circuloIcono: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Espaciado.grande,
  },
  textoInstruccion: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.cuerpo,
    textAlign: "center",
    marginBottom: Espaciado.mediano,
    lineHeight: 22,
  },
  botonPrimario: {
    flexDirection: "row",
    backgroundColor: Colores.botonEncendido,
    width: "100%",
    padding: Espaciado.mediano,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotonPrimario: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
});
