import AsyncStorage from "@react-native-community/async-storage";

/**
 * Handle API-requests using ReallifeRPGs endpoints
 * Documentation: https://api.realliferpg.de
 */
class ReallifeAPI {
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
}

export { ReallifeAPI };
