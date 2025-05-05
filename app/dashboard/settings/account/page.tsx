'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AccountSettingsPage() {
  const user = useQuery(api.users.getUser);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const updateUser = useMutation(api.users.updateUser);
  const createUser = useMutation(api.users.createUser);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const getImageUrl = useMutation(api.storage.getImageUrl);

  console.log('Query state:', { user, isLoading });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    console.log('Form submission started');

    try {
      const formData = new FormData(event.currentTarget);
      let storageId = user?.avatar;
      if (avatarFile) {
        const { uploadUrl, storageId: newStorageId } = await generateUploadUrl({
          contentType: avatarFile.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        });
        
        const result = await fetch(uploadUrl, {
          method: 'PUT',
          body: avatarFile,
          headers: { 'Content-Type': avatarFile.type },
        });

        if (!result.ok) {
          throw new Error('Failed to upload image');
        }

        storageId = newStorageId;
      }

      const userData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phoneNumber: formData.get('phoneNumber') as string,
        password: formData.get('password') as string,
        avatar: storageId,
      };
      console.log('Submitting user data:', userData);
      
      await updateUser(userData);
      console.log('Update successful');
      toast.success('Account information updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update account information');
    } finally {
      setIsLoading(false);
      console.log('Form submission completed');
    }
  };

  if (user === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (user === null) {
    try {
      createUser();
    } catch (error) {
      console.error('Failed to create user profile:', error);
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            Initializing your profile...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewUrl || user.avatar} />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="mb-2">Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Enter your name" 
              defaultValue={user.name} 
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
              defaultValue={user.email} 
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
              defaultValue={user.phoneNumber} 
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
              defaultValue={user.password} 
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