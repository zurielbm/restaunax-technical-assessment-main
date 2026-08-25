import { useCallback, useEffect, useRef, useState } from "react";
import { Customer } from "../../../shared/types";
import { customersApi } from "../services/api";

interface CustomersResult {
  customersById: ReadonlyMap<string, Customer>;
  failed: boolean;
  retry: () => void;
}

export function useCustomers(): CustomersResult {
  const [customersById, setCustomersById] = useState<
    ReadonlyMap<string, Customer>
  >(new Map());
  const [failed, setFailed] = useState(false);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const id = ++requestId.current;
    setFailed(false);
    customersApi
      .getCustomers()
      .then((customers) => {
        if (id !== requestId.current) return;
        setCustomersById(
          new Map(customers.map((customer) => [customer.id, customer]))
        );
      })
      .catch(() => {
        if (id === requestId.current) setFailed(true);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { customersById, failed, retry: load };
}
