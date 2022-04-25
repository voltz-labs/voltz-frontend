import { tezos } from "../utils/tezos";

export const getTezosBalance = async (address: string) => {
  const balanceMutez = await tezos.tz.getBalance(address);

  const balance = balanceMutez.dividedBy(1_000_000);

  return balance.toNumber();
};
