import {
  BYTE_INDICATOR_HEX_BYTE_STRING,
  BYTE_INDICATOR_MICHELINE_EXPRESSION,
} from "../utils/constants";
import { wallet } from "../utils/wallet";
import { convertNumberToHex } from "./convertNumberToHex";
import { convertStringToHex } from "./convertStringToHex";
import { SigningType } from "@airgap/beacon-sdk";

export const signContent = async (
  content: Record<string, any>,
  address: string
) => {
  const bytes = convertStringToHex(JSON.stringify(content));

  const length = convertNumberToHex(bytes.length);

  const payload =
    BYTE_INDICATOR_MICHELINE_EXPRESSION +
    BYTE_INDICATOR_HEX_BYTE_STRING +
    length +
    bytes;

  const signedPayload = await wallet.client.requestSignPayload({
    signingType: SigningType.MICHELINE,
    payload,
    sourceAddress: address,
  });

  const signature = signedPayload.signature;

  return {
    payload,
    signature,
  };
};
