// src/componentes/configuracion/Paso1Bluetooth.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Bluetooth, Home } from "lucide-react-native";
import { Colores, Tipografia, Espaciado } from "../../constantes/tema";
import BotonAnimado from "../ui/BotonAnimado";
import { BluetoothDevice } from "react-native-bluetooth-classic";

interface Props {
  escaneandoBle: boolean;
  dispositivosEncontrados: BluetoothDevice[];
  dispositivoSeleccionado: BluetoothDevice | null;
  iniciarEscaneoBluetooth: () => void;
  conectarAlDispositivo: (dispositivo: BluetoothDevice) => void;
}

export default function Paso1Bluetooth({
  escaneandoBle,
  dispositivosEncontrados,
  dispositivoSeleccionado,
  iniciarEscaneoBluetooth,
  conectarAlDispositivo,
}: Props) {
  return (
    <View style={estilos.contenedorPaso}>
      <View style={estilos.circuloIcono}>
        <Bluetooth color={Colores.textoSecundario} size={48} />
      </View>
      <Text style={estilos.textoInstruccion}>
        Acércate a la caja de control para enlazar el sistema.
      </Text>

      {!escaneandoBle && (
        <BotonAnimado
          estilo={estilos.botonPrimario}
          onPress={iniciarEscaneoBluetooth}
        >
          <Text style={estilos.textoBotonPrimario}>Buscar Casa</Text>
        </BotonAnimado>
      )}

      {escaneandoBle && (
        <View style={estilos.contenedorCargando}>
          <ActivityIndicator size="large" color={Colores.botonEncendido} />
          <Text style={estilos.textoCargando}>
            {dispositivoSeleccionado
              ? "Conectando al puerto serial..."
              : "Buscando DeysaHouse..."}
          </Text>
        </View>
      )}

      {!escaneandoBle && dispositivosEncontrados.length > 0 && (
        <ScrollView
          style={{ width: "100%", marginTop: Espaciado.mediano }}
          showsVerticalScrollIndicator={false}
        >
          {dispositivosEncontrados.map((dispositivo) => {
            const esDeysaHouse = dispositivo.name === "DeysaHouse";

            if (esDeysaHouse) {
              return (
                <BotonAnimado
                  key={dispositivo.address}
                  estilo={estilos.tarjetaGigante}
                  onPress={() => conectarAlDispositivo(dispositivo)}
                >
                  <View style={estilos.circuloCasaGigante}>
                    <Home color={Colores.textoPrincipal} size={64} />
                  </View>
                  <Text style={estilos.textoNombreGigante}>
                    {dispositivo.name}
                  </Text>
                  <Text style={estilos.textoEstadoDispositivo}>
                    Toca para vincular a tu cuenta
                  </Text>
                </BotonAnimado>
              );
            }

            return (
              <BotonAnimado
                key={dispositivo.address}
                estilo={estilos.tarjetaLista}
                onPress={() => conectarAlDispositivo(dispositivo)}
              >
                <View style={estilos.filaDispositivo}>
                  <Bluetooth color={Colores.textoSecundario} size={24} />
                  <View style={estilos.textosDispositivo}>
                    <Text style={estilos.textoNombreDispositivo}>
                      {dispositivo.name}
                    </Text>
                    <Text style={estilos.textoEstadoDispositivo}>
                      {dispositivo.address}
                    </Text>
                  </View>
                </View>
              </BotonAnimado>
            );
          })}
        </ScrollView>
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
  textosDispositivo: { marginLeft: Espaciado.mediano },
  textoNombreDispositivo: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
  textoEstadoDispositivo: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.cuerpo,
    opacity: 0.8,
  },
  tarjetaGigante: {
    backgroundColor: Colores.fondoTarjetasClaras,
    width: "100%",
    padding: Espaciado.extragrande,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: Espaciado.pequeno,
    borderWidth: 3,
    borderColor: Colores.botonEncendido,
  },
  circuloCasaGigante: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colores.botonApagado,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Espaciado.mediano,
  },
  textoNombreGigante: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.titulo,
    fontWeight: Tipografia.pesos.negrita,
    marginBottom: 4,
  },
});
