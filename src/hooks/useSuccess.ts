import React from "react";
import { SuccessContext } from "../contexts/SuccessContext";

export const useSuccess = () => React.useContext(SuccessContext);
