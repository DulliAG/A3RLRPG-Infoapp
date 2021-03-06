import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

class NotifyHandler {
  constructor() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  // TODO Checklist
  // [ ] Create an scheduled push-notification for an house (7 days, 24 hours and 4 hours before)
  // [ ] Check if the notification is still up to date

  async registerForPushNotificationsAsync() {
    let token,
      error = {
        status: "error",
        message: null,
      };

    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        error.message = "Youn need to grant permissions for Push Notifications!";
        return error;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      error.message = "You need an physical device!";
      return error;
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  async getExpoPushToken() {
    return (await Notifications.getExpoPushTokenAsync()).data;
  }

  async getAllScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  async cancelAllScheduledNotification() {
    return await Notifications.cancelAllScheduledNotificationAsync();
  }

  /**
   * @param {string} identifier Expo Push-Notification indentifier
   */
  async cancelScheduledNotification(identifier) {
    return await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  async schedulePushNotification(title, message, data = {}, triggerDate) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: message,
        data: data,
      },
      trigger: triggerDate,
    });
  }

  /**
   * @param {string} expoPushToken
   * @param {string} title
   * @param {string} body
   * @param {string} sound
   * @param {object} data
   */
  async sendNotification(expoPushToken, title, body, sound, data = { data: "goes here" }) {
    const message = {
      to: expoPushToken,
      sound: sound || "default",
      title: title,
      body: body,
      data: data,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }
}

export { NotifyHandler };
