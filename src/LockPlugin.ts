import { ref } from "vue";
import Lock from "./lock";

const name = "lock";

let instance: any;

export const getInstance = () => instance;

export const useLock = ({ ...options }) => {
  if (instance) return instance;

  const isAuthenticated = ref(false);
  const provider = ref();

  const lockClient = new Lock();
  options.connectors.forEach((connector: any) => {
    lockClient.addConnector(connector);
  });

  async function login(connector: any) {
    const lockConnector = lockClient.getConnector(connector);
    const localProvider = await lockConnector.connect();
    if (localProvider !== null) {
      provider.value = localProvider;
    }
    if (provider.value) {
      localStorage.setItem(`_${name}.connector`, connector);
      isAuthenticated.value = true;
    }
    return provider;
  }

  async function logout() {
    const connector = await getConnector();
    if (connector) {
      const lockConnector = lockClient.getConnector(connector);
      await lockConnector.logout();
      localStorage.removeItem(`_${name}.connector`);
      isAuthenticated.value = false;
      provider.value = null;
    }
  }

  async function getConnector() {
    const connector = localStorage.getItem(`_${name}.connector`);
    if (connector) {
      const lockConnector = lockClient.getConnector(connector);
      const isLoggedIn = await lockConnector.isLoggedIn();
      return isLoggedIn ? connector : false;
    }
    return false;
  }

  instance = {
    isAuthenticated,
    provider,
    lockClient,
    login,
    logout,
    getConnector,
  };

  return instance;
};

export const LockPlugin = {
  install(app: any, options: { connectors: any[] }) {
    app.config.globalProperties.$auth = useLock(options);
  },
};
