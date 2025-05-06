/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import branding from '@/config/branding';

export default function AccountSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);




    

  // if (user === undefined) {
  //   return (
  //     <Card>
  //       <CardHeader>
  //         <CardTitle>Account Information</CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <div className="flex items-center justify-center p-4">
  //           Loading...
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

 

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form  className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={branding.defaultUser.avatar} />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
        
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="mb-2">Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Enter your name" 
              defaultValue={branding.defaultUser.name} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="mb-2">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="Enter your email" 
              defaultValue={branding.defaultUser.email} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="mb-2">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              name="phoneNumber" 
              type="tel" 
              placeholder="Enter your phone number" 
              defaultValue={branding.defaultUser.phoneNumber} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="mb-2">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Enter your password" 
              defaultValue={branding.defaultUser.password} 
              required 
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}