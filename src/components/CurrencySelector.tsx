
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCurrency, AVAILABLE_CURRENCIES } from '@/contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { currentCurrency, setCurrency } = useCurrency();

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = AVAILABLE_CURRENCIES.find(c => c.code === currencyCode);
    if (currency) {
      setCurrency(currency);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-xs">
        Currency
      </Badge>
      <Select value={currentCurrency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_CURRENCIES.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{currency.symbol}</span>
                <span className="text-sm">{currency.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
