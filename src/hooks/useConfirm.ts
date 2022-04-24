import React from "react";
import { ConfirmContext } from "../contexts/ConfirmContext";

export const useConfirm = () => React.useContext(ConfirmContext);
