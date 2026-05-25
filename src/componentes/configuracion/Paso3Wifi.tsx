// src/componentes/configuracion/Paso3Wifi.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Wifi } from "lucide-react-native";
import { Colores, Tipografia, Espaciado } from "../../constantes/tema";
import BotonAnimado from "../ui/BotonAnimado";

interface Props {
  escaneandoWifi: boolean;
  redesWifi: string[];
  abrirModalContrasena: (ssid: string) => void;
  iniciarEscaneoWifi: () => void;
}

export default function Paso3Wifi({
  escaneandoWifi,
  redesWifi,
  abrirModalContrasena,
  iniciarEscaneoWifi,
}: Props) {
  return (
    <View style={estilos.contenedorPaso}>
      <View style={estilos.circuloIcono}>
        <Wifi color={Colores.textoSecundario} size={48} />
      </View>
      <Text style={estilos.textoInstruccion}>
        Selecciona la red WiFi a la que se conectará la casa.
      </Text>

      {escaneandoWifi ? (
        <View style={estilos.contenedorCargando}>
          <ActivityIndicator size="large" color={Colores.botonEncendido} />
          <Text style={estilos.textoCargando}>
            Buscando redes disponibles...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ width: "100%", flexGrow: 0, maxHeight: "60%" }}
          showsVerticalScrollIndicator={false}
        >
          {redesWifi.map((ssid, index) => (
            <BotonAnimado
              key={index}
              estilo={estilos.tarjetaLista}
              onPress={() => abrirModalContrasena(ssid)}
            >
              <View style={estilos.filaDispositivo}>
                <Wifi color={Colores.textoSecundario} size={24} />
                <Text
                  style={[
                    estilos.textoNombreDispositivo,
                    { marginLeft: Espaciado.mediano },
                  ]}
                >
                  {ssid}
                </Text>
                {index === 0 && (
                  <Text style={estilos.textoRedSugerida}> (Sugerida)</Text>
                )}
              </View>
            </BotonAnimado>
          ))}
        </ScrollView>
      )}

      {!escaneandoWifi && (
        <BotonAnimado
          estilo={[estilos.botonSecundario, { marginTop: Espaciado.mediano }]}
          onPress={iniciarEscaneoWifi}
        >
          <Text style={estilos.textoBotonSecundario}>Actualizar Lista</Text>
        </BotonAnimado>
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
    backgroundColor: Colores.fondoTarjetasClaras,
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
  contenedorCargando: { alignItems: "center", marginTop: Espaciado.mediano },
  textoCargando: {
    color: Colores.textoPrincipal,
    marginTop: Espaciado.mediano,
    fontSize: Tipografia.tamanos.cuerpo,
  },
  tarjetaLista: {
    backgroundColor: Colores.fondoTarjetasClaras,
    width: "100%",
    padding: Espaciado.mediano,
    borderRadius: 16,
    marginBottom: Espaciado.pequeno,
  },
  filaDispositivo: { flexDirection: "row", alignItems: "center" },
  textoNombreDispositivo: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
  textoRedSugerida: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.etiqueta,
    fontWeight: Tipografia.pesos.negrita,
    opacity: 0.7,
  },
  botonSecundario: {
    backgroundColor: "transparent",
    width: "100%",
    padding: Espaciado.mediano,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colores.botonEncendido,
  },
  textoBotonSecundario: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
});
