import AsyncStorage from "@react-native-community/async-storage";

/**
 * Handle API-requests using ReallifeRPGs endpoints
 * Documentation: https://api.realliferpg.de
 */
class ReallifeAPI {
  constructor() {
    this.serverRestarts = ["03", "06", "09", "12", "15", "18", "21", "24"];
  }

  /**
   * Check if the ReallifeRPG was already saved on the device
   * If the key was saved it will return an String containing the value
   */
  getApiKey = async () => {
    try {
      return await AsyncStorage.getItem("@apiKey");
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * @param {string} value Should contain the ReallifeRPG API-Key which will be stored in the AsyncStorage
   */
  saveApiKey = async (apiKey) => {
    try {
      await AsyncStorage.setItem("@apiKey", apiKey);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Get an list with all online servers
   */
  async getServerList() {
    const response = await fetch("https://api.realliferpg.de/v1/servers/");
    const data = await response.json();
    return data;
  }

  async getServer(serverId) {
    const response = await fetch("https://api.realliferpg.de/v1/servers/");
    const json = await response.json();
    const serverData = json.data.filter((server) => server.Id == serverId);
    return serverData;
  }

  getCopAmount(serverInformation) {
    return serverInformation.length === 1
      ? serverInformation[0].Side.Cops.filter((player) => player.includes("[C")).length
      : 0;
  }

  /**
   * Get the current market prices from an (online or offline) server
   * @param {number} serverId
   */
  async getMarketPrices(serverId) {
    const response = await fetch("https://api.realliferpg.de/v1/market/" + serverId);
    const data = await response.json();
    return data;
  }

  /**
   * Returns a list containing all avaiable shop npcs for an specific category
   * @param {string} category Should be vehicles or items
   */
  async getShops(category) {
    const response = await fetch("https://api.realliferpg.de/v1/info/" + category + "_shoptypes");
    const data = await response.json();
    return data;
  }

  /**
   * Returns a list containing all offered items for an specific shop
   * @param {string} category Should be vehicles or items
   * @param {string} shoptype
   */
  async getShopItems(category, shoptype) {
    const response = await fetch("https://api.realliferpg.de/v1/info/" + category + "/" + shoptype);
    const data = await response.json();
    return data;
  }

  /**
   * @param {string} apiKey ReallifeRPG API-Key
   */
  async getProfile(apiKey) {
    const response = await fetch("https://api.realliferpg.de/v1/player/" + apiKey);
    const data = await response.json();
    return data;
  }

  /**
   * @param {string} apiKey ReallifeRPG API-Key
   */
  async getPlayerVehicles(apiKey) {
    const response = await fetch("https://api.realliferpg.de/v1/player/" + apiKey + "/vehicles");
    const data = await response.json();
    return data;
  }

  async getCBS() {
    const response = await fetch("https://api.realliferpg.de/v1/cbs/");
    const data = await response.json();
    return data;
  }

  async getChangelogs() {
    const response = await fetch("https://api.realliferpg.de/v1/changelog");
    const data = await response.json();
    return data;
  }

  /**
   * @param {number} payedFor Amount of hours until the maintenance expires
   */
  getMaintenanceExpireDate(payedFor) {
    const hoursLeft = payedFor,
      dateOfExpire = new Date(Date.now() + hoursLeft * (60 * 60 * 1000));
    // TODO Calculate the server period of expire
    return {
      expireDate: dateOfExpire,
    };
  }
}

class DulliAPI {
  constructor() {
    this.host = "https://api.dulliag.de";
  }

  /**
   * @param {string} playerName ReallifeRPG playername
   * @param {string} playerId Steam64 id
   * @param {string} avatarUrl Steam avatar url
   * @param {string} telNo ReallifeRPG telephone number
   * @param {string} iban IBAN from players bank account
   */
  async createContact(playerName, playerId, avatarUrl, telNo, iban) {
    const formData = new FormData();
    formData.append("playerName", playerName);
    formData.append("playerId", playerId);
    formData.append("avatarUrl", avatarUrl);
    formData.append("telNo", telNo);
    formData.append("iban", iban);
    const response = await fetch(this.host + "/acon/v1/create", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  }

  /**
   * @param {number} contactId
   */
  async deleteContact(contactId) {
    const formData = new FormData();
    formData.append("contactId", contactId);
    const response = await fetch(this.host + "/acon/v1/delete", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  }

  async getAllContacts() {
    const response = await fetch(this.host + "/acon/v1/all", {
      method: "GET",
    });
    const data = await response.json();
    return data;
  }

  /**
   * @param {string} playerId Steam64 id
   */
  async getContactByPlayerId(playerId) {
    const response = await fetch(`${this.host}/acon/v1/getByPlayerId?playerId=${playerId}`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  }

  /**
   * @param {number} contactId
   */
  async getContact(contactId) {
    const response = await fetch(`${this.host}/acon/v1/get?contactId=${contactId}`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  }
}

export { ReallifeAPI, DulliAPI };
// Arnold Hobel Michael Metzger
