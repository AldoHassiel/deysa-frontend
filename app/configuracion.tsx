// app/configuracion.tsx
import { useRouter } from "expo-router";
import { ChevronLeft, Eye, EyeOff, Wifi } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import BotonAnimado from "../src/componentes/ui/BotonAnimado";
import { Colores, Espaciado, Tipografia } from "../src/constantes/tema";

import AsyncStorage from "@react-native-async-storage/async-storage";
import RNBluetoothClassic, {
  BluetoothDevice,
} from "react-native-bluetooth-classic";
import Toast from "react-native-toast-message";
import WifiManager from "react-native-wifi-reborn";

import Paso1Bluetooth from "../src/componentes/configuracion/Paso1Bluetooth";
import Paso2Dashboard from "../src/componentes/configuracion/Paso2Dashboard";
import Paso3Wifi from "../src/componentes/configuracion/Paso3Wifi";
import Paso4Exito from "../src/componentes/configuracion/Paso4Exito";

export default function PantallaConfiguracion() {
  const router = useRouter();

  const [paso, setPaso] = useState<1 | 2 | 3 | 4>(1);

  // Estados
  const [escaneandoBle, setEscaneandoBle] = useState(false);
  const [dispositivosEncontrados, setDispositivosEncontrados] = useState<
    BluetoothDevice[]
  >([]);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] =
    useState<BluetoothDevice | null>(null);
  const [subscripcionLectura, setSubscripcionLectura] = useState<any>(null);
  const [redActualESP, setRedActualESP] = useState("Consultando...");

  const [escaneandoWifi, setEscaneandoWifi] = useState(false);
  const [redesWifi, setRedesWifi] = useState<string[]>([]);
  const [redSeleccionada, setRedSeleccionada] = useState("");
  const [contrasenaWifi, setContrasenaWifi] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState<
    "cargando" | "exito" | "fallo"
  >("cargando");

  useEffect(() => {
    iniciarFlujoInteligente();

    return () => {
      RNBluetoothClassic.cancelDiscovery();
      if (subscripcionLectura) subscripcionLectura.remove();
      if (dispositivoSeleccionado) dispositivoSeleccionado.disconnect();
    };
  }, []);

  const iniciarFlujoInteligente = async () => {
    const permisosOtorgados = await solicitarPermisos();
    if (!permisosOtorgados) {
      Toast.show({
        type: "error",
        text1: "Permisos denegados",
        text2: "Se requiere acceso al Bluetooth.",
      });
      return;
    }

    try {
      setEscaneandoBle(true);

      const emparejados = await RNBluetoothClassic.getBondedDevices();
      const deysaEmparejado = emparejados.find((d) => d.name === "DeysaHouse");

      if (deysaEmparejado) {
        await conectarAlDispositivo(deysaEmparejado);
      } else {
        await iniciarEscaneoBluetooth(false); // false = no pedir permisos de nuevo
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error de inicialización" });
      setEscaneandoBle(false);
    }
  };

  const solicitarPermisos = async () => {
    if (Platform.OS === "ios") return true;
    if (Platform.OS === "android") {
      const apiLevel = Platform.Version as number;
      if (apiLevel >= 31) {
        const concedidos = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return (
          concedidos["android.permission.BLUETOOTH_SCAN"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          concedidos["android.permission.ACCESS_FINE_LOCATION"] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const concedido = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return concedido === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return false;
  };

  const iniciarEscaneoBluetooth = async (pedirPermisos = true) => {
    if (pedirPermisos) {
      const permisos = await solicitarPermisos();
      if (!permisos) return;
    }

    try {
      setEscaneandoBle(true);
      setDispositivosEncontrados([]);

      const descubiertos = await RNBluetoothClassic.startDiscovery();
      const emparejados = await RNBluetoothClassic.getBondedDevices();

      const todosLosDispositivos = [...emparejados, ...descubiertos];
      const dispositivosUnicos = Array.from(
        new Set(todosLosDispositivos.map((a) => a.address)),
      )
        .map((address) =>
          todosLosDispositivos.find((a) => a.address === address),
        )
        .filter(
          (d): d is BluetoothDevice =>
            d !== undefined && d.name !== undefined && d.name.trim() !== "",
        );

      const deysaDevice = dispositivosUnicos.find(
        (d) => d.name === "DeysaHouse",
      );

      if (deysaDevice) {
        setDispositivosEncontrados([deysaDevice]);
      } else {
        setDispositivosEncontrados(dispositivosUnicos);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error Bluetooth",
        text2: "Ocurrió un problema.",
      });
    } finally {
      setEscaneandoBle(false);
    }
  };

  const conectarAlDispositivo = async (dispositivo: BluetoothDevice) => {
    try {
      setEscaneandoBle(true);
      const estaConectado = await dispositivo.isConnected();

      if (!estaConectado) {
        await dispositivo.connect();
      }

      setDispositivoSeleccionado(dispositivo);

      // Listener para recibir respuestas del ESP8266
      const sub = dispositivo.onDataReceived((data) => {
        try {
          const json = JSON.parse(data.data);

          if (
            json.disponible === true &&
            json.wifiConectado === true &&
            json.ssid
          ) {
            setRedActualESP(json.ssid);
          } else if (json.disponible === true) {
            setRedActualESP("Sin conexión");
          }

          if (json.wifiConectado === true) {
            setEstadoEnvio("exito");
          } else if (json.wifiConectado === false && json.errorWifi === true) {
            setEstadoEnvio("fallo");
          }
        } catch (e) {}
      });

      setSubscripcionLectura(sub);

      // Pedimos estado a la placa
      await dispositivo.write(JSON.stringify({ type: "estado" }) + "\n");

      // Automáticamente mostramos el dashboard
      setPaso(2);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Fallo de conexión",
        text2: "Asegúrate de que la caja de control esté encendida.",
      });
      setPaso(1); // Si falla el auto-connect, regresamos al escáner
    } finally {
      setEscaneandoBle(false);
    }
  };

  const formatearESP = async () => {
    if (!dispositivoSeleccionado) return;
    try {
      await dispositivoSeleccionado.write(
        JSON.stringify({ type: "factory_reset" }) + "\n",
      );
      Toast.show({
        type: "success",
        text1: "Formateo Exitoso",
        text2: "El dispositivo se reiniciará en breve.",
      });
      setRedActualESP("Sin conexión");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo formatear.",
      });
    }
  };

  // ============================================================================
  // LÓGICA DE WIFI
  // ============================================================================

  const iniciarEscaneoWifi = async () => {
    setPaso(3);
    try {
      setEscaneandoWifi(true);
      let redActualTelefono = "";
      try {
        redActualTelefono = await WifiManager.getCurrentWifiSSID();
      } catch (e) {}

      const redes = await WifiManager.loadWifiList();
      let redesUnicas = Array.from(new Set(redes.map((r) => r.SSID))).filter(
        (ssid) => ssid && ssid.trim() !== "",
      );

      if (redActualTelefono) {
        redesUnicas = redesUnicas.filter((r) => r !== redActualTelefono);
        redesUnicas.unshift(redActualTelefono);
      }
      setRedesWifi(redesUnicas);
    } catch (error) {
      Toast.show({ type: "error", text1: "Error WiFi" });
    } finally {
      setEscaneandoWifi(false);
    }
  };

  const abrirModalContrasena = (ssid: string) => {
    setRedSeleccionada(ssid);
    setContrasenaWifi("");
    setVerContrasena(false);
    setModalAbierto(true);
  };

  const enviarConfiguracionWiFi = async () => {
    if (!redSeleccionada || !contrasenaWifi || !dispositivoSeleccionado) return;
    setModalAbierto(false);
    setPaso(4);
    setEstadoEnvio("cargando");

    try {
      const payload = JSON.stringify({
        type: "wifi_config",
        ssid: redSeleccionada,
        password: contrasenaWifi,
      });
      await dispositivoSeleccionado.write(payload + "\n");
      await AsyncStorage.setItem(
        "@wifi_casa",
        JSON.stringify({ ssid: redSeleccionada, password: contrasenaWifi }),
      );

      // Timeout si el ESP no responde en 15 segundos
      setTimeout(() => {
        setEstadoEnvio((estadoActual) => {
          if (estadoActual === "cargando") {
            return "fallo"; // Cambiamos a fallo en lugar de regresar
          }
          return estadoActual;
        });
      }, 15000);
    } catch (error) {
      setEstadoEnvio("fallo");
    }
  };

  return (
    <SafeAreaView style={estilos.contenedorSafe}>
      <Modal visible={modalAbierto} transparent animationType="fade">
        <View style={estilos.fondoModal}>
          <View style={estilos.contenedorModal}>
            <View style={estilos.headerModal}>
              <Wifi color={Colores.textoPrincipal} size={28} />
              <Text style={estilos.textoTituloModal}>{redSeleccionada}</Text>
            </View>
            <Text style={estilos.etiquetaInput}>Contraseña de la red</Text>
            <View style={estilos.contenedorInputContrasena}>
              <TextInput
                style={estilos.inputConIcono}
                value={contrasenaWifi}
                onChangeText={setContrasenaWifi}
                placeholder="********"
                placeholderTextColor="#888"
                secureTextEntry={!verContrasena}
                autoFocus
              />
              <Pressable
                onPress={() => setVerContrasena(!verContrasena)}
                style={estilos.botonOjo}
              >
                {verContrasena ? (
                  <EyeOff color={Colores.textoSecundario} size={20} />
                ) : (
                  <Eye color={Colores.textoSecundario} size={20} />
                )}
              </Pressable>
            </View>
            <View style={estilos.filaBotonesModal}>
              <BotonAnimado
                estilo={estilos.botonCancelarModal}
                onPress={() => setModalAbierto(false)}
              >
                <Text style={estilos.textoBotonCancelar}>Cancelar</Text>
              </BotonAnimado>
              <BotonAnimado
                estilo={estilos.botonAceptarModal}
                onPress={enviarConfiguracionWiFi}
              >
                <Text style={estilos.textoBotonAceptar}>Conectar</Text>
              </BotonAnimado>
            </View>
          </View>
        </View>
      </Modal>

      <View style={estilos.header}>
        <BotonAnimado
          onPress={() => router.back()}
          estilo={estilos.botonRetroceso}
        >
          <ChevronLeft color={Colores.textoPrincipal} size={32} />
        </BotonAnimado>
        <Text style={estilos.textoTitulo}>Configuración</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={estilos.contenedorContenido}>
        {paso === 1 && (
          <Paso1Bluetooth
            escaneandoBle={escaneandoBle}
            dispositivosEncontrados={dispositivosEncontrados}
            dispositivoSeleccionado={dispositivoSeleccionado}
            iniciarEscaneoBluetooth={() => iniciarEscaneoBluetooth(true)}
            conectarAlDispositivo={conectarAlDispositivo}
          />
        )}
        {paso === 2 && (
          <Paso2Dashboard
            redActualESP={redActualESP}
            iniciarEscaneoWifi={iniciarEscaneoWifi}
            formatearESP={formatearESP}
          />
        )}
        {paso === 3 && (
          <Paso3Wifi
            escaneandoWifi={escaneandoWifi}
            redesWifi={redesWifi}
            abrirModalContrasena={abrirModalContrasena}
            iniciarEscaneoWifi={iniciarEscaneoWifi}
          />
        )}
        {paso === 4 && (
          <Paso4Exito
            estadoEnvio={estadoEnvio}
            alReintentar={() => {
              setPaso(3);
              setEstadoEnvio("cargando");
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedorSafe: { flex: 1, backgroundColor: Colores.fondoPrincipal },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Espaciado.grande,
    paddingTop: Espaciado.mediano,
  },
  botonRetroceso: { padding: Espaciado.pequeno },
  textoTitulo: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
  },
  contenedorContenido: {
    flex: 1,
    padding: Espaciado.grande,
    justifyContent: "center",
  },
  fondoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: Espaciado.grande,
  },
  contenedorModal: {
    backgroundColor: Colores.fondoPrincipal,
    width: "100%",
    borderRadius: 24,
    padding: Espaciado.grande,
  },
  headerModal: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Espaciado.grande,
  },
  textoTituloModal: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.subtitulo,
    fontWeight: Tipografia.pesos.negrita,
    marginLeft: Espaciado.pequeno,
  },
  etiquetaInput: {
    color: Colores.textoPrincipal,
    fontSize: Tipografia.tamanos.etiqueta,
    fontWeight: Tipografia.pesos.negrita,
    marginBottom: 8,
    marginLeft: 4,
  },
  contenedorInputContrasena: {
    flexDirection: "row",
    backgroundColor: Colores.inputFondo,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: Espaciado.extragrande,
    paddingRight: Espaciado.pequeno,
  },
  inputConIcono: {
    flex: 1,
    color: "#333",
    paddingHorizontal: Espaciado.mediano,
    paddingVertical: 14,
    fontSize: Tipografia.tamanos.cuerpo,
  },
  botonOjo: { padding: Espaciado.pequeno },
  filaBotonesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Espaciado.mediano,
  },
  botonCancelarModal: {
    flex: 1,
    backgroundColor: Colores.botonApagado,
    padding: Espaciado.mediano,
    borderRadius: 12,
    alignItems: "center",
  },
  botonAceptarModal: {
    flex: 1,
    backgroundColor: Colores.botonEncendido,
    padding: Espaciado.mediano,
    borderRadius: 12,
    alignItems: "center",
  },
  textoBotonCancelar: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.cuerpo,
    fontWeight: Tipografia.pesos.negrita,
  },
  textoBotonAceptar: {
    color: Colores.textoSecundario,
    fontSize: Tipografia.tamanos.cuerpo,
    fontWeight: Tipografia.pesos.negrita,
  },
});
