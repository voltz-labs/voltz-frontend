import React, { useState } from "react";
import { FormResubmitError } from "../utils/FormResubmitError";
import { useHandler } from "./useHandler";

export const useSubmit = () => {
  const [loading, setLoading] = useState(false);
  const { handler } = useHandler();

  const submit =
    <T>(callback: (e: React.FormEvent) => Promise<T>) =>
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (loading) {
        throw new FormResubmitError("Form resubmit");
      }

      setLoading(true);
      try {
        const fn = handler(() => callback(e));

        const values = await fn();

        return values;
      } finally {
        setLoading(false);
      }
    };

  return { loading, submit };
};
