// src/servicios/servicio-mqtt.ts

import mqtt, { MqttClient } from "mqtt";
import Toast from "react-native-toast-message";

const MQTT_URL = process.env.EXPO_PUBLIC_MQTT_URL || "";
const MQTT_USUARIO = process.env.EXPO_PUBLIC_MQTT_USUARIO || "";
const MQTT_CONTRASENA = process.env.EXPO_PUBLIC_MQTT_CONTRASENA || "";
const ID_CLIENTE = `DeysaApp_${Math.random().toString(16).substring(2, 8)}`;

let cliente: MqttClient | null = null;
let callbackMensaje: ((topico: string, datos: any) => void) | null = null;

// Enlace para que el Contexto de React pueda escuchar los mensajes entrantes
export const setCallbackMensajeMQTT = (callback: typeof callbackMensaje) => {
  callbackMensaje = callback;
};

export const conectarMQTT = () => {
  if (cliente) return;

  cliente = mqtt.connect(MQTT_URL, {
    clientId: ID_CLIENTE,
    username: MQTT_USUARIO,
    password: MQTT_CONTRASENA,
    clean: true,
    reconnectPeriod: 5000,
  });

  cliente.on("connect", () => {
    console.log("[MQTT] ¡Conectado exitosamente a HiveMQ!");
    cliente?.subscribe("casa/estado", { qos: 1 });
    cliente?.subscribe("casa/dispositivo/estado", { qos: 1 });
    solicitarEstadoCasa();
  });

  cliente.on("error", () => {
    Toast.show({
      type: "error",
      text1: "Error de Red",
      text2: "No se pudo conectar al servidor.",
    });
  });

  cliente.on("offline", () => {
    if (callbackMensaje)
      callbackMensaje("casa/dispositivo/estado", { online: false });
  });

  cliente.on("message", (topico, payload) => {
    try {
      const datosJson = JSON.parse(payload.toString());
      if (callbackMensaje) callbackMensaje(topico, datosJson);
    } catch (error) {
      console.error("[MQTT] Error al parsear JSON", error);
    }
  });
};

export const desconectarMQTT = () => {
  if (cliente) {
    cliente.end();
    cliente = null;
  }
};

export const solicitarEstadoCasa = () => {
  if (cliente?.connected)
    cliente.publish("casa/estado/obtener", "{}", { qos: 1 });
};

export const publicarComandoLuz = (
  habitacion: string,
  estado: boolean,
  brillo?: number,
) => {
  if (!cliente?.connected) return;
  const payload: any = { habitacion, estado };
  if (brillo !== undefined) payload.brillo = brillo;
  cliente.publish("casa/luces", JSON.stringify(payload), { qos: 1 });
};

export const publicarComandoPorton = (accion: "abrir" | "cerrar") => {
  if (!cliente?.connected) return;
  cliente.publish("casa/porton", JSON.stringify({ accion }), { qos: 1 });
};

export const publicarComandoParedLlorosa = (
  accion: "encender" | "apagar" | "programar",
  horaEncendido?: string,
  horaApagado?: string,
) => {
  if (!cliente?.connected) return;
  const payload: any = { accion };
  if (horaEncendido) payload.horaEncendido = horaEncendido;
  if (horaApagado) payload.horaApagado = horaApagado;
  cliente.publish("casa/pared-llorosa", JSON.stringify(payload), { qos: 1 });
};
