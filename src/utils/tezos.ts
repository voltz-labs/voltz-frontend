import { TezosToolkit } from "@taquito/taquito";
import { TEZOS_MAINNET } from "./constants";

export const tezos = new TezosToolkit(TEZOS_MAINNET);
