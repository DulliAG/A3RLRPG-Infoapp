import AsyncStorage from "@react-native-community/async-storage";

class DateFormatter {
  /**
   *
   * @param {string} dateString
   * @returns {string}
   */
  format(dateString) {
    var date = dateString.split(" ")[0];
    var time = dateString.split(" ")[1];
    var seperatedTime = {
      year: date.split("-")[0],
      month: date.split("-")[1],
      day: date.split("-")[2],
      hour: time.split(":")[0],
      minute: time.split(":")[1],
      second: time.split(":")[2],
    };
    let { day, month, year, hour, minute, second } = seperatedTime;
    return `${day}.${month}.${year} ${hour}:${minute}`;
  }
}

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

  async getCompanyShops() {
    const response = await fetch("https://api.realliferpg.de/v1/company_shops");
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

export { DateFormatter, ReallifeAPI };
