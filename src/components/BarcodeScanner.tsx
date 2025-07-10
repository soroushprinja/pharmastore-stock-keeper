
import React, { useState } from 'react';
import { Scan, Camera, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  onScanResult: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanResult, onClose }) => {
  const [manualBarcode, setManualBarcode] = useState('');
  const { toast } = useToast();

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScanResult(manualBarcode.trim());
      toast({
        title: 'Barcode Entered',
        description: `Barcode ${manualBarcode} has been processed`,
      });
      onClose();
    }
  };

  const simulateQuickScan = (barcode: string) => {
    onScanResult(barcode);
    toast({
      title: 'Demo Scan',
      description: `Simulated scan result: ${barcode}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Barcode Scanner
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Camera Scanner Placeholder */}
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Camera scanning will be available when deployed with HTTPS</p>
            <p className="text-sm text-gray-500">For now, use manual entry or demo buttons below</p>
          </div>

          {/* Manual Entry */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="barcode">Enter Barcode Manually</Label>
              <Input
                id="barcode"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Enter barcode number"
                className="text-center font-mono"
              />
            </div>
            <Button type="submit" className="w-full">
              Process Barcode
            </Button>
          </form>

          {/* Demo Barcodes */}
          <div className="space-y-2">
            <Label>Demo Barcodes (for testing)</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => simulateQuickScan('123456789012')}
              >
                Demo 1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => simulateQuickScan('987654321098')}
              >
                Demo 2
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Real barcode scanning requires camera access and works best on mobile devices with HTTPS.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeScanner;
