import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, User, Mail, Phone, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { createPersonSchema, type CreatePerson } from "@shared/schema";

interface CreatePersonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DuplicateCheckResponse {
  emailExists: boolean;
  phoneExists: boolean;
}

// Phone number formatting helper
const formatPhoneNumber = (value: string) => {
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export function CreatePersonForm({ open, onOpenChange }: CreatePersonFormProps) {
  const [duplicateWarnings, setDuplicateWarnings] = useState<DuplicateCheckResponse>({ emailExists: false, phoneExists: false });
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreatePerson>({
    resolver: zodResolver(createPersonSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      status: "active",
      volunteerLevel: "new",
    },
  });

  const createPersonMutation = useMutation({
    mutationFn: async (data: CreatePerson) => {
      // Create the person with combined name
      const personData = {
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        location: data.location || null,
        status: data.status,
        volunteerLevel: data.volunteerLevel,
      };
      
      return apiRequest("/api/people", "POST", personData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/people"] });
      form.reset();
      setDuplicateWarnings({ emailExists: false, phoneExists: false });
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Person created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create person",
        variant: "destructive",
      });
    },
  });

  const checkDuplicates = async (email?: string, phone?: string) => {
    if (!email && !phone) {
      setDuplicateWarnings({ emailExists: false, phoneExists: false });
      return;
    }

    setIsCheckingDuplicates(true);
    try {
      const response = await fetch("/api/people/check-duplicates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });
      
      if (response.ok) {
        const result: DuplicateCheckResponse = await response.json();
        setDuplicateWarnings(result);
      }
    } catch (error) {
      console.error("Failed to check duplicates:", error);
    } finally {
      setIsCheckingDuplicates(false);
    }
  };

  const onSubmit = async (data: CreatePerson) => {
    // Final duplicate check before submission
    await checkDuplicates(data.email, data.phone);
    
    // Show warning if duplicates exist, but still allow submission
    if (duplicateWarnings.emailExists || duplicateWarnings.phoneExists) {
      // User can still submit after seeing the warning
    }
    
    createPersonMutation.mutate(data);
  };

  // Handle phone number formatting
  const handlePhoneChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatPhoneNumber(value);
    onChange(formatted);
    
    // Check duplicates on valid phone numbers
    if (formatted.replace(/[^\d]/g, '').length === 10) {
      checkDuplicates(form.getValues("email"), formatted);
    }
  };

  const handleEmailBlur = (email: string) => {
    if (email && email.includes("@")) {
      checkDuplicates(email, form.getValues("phone"));
    }
  };

  const hasWarnings = duplicateWarnings.emailExists || duplicateWarnings.phoneExists;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Add New Person</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Duplicate Warnings */}
            {hasWarnings && (
              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <AlertDescription className="text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">Potential duplicate found:</p>
                    {duplicateWarnings.emailExists && (
                      <p>• An account with this email already exists</p>
                    )}
                    {duplicateWarnings.phoneExists && (
                      <p>• An account with this phone number already exists</p>
                    )}
                    <p className="text-xs mt-2">You can still create this person if needed.</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter first name"
                        data-testid="input-first-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter last name"
                        data-testid="input-last-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="text-sm font-medium text-muted-foreground">
                Contact Information (at least one required)
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        placeholder="person@example.com"
                        onBlur={(e) => handleEmailBlur(e.target.value)}
                        className={duplicateWarnings.emailExists ? "border-orange-300" : ""}
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="(555) 123-4567"
                        onChange={(e) => handlePhoneChange(e.target.value, field.onChange)}
                        className={duplicateWarnings.phoneExists ? "border-orange-300" : ""}
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., Downtown, Westside"
                      data-testid="input-location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status and Volunteer Level */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volunteerLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volunteer Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-volunteer-level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="core">Core</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setDuplicateWarnings({ emailExists: false, phoneExists: false });
                  onOpenChange(false);
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createPersonMutation.isPending || isCheckingDuplicates}
                className={hasWarnings ? "bg-orange-600 hover:bg-orange-700" : ""}
                data-testid="button-create-person"
              >
                {createPersonMutation.isPending ? "Creating..." : 
                 hasWarnings ? "Create Anyway" : "Create Person"}
              </Button>
            </div>

            {/* Validation Summary */}
            <div className="text-xs text-muted-foreground">
              <p>* Required fields</p>
              <p>Either email or phone number must be provided</p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}