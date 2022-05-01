const get = () => import(/* webpackChunkName: "walletlink" */ "walletlink"); // v^2.0.2
import LockConnector from "../connector";

export default class Connector extends LockConnector {
  async connect() {
    let provider: any;
    try {
      let WalletLink: any = (await get()).default;
      if (WalletLink.default) WalletLink = WalletLink.default;
      const walletLink = new WalletLink(this.options);
      provider = walletLink.makeWeb3Provider(
        this.options.ethJsonrpcUrl,
        this.options.chainId
      );
      await provider.enable();
    } catch (e) {
      console.error(e);
      return;
    }
    provider.connectorName = "walletlink";
    return provider;
  }

  logout() {
    if (localStorage) {
      localStorage.removeItem(
        "-walletlink:https://www.walletlink.org:session:id"
      );
      localStorage.removeItem(
        "-walletlink:https://www.walletlink.org:session:secret"
      );
      localStorage.removeItem(
        "-walletlink:https://www.walletlink.org:session:linked"
      );
      localStorage.removeItem(
        "-walletlink:https://www.walletlink.org:Addresses"
      );
    }
    return;
  }
}
