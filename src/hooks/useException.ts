import React from "react";
import { ExceptionContext } from "../contexts/ExceptionContext";

export const useException = () => React.useContext(ExceptionContext);
