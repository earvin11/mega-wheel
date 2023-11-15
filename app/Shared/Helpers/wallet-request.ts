import axios from 'axios';
import { CreditWalletRequest, DebitWalletRequest, PlayerWalletResponse } from '../Interfaces/wallet.interfaces';

// Metodo para enviar apuesta a la wallet
export const sendBet = async (endpointBet: string, data: DebitWalletRequest) => {
    try {
        const betWallet = await axios({
            method: "POST",
            url: endpointBet,
            data,
            validateStatus: function (status) {
                return status < 500;
            },
        });
        return betWallet;
    } catch (error) {
        console.log("SENDBET ENDPOINTBET -> UTILS", error);
        throw error;
    }
};

// Metodo para enviar credito a la wallet
export const sendCredit = async(endpointWin: string, data: CreditWalletRequest) => {
    try {
        const creditWallet = await axios({
            method: 'POST',
            url: endpointWin,
            data,
            validateStatus: function (status) {
                return status < 500;
            },
        });
        return creditWallet;
    } catch (error) {
        console.log("SENDBET ENDPOINTBET -> UTILS", error);
        throw error;
    }
};

// Login player
export const loginPllayerInWallet = async (endpointAuth: string, token: string) => {
    const walletPlayer = await axios<PlayerWalletResponse>({
        method: 'POST',
        url: endpointAuth,
        data: {
          token,
        },
        validateStatus: function (status) {
          return status < 500
        },
      })
  
      return walletPlayer.data
}

