import { useEffect, useState } from "react";
import { Customer } from "../../../shared/types";
import { customersApi } from "../services/api";

export function useCustomers(): ReadonlyMap<string, Customer> {
  const [customersById, setCustomersById] = useState<
    ReadonlyMap<string, Customer>
  >(new Map());

  useEffect(() => {
    let cancelled = false;
    customersApi
      .getCustomers()
      .then((customers) => {
        if (!cancelled) {
          setCustomersById(
            new Map(customers.map((customer) => [customer.id, customer]))
          );
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return customersById;
}
