import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Customer } from "../../../shared/types";
import { customersApi } from "../services/api";

interface CustomersResult {
  customers: Customer[];
  customersById: ReadonlyMap<string, Customer>;
  failed: boolean;
  retry: () => void;
  register: (customer: Customer) => void;
}

export function useCustomers(): CustomersResult {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [failed, setFailed] = useState(false);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const id = ++requestId.current;
    setFailed(false);
    customersApi
      .getCustomers()
      .then((fetched) => {
        if (id === requestId.current) setCustomers(fetched);
      })
      .catch(() => {
        if (id === requestId.current) setFailed(true);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const register = useCallback((customer: Customer) => {
    setCustomers((current) => [customer, ...current]);
  }, []);

  const customersById = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer])),
    [customers],
  );

  return { customers, customersById, failed, retry: load, register };
}
