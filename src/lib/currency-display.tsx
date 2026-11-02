import { useEffect, useState } from "react";

export type StoreCurrency = {
  code: string;
  name: string;
  minor_unit: number;
};

type ExchangeRateRow = {
  quote_currency: string;
  rate: number | string;
  expires_at: string;
};

type CurrencyState = {
  currency: string;
  options: StoreCurrency[];
  formatInrAmount: (amountInr: number) => string;
  setCurrency: (code: string) => void;
};

/**
 * KANIRA keeps catalogue prices in INR. Other currencies are display estimates
 * calculated from a current INR-based rate stored in Supabase. Checkout/payment
 * currency is not implied by this display preference.
 */
export function useCurrencyDisplay(): CurrencyState {
  const [currency, setCurrencyState] = useState("INR");
  const [options, setOptions] = useState<StoreCurrency[]>([
    { code: "INR", name: "Indian Rupee", minor_unit: 2 },
  ]);
  const [rates, setRates] = useState<Record<string, number>>({ INR: 1 });

  useEffect(() => {
    let active = true;
    const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

    const saved = typeof window !== "undefined"
      ? window.localStorage.getItem("kanira.displayCurrency")
      : null;

    if (!url || !key) return () => { active = false; };

    const headers = { apikey: key, Authorization: "Bearer " + key };
    Promise.all([
      fetch(url + "/rest/v1/currencies?select=code,name,minor_unit&is_active=eq.true&order=code", { headers }),
      fetch(url + "/rest/v1/exchange_rates?select=quote_currency,rate,expires_at&base_currency=eq.INR&is_active=eq.true", { headers }),
    ])
      .then(async ([currenciesResponse, ratesResponse]) => {
        if (!currenciesResponse.ok || !ratesResponse.ok) {
          throw new Error("Currency display configuration is unavailable.");
        }
        const currencies = await currenciesResponse.json() as StoreCurrency[];
        const rateRows = await ratesResponse.json() as ExchangeRateRow[];
        const now = Date.now();
        const nextRates: Record<string, number> = { INR: 1 };
        for (const row of rateRows) {
          const rate = Number(row.rate);
          if (Number.isFinite(rate) && rate > 0 && Date.parse(row.expires_at) > now) {
            nextRates[row.quote_currency] = rate;
          }
        }
        const available = currencies.filter(item => item.code === "INR" || nextRates[item.code] !== undefined);
        if (!available.some(item => item.code === "INR")) {
          available.unshift({ code: "INR", name: "Indian Rupee", minor_unit: 2 });
        }
        if (!active) return;
        setRates(nextRates);
        setOptions(available);
        setCurrencyState(current => {
          const preferred = saved ?? current;
          return available.some(item => item.code === preferred) ? preferred : "INR";
        });
      })
      .catch(() => {
        if (active) {
          setRates({ INR: 1 });
          setOptions([{ code: "INR", name: "Indian Rupee", minor_unit: 2 }]);
          setCurrencyState("INR");
        }
      });

    return () => { active = false; };
  }, []);

  const setCurrency = (code: string) => {
    if (!options.some(option => option.code === code)) return;
    setCurrencyState(code);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kanira.displayCurrency", code);
    }
  };

  const formatInrAmount = (amountInr: number) => {
    const rate = rates[currency] ?? 1;
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
    }).format(amountInr * rate);
  };

  return { currency, options, formatInrAmount, setCurrency };
}

export function CurrencySelector({
  currency,
  options,
  onChange,
  className = "",
}: {
  currency: string;
  options: StoreCurrency[];
  onChange: (code: string) => void;
  className?: string;
}) {
  if (options.length < 2) return null;
  return (
    <label className={"inline-flex items-center gap-2 text-xs text-[#6f6258] " + className}>
      <span>Display currency</span>
      <select
        aria-label="Display currency"
        className="rounded-full border border-[#ded2c7] bg-white px-3 py-2 text-xs"
        value={currency}
        onChange={event => onChange(event.target.value)}
      >
        {options.map(option => (
          <option key={option.code} value={option.code}>{option.code}</option>
        ))}
      </select>
    </label>
  );
}
