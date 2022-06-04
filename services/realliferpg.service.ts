export class ReallifeRPGService {
  private _apiKey: string = '';

  constructor(apiKey?: string) {
    if (apiKey) {
      this._apiKey = apiKey;
    }
  }

  public get apiKey(): string {
    return this._apiKey;
  }

  public set apiKey(value: string) {
    this._apiKey = value;
  }

  getChangelogDate(changelogDate: string) {
    // 2016-05-25 23:00:00
    let [date, time] = changelogDate.split(' ');
    let ddate = new Date(date + 'T' + time);
    if (ddate.toString().includes('GMT+0200')) {
      ddate.setHours(ddate.getHours() - 2);
    }
    return ddate;
  }

  getChangelogs(): Promise<IChangelog> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/changelog')
        .then((response) => response.json())
        .then((changelogs: IChangelog) => res(changelogs))
        .catch((err) => rej(err));
    });
  }

  getMarket(server: '1' | '2'): Promise<IMarket> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/market/' + server)
        .then((response) => response.json())
        .then((market: IMarket) => res(market))
        .catch((err) => rej(err));
    });
  }

  getMarketForAllServers(): Promise<IMarketAll> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/market_all/')
        .then((response) => response.json())
        .then((market: IMarketAll) => res(market))
        .catch((err) => rej(err));
    });
  }

  verifyKey(apiKey: string): Promise<IVerifyKey> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/player/validate/' + apiKey)
        .then((response) => response.json())
        .then((result: IVerifyKey) => res(result))
        .catch((err) => rej(err));
    });
  }

  getServers(): Promise<IServerList> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/servers')
        .then((response) => response.json())
        .then((result: IServerList) => res(result))
        .catch((err) => rej(err));
    });
  }

  getGarage(): Promise<MVehicle.IList> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/player/' + this._apiKey + '/vehicles')
        .then((response) => response.json())
        .then((result: MVehicle.IList) => res(result))
        .catch((err) => rej(err));
    });
  }

  getProfile(): Promise<Profile.IProfile> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/player/' + this._apiKey)
        .then((response) => response.json())
        .then((result: Profile.IProfile) => res(result))
        .catch((err) => rej(err));
    });
  }

  getVehicleShops(): Promise<IShopList> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/info/vehicles_shoptypes')
        .then((response) => response.json())
        .then((result: IShopList) => res(result))
        .catch((err) => rej(err));
    });
  }

  getVehicleShop(shoptype: string): Promise<IVehicleShop> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/info/vehicles/' + shoptype)
        .then((response) => response.json())
        .then((result: IVehicleShop) => res(result))
        .catch((err) => rej(err));
    });
  }

  getItemShops(): Promise<IShopList> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/info/items_shoptypes')
        .then((response) => response.json())
        .then((result: IShopList) => res(result))
        .catch((err) => rej(err));
    });
  }

  getItemShop(shoptype: string): Promise<IItemShop> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/info/items/' + shoptype)
        .then((response) => response.json())
        .then((result: IItemShop) => res(result))
        .catch((err) => rej(err));
    });
  }

  getCompanyShops(): Promise<ICompanyShops> {
    return new Promise((res, rej) => {
      fetch('https://api.realliferpg.de/v1/company_shops')
        .then((response) => response.json())
        .then((result: ICompanyShops) => res(result))
        .catch((err) => rej(err));
    });
  }
}

export interface IChangelog {
  data: {
    id: number;
    version: string;
    change_mission: string[];
    change_map: string[];
    change_mod: string[];
    note: string;
    actie: 1;
    size: string;
    release_at: string;
    created_at: string;
    updated_at: string;
  }[];
  requested_at: number;
}

interface IMarketItem {
  item: string;
  price: number;
  server: number;
  updated_at: string;
  created_at: string;
  localized: string;
  export_virt_item?: {
    item: string;
    name: string;
    sellPrice: number;
    buyPrice: number;
    illegal: number;
    exp: number;
    weight: number;
    market: number;
    icon: string;
  };
}

export interface IMarket {
  data: IMarketItem[];
  requested_at: number;
}

export interface IMarketAll {
  data: {
    server_id: number;
    server_name: string;
    online: true;
    market: IMarketItem[];
  }[];
  requested_at: number;
}

export interface IVerifyKey {
  status: 'Success' | 'Error';
  name?: string;
  requested_at: number;
}

export interface IServerList {
  data: (IGameServer | IGunGameServer)[];
  requested_at: number;
  cached: boolean;
}

export interface IServer {
  Id: number;
  ModId: number;
  appId: number;
  online: number;
  Servername: string;
  Description: string;
  IpAddress: string;
  Port: number;
  ServerPassword: string | number;
  Gamemode: number;
  StartParameters: string;
  Slots: number;
  Update_Mods: number;
  Playercount: number;
  Players: string[];
  updated_at: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
}

export interface IGameServer extends IServer {
  Civilians: number;
  Medics: number;
  Cops: number;
  Adac: number;
  Side: {
    Civs: string[];
    Medics: string[];
    Cops: string[];
    RAC: string[];
  };
}

export interface IGunGameServer extends IServer {
  Civilians?: number;
  Medics?: number;
  Cops?: number;
  Adac?: number;
  Side?: {
    Civs: string[];
    Medics: string[];
    Cops: string[];
    RAC: string[];
  };
}

export declare module MVehicle {
  export interface IList {
    data: IVehicle[];
    requested_at: number;
  }

  export interface IVehicle {
    id: number;
    pid: string;
    side: string;
    classname: string;
    type: string;
    plate: string;
    active: number;
    impound: number;
    alarm: number;
    disabled: number;
    color: string;
    inventory: string;
    gear: string;
    fuel: string;
    fuelcargo: number;
    tuning_color?: any;
    tuning_array: string;
    tuning_perm: number;
    hitpoints: string;
    kilometer: number;
    kilometer_total: number;
    lastgarage: string;
    alive: number;
    insurance: number;
    companyid: number;
    companytype: string;
    updated_at: string;
    created_at: string;
    vehicle_data: VehicleData;
    export_vehicles: ExportVehicle[];
  }

  export interface VehicleData {
    id: number;
    classname: string;
    name: string;
    price: number;
    level: number;
    v_space: number;
    shoptype: string;
    shopname: string;
    type: string;
  }

  export interface ExportVehicle {
    id: number;
    classname: string;
    name: string;
    price: number;
    level: number;
    v_space: number;
    shoptype: string;
    shopname: string;
    type: string;
  }
}

export declare module Profile {
  interface IProfile {
    data: IProfileData[];
    requested_at: number;
  }

  interface IProfileData {
    id: number;
    pid: string;
    guid: string;
    name: string;
    cash: number;
    bankacc: number;
    coplevel: string;
    mediclevel: string;
    adaclevel: string;
    adminlevel: string;
    donatorlvl: string;
    justizlevel: string;
    arrested: 1 | 0;
    citizen: 1 | 0;
    tutorial: 1 | 0;
    dsgvo: 1 | 0;
    level: number;
    exp: number;
    skillpoint: number;
    hunger: number;
    thirst: number;
    tuning_tickets: number;
    jail_time: number;
    quest_daily: number;
    quest_row: number;
    pos: string;
    pos_alive: 1 | 0;
    pos_free: 1 | 0;
    suspended: 1 | 0;
    server_id: number;
    chat_muted: 1 | 0;
    joined_at: string;
    updated_at: string;
    created_at: string;
    avatar: string;
    avatar_full: string;
    avatar_medium: string;
    profilename: string;
    profileurl: string;
    last_seen: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    level_progress: 51;
    donations: IDontation[];
    play_time: { active: number; total: number };
    garage: { value: number; count: number };
    houses: IHouse[];
    rentals: any[];
    buildings: any[];
    phones: IPhone[];
    company_owned: ICompany[];
    phonebooks: IPhoneBooks[];
    licenses: ILicense[];
    bank_main: IBankAccount[];
  }

  interface IPhone {
    pid: string;
    phone: string;
    note: 'default' | 'bought' | string;
    side: string;
    idNR: number;
    disabled: 0 | 1;
    created_at: string;
    updated_at: string;
  }

  interface IPhoneBooks {
    pid: string;
    idNR: number;
    phonebook: IPhoneBookContact[];
    updated_at: string;
    created_at: string;
    laravel_through_key: string;
    side: string;
    identity: IID;
  }

  interface IPhoneBookContact {
    number: string;
    name: string;
    type: string;
    special: '1' | '0';
    iban: string;
  }

  interface IID {
    id: number;
    pid: string;
    side: string;
    name: string;
    created_at: string;
    id_birthday: string;
    id_nationality: string;
    rac_membership: string;
  }

  interface ICompany {
    id: number;
    name: string;
    description: string;
    phone: string;
    bank_1: string;
    bank_2: string;
    icon: string;
    level: number;
    non_profit: number;
    special_type: string;
    perms: string;
    payed_for: number;
    disabled: number;
    created_by: string;
    created_at: string;
    updated_at: string;
    bank_details?: Record<'bank_1' | 'bank_2', IBankAccount>;
    shops?: any[];
  }

  interface IBankAccount {
    id: number;
    pid: string;
    iban: string;
    balance: number;
    default_account: number;
    disabled: number;
    created_at: string;
    updated_at: string;
  }

  interface IHouse {
    id: number;
    payed_for: number;
    disabled: number;
    location: string;
    players: string[];
  }

  interface IDontation {
    amount: number;
    level: number;
    duration: number;
    active: number;
    activated_at: string;
    created_at: string;
    valid_until: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    days_left: number;
  }

  interface ILicense {
    pid: string;
    license: string;
    created_at: string;
    export_licence: IExportLicense;
  }

  interface IExportLicense {
    id: number;
    license: string;
    name: string;
    price: number;
    illegal: 1 | 0;
    side: string;
    level: number;
  }
}

export interface IShopList {
  data: IShopType[];
  requested_at: number;
}

export interface IShopType {
  shoptype: string;
  shopname: string;
}

export interface IVehicleShop {
  data: IVehicleShopItem[];
  requested_at: number;
}

export interface IVehicleShopItem {
  id: number;
  classname: string;
  name: string;
  price: number;
  level: number;
  v_space: number;
  shoptype: string;
  shopname: string;
  type: string;
}

export interface IItemShop {
  data: IItemShopItem[];
  requested_at: number;
}

export interface IItemShopItem {
  id: number;
  price: number;
  classname: string;
  category: string;
  level: number;
  shopname: string;
  shoptype: string;
  name: string;
}

export interface ICompanyShops {
  data: ICompanyShop[];
  requested_at: number;
}

export interface ICompanyShop {
  industrial_area_id: number;
  company: {
    id: number;
    name: string;
    owner: string;
  };
  pos: string;
  shops: {
    item: string;
    item_localized: string;
    amount: number;
    price: number;
  }[];
}
