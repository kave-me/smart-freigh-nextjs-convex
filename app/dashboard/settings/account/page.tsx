/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
// Using a hardcoded ID for MVP based on the required_instructions

export default function AccountSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  // For MVP, use the first user in the system
  const user = useQuery(api.myFunctions.getFirstUser);
  const convexUserId = user?._id;

  // Get user settings
  const userSettings = useQuery(
    api.userSettings.getUserSettings,
    convexUserId ? { userId: convexUserId } : "skip",
  );

  // Create or update user settings
  const updateSettings = useMutation(api.userSettings.updateUserSettings);
  const createSettings = useMutation(api.userSettings.createUserSettings);
  const getOrCreateSettings = useMutation(
    api.userSettings.getOrCreateUserSettings,
  );

  // Storage mutations and queries
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const deleteFile = useMutation(api.storage.deleteFile);

  // Get profile picture URL if exists
  const profilePictureUrl = useQuery(
    api.userSettings.getProfilePictureUrl,
    userSettings?.profilePicture
      ? { storageId: userSettings.profilePicture }
      : "skip",
  );

  // Set up default settings if they don't exist
  useEffect(() => {
    const initializeSettings = async () => {
      if (convexUserId && !userSettings) {
        try {
          await getOrCreateSettings({
            userId: convexUserId,
            defaultName: "Your Name",
            defaultEmail: "your.email@example.com",
            defaultPhone: "555-555-5555",
          });
        } catch (error) {
          console.error("Failed to create default settings", error);
        }
      }
    };

    initializeSettings();
  }, [convexUserId, userSettings, getOrCreateSettings]);

  // Update form data when settings are loaded
  useEffect(() => {
    if (userSettings) {
      setFormData({
        name: userSettings.name,
        email: userSettings.email,
        phoneNumber: userSettings.phoneNumber,
      });
    }
  }, [userSettings]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload avatar to Convex storage
  const uploadAvatar = async () => {
    if (!avatarFile) return null;

    try {
      setIsUploading(true);

      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl({
        contentType: avatarFile.type,
      });

      // Upload file to the presigned URL
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": avatarFile.type },
        body: avatarFile,
      });

      if (!result.ok) {
        throw new Error("Failed to upload image");
      }

      // Extract storageId from the response
      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload profile picture");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convexUserId) return;

    setIsLoading(true);

    try {
      // Upload new avatar if selected
      let profilePictureId = userSettings?.profilePicture;

      if (avatarFile) {
        // Delete old profile picture if exists
        if (profilePictureId) {
          await deleteFile({ storageId: profilePictureId });
        }

        // Upload new profile picture
        profilePictureId = await uploadAvatar();
      }

      if (userSettings) {
        // Update existing settings
        await updateSettings({
          settingsId: userSettings._id,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          ...(profilePictureId && { profilePicture: profilePictureId }),
        });
      } else {
        // Create new settings
        await createSettings({
          userId: convexUserId,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          ...(profilePictureId && { profilePicture: profilePictureId }),
          notificationPreferences: {
            emailNotifications: true,
            smsNotifications: false,
          },
        });
      }

      // Reset avatar file state after successful upload
      setAvatarFile(null);
      setPreviewUrl(null);

      toast.success("Settings Saved", {
        description: "Your account settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error", {
        description: "There was a problem saving your settings.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading UI while fetching user settings
  const isLoadingData = userSettings === undefined;

  if (!convexUserId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <Skeleton className="h-8 w-32 rounded-md" />
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
            {isLoadingData ? (
              <Skeleton className="h-24 w-24 rounded-full" />
            ) : (
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={previewUrl || profilePictureUrl || undefined}
                />
                <AvatarFallback>
                  {formData.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-2 flex-1">
              <Label htmlFor="avatar">Profile Picture</Label>
              {isLoadingData ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="w-full"
                />
              )}
              {avatarFile && !isLoadingData && (
                <p className="text-xs text-muted-foreground">
                  {avatarFile.name} ({Math.round(avatarFile.size / 1024)} KB)
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="mb-2">
              Name
            </Label>
            {isLoadingData ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            {isLoadingData ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="mb-2">
              Phone Number
            </Label>
            {isLoadingData ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            )}
          </div>

          <div className="flex justify-end">
            {isLoadingData ? (
              <Skeleton className="h-10 w-28" />
            ) : (
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading || isUploading ? "Saving..." : "Save Settings"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
