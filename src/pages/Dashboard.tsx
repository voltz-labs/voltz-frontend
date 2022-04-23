import { Link } from "react-router-dom";
import { wallet } from "../utils/wallet";
import { verifySignature } from "@taquito/utils";
import { SigningType } from "@airgap/beacon-sdk";
import { useState } from "react";
import { convertStringToHex } from "../functions/convertStringToHex";
import { convertNumberToHex } from "../functions/convertNumberToHex";
import {
  BYTE_INDICATOR_HEX_BYTE_STRING,
  BYTE_INDICATOR_MICHELINE_EXPRESSION,
} from "../utils/constants";

export const Dashboard = () => {
  const [value, setValue] = useState("");

  const connect = async () => {
    const permissions = await wallet.client.requestPermissions();

    const sourceAddress = permissions.address;

    const message = [
      "Voltz Signed Message:",
      window.location.href,
      new Date().toISOString(),
      value,
    ].join(" ");

    const bytes = convertStringToHex(message);

    const length = convertNumberToHex(bytes.length);

    const payload =
      BYTE_INDICATOR_MICHELINE_EXPRESSION +
      BYTE_INDICATOR_HEX_BYTE_STRING +
      length +
      bytes;

    const signedPayload = await wallet.client.requestSignPayload({
      signingType: SigningType.MICHELINE,
      payload,
      sourceAddress,
    });

    const { signature } = signedPayload;

    const verified = verifySignature(payload, permissions.publicKey, signature);

    alert(`${verified}`);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={connect}>Connect</button>
      <Link to="/polls">Polls</Link>
      <Link to="/polls/new">Create Poll</Link>
      <Link to="/polls/1">Poll</Link>
    </div>
  );
};
