// import { Demo } from '../screens/demo.screen';
import { ServerList } from '../screens/serverlist.screen';
import { ProfileNavigator } from './profile.navigation';
import { Garage } from '../screens/garage.screen';
import { Market } from '../screens/market.screen';
import { Changelogs } from '../screens/changelog.screen';
import { Settings } from '../screens/settings.screen';
import { Properties } from '../screens/property.screen';
import { TraderNavigator } from './trader.navigation';
import { CompanyShops } from '../screens/company-shops.screen';

export const INITIAL_ROUTE_NAME = 'Serverliste';

export const ROUTES = [
  {
    name: 'serverlist',
    title: 'Serverliste',
    icon: 'server',
    component: ServerList,
  },
  {
    name: 'profile',
    title: 'Profil',
    icon: 'account-circle-outline',
    component: ProfileNavigator,
  },
  {
    name: 'garage',
    title: 'Garage',
    icon: 'garage',
    component: Garage,
  },
  {
    name: 'properties',
    title: 'Häuser',
    icon: 'home-city-outline',
    component: Properties,
  },
  {
    name: 'trader',
    title: 'Händler',
    icon: 'cart-outline',
    component: TraderNavigator,
  },
  {
    name: 'companies',
    title: 'Warenankauf',
    icon: 'factory',
    component: CompanyShops,
  },
  // {
  //   name: 'contacts',
  //   title: 'Kontaktbuch',
  //   icon: 'contacts',
  //   component: Demo,
  // },
  {
    name: 'market',
    title: 'Markt',
    icon: 'trending-up',
    component: Market,
  },
  // {
  //   name: 'community_building_system',
  //   title: 'CBS',
  //   icon: 'hammer',
  //   component: Demo,
  // },
  {
    name: 'changelogs',
    title: 'Changelogs',
    icon: 'format-list-bulleted',
    component: Changelogs,
  },
  {
    name: 'settings',
    title: 'Einstellungen',
    icon: 'cog',
    component: Settings,
  },
];
