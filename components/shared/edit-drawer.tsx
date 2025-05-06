"use client";

import React from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Field {
  key: string;
  label: string;
}

interface EditDrawerProps<T> {
  title: string;
  description: string;
  fields: Field[];
  data: T;
  onSave: (data: T) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditDrawer<T extends Record<string, any>>({ 
  title,
  description,
  fields,
  data,
  onSave,
}: EditDrawerProps<T>) {
  const [open, setOpen] = React.useState(false);
  const mobile = useIsMobile();
  const [formData, setFormData] = React.useState<T>(data);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      toast.success(`${title} updated`);
      setOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm">Edit</Button>
      </DrawerTrigger>
      <DrawerContent className={mobile ? "h-full" : "h-[80vh]"} >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSave} className="grid gap-4 p-4 max-w-sm mx-auto">
          {fields.map(({ key, label }) => (
            <div key={key} className="flex flex-col">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
              />
            </div>
          ))}
          <DrawerFooter className="flex justify-end space-x-2">
            <Button type="submit">Save</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}