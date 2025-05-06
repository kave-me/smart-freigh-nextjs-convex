'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import branding from '@/config/branding';



export default function CompanyInfoPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Info</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName" 
              name="companyName" 
              placeholder={branding.company.name}
              defaultValue={branding.company.name}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder={branding.company.email}
              defaultValue={branding.company.email}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scac">SCAC</Label>
            <Input 
              id="scac" 
              name="scac" 
              placeholder={branding.company.scac}
              defaultValue={branding.company.scac}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="homeDomicile">Home Domicile</Label>
            <Input 
              id="homeDomicile" 
              name="homeDomicile" 
              placeholder={branding.company.domicile}
              defaultValue={branding.company.domicile}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              name="phoneNumber" 
              type="tel" 
              placeholder={branding.company.phoneNumber}
              defaultValue={branding.company.phoneNumber}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input 
              id="currency" 
              name="currency" 
              placeholder={branding.company.currency}
              defaultValue="USD"
              required 
            />
          </div>

          <div className="flex justify-end col-span-1 md:col-span-2">
            <Button type="submit">
              Save Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}