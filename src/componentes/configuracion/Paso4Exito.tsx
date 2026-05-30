import { useRouter } from "expo-router";
import { CheckCircle, XCircle } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colores, Espaciado, Tipografia } from "../../constantes/tema";
import BotonAnimado from "../ui/BotonAnimado";

interface Props {
  estadoEnvio: "cargando" | "exito" | "fallo";
  alReintentar: () => void;
}

export default function Paso4Exito({ estadoEnvio, alReintentar }: Props) {
  const router = useRouter();

  if (estadoEnvio === "cargando") {
    return (
      <View style={estilos.contenedorPaso}>
        <ActivityIndicator size="large" color={Colores.botonEncendido} />
        <Text
          style={[estilos.textoInstruccion, { marginTop: Espaciado.mediano }]}
        >
          Conectando la casa al internet...
        </Text>
        <Text style={estilos.textoSecundario}>
          Esto puede tardar hasta 15 segundos.
        </Text>
      </View>
    );
  }

  if (estadoEnvio === "fallo") {
    return (
      <View style={estilos.contenedorPaso}>
        <View
          style={[
            estilos.circuloIcono,
            { backgroundColor: "rgba(244, 67, 54, 0.1)" },
          ]}
        >
          <XCircle color="#F44336" size={64} />
        </View>
        <Text
          style={[
            estilos.textoInstruccion,
            { fontSize: Tipografia.tamanos.titulo },
          ]}
        >
          Conexión Fallida
        </Text>
        <Text
          style={[
            estilos.textoSecundario,
            { marginBottom: Espaciado.extragrande },
          ]}
        >
          No se pudo conectar a la red WiFi. Verifica que la contraseña sea
          correcta y que la red sea de 2.4GHz.
        </Text>

        <BotonAnimado estilo={estilos.botonReintentar} onPress={alReintentar}>
          <Text style={estilos.textoBotonReintentar}>Intentar de nuevo</Text>
        </BotonAnimado>
      </View>
    );
  }

  // Estado: "exito"
  return (
    <View style={estilos.contenedorPaso}>
      <View
        style={[
          estilos.circuloIcono,
          { backgroundColor: "rgba(76, 175, 80, 0.1)" },
        ]}
      >
        <CheckCircle color="#4CAF50" size={64} />
      </View>
      <Text
        style={[
          estilos.textoInstruccion,
          { fontSize: Tipografia.tamanos.titulo },
        ]}
      >
        ¡Conexión Exitosa!
      </Text>
      <Text
        style={[
          estilos.textoSecundario,
          { marginBottom: Espaciado.extragrande },
        ]}
      >
        La casa inteligente ya está en línea.
      </Text>
      <BotonAnimado
        estilo={estilos.botonPrimario}
        onPress={() => router.push("/")}
      >
        <Text style={estilos.textoBotonPrimario}>Ir al Inicio</Text>
      </BotonAnimado>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorPaso: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    flex: 1,
  },
  circuloIcono: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Espaciado.grande,
  },
  textoInstruccion: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.cuerpo,
    textAlign: "center",
    marginBottom: Espaciado.pequeno,
    fontWeight: Tipografia.pesos.negrita,
  },
  textoSecundario: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.cuerpo,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: Espaciado.grande,
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
  botonReintentar: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#F44336",
    width: "100%",
    padding: Espaciado.mediano,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotonReintentar: {
    color: "#F44336",
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
});
