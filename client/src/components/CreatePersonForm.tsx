import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { GlassModal } from "@/components/ui/glass-panel";
import { GradientButton, PrimaryButton } from "@/components/ui/gradient-button";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { modalContent, fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { useDebounce } from "@/hooks/useDebounce";
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

// Simple debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
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
  const duplicateCheckRef = useRef<AbortController | null>(null);

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

  const checkDuplicates = useCallback(async (email?: string, phone?: string) => {
    if (!email && !phone) {
      setDuplicateWarnings({ emailExists: false, phoneExists: false });
      return;
    }

    // Cancel previous request
    if (duplicateCheckRef.current) {
      duplicateCheckRef.current.abort();
    }

    // Create new abort controller
    duplicateCheckRef.current = new AbortController();
    
    setIsCheckingDuplicates(true);
    try {
      const response = await fetch("/api/people/check-duplicates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
        signal: duplicateCheckRef.current.signal,
      });
      
      if (response.ok) {
        const result: DuplicateCheckResponse = await response.json();
        setDuplicateWarnings(result);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Failed to check duplicates:", error);
      }
    } finally {
      setIsCheckingDuplicates(false);
    }
  }, []);

  const onSubmit = async (data: CreatePerson) => {
    // Final duplicate check before submission
    await checkDuplicates(data.email, data.phone);
    
    // Show warning if duplicates exist, but still allow submission
    if (duplicateWarnings.emailExists || duplicateWarnings.phoneExists) {
      // User can still submit after seeing the warning
    }
    
    createPersonMutation.mutate(data);
  };

  // Debounced duplicate check
  const debouncedCheckDuplicates = useCallback(
    debounce((email?: string, phone?: string) => {
      checkDuplicates(email, phone);
    }, 500),
    [checkDuplicates]
  );

  // Handle phone number formatting
  const handlePhoneChange = useCallback((value: string, onChange: (value: string) => void) => {
    const formatted = formatPhoneNumber(value);
    onChange(formatted);
    
    // Check duplicates on valid phone numbers with debouncing
    if (formatted.replace(/[^\d]/g, '').length === 10) {
      debouncedCheckDuplicates(form.getValues("email"), formatted);
    }
  }, [form, debouncedCheckDuplicates]);

  const handleEmailBlur = useCallback((email: string) => {
    if (email && email.includes("@")) {
      checkDuplicates(email, form.getValues("phone"));
    }
  }, [form, checkDuplicates]);

  const hasWarnings = duplicateWarnings.emailExists || duplicateWarnings.phoneExists;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl bg-transparent border-0 shadow-none">
        <AnimatePresence mode="wait">
          {open && (
            <GlassModal
              className="max-w-[500px] max-h-[90vh] overflow-hidden"
              variants={modalContent}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                className="overflow-y-auto max-h-[80vh]"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={staggerItem}>
                  <DialogHeader className="pb-6">
                    <DialogTitle className="flex items-center space-x-2 text-xl font-semibold">
                      <motion.div
                        className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                      >
                        <User className="w-5 h-5" />
                      </motion.div>
                      <span>Add New Person</span>
                    </DialogTitle>
                  </DialogHeader>
                </motion.div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Duplicate Warnings */}
                    <AnimatePresence>
                      {hasWarnings && (
                        <motion.div
                          variants={fadeInUp}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 shadow-elevation-2">
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
                        </motion.div>
                      )}
                    </AnimatePresence>

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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
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
                    <motion.div 
                      className="flex justify-end space-x-3 pt-4"
                      variants={staggerItem}
                    >
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
                      <PrimaryButton 
                        type="submit" 
                        disabled={createPersonMutation.isPending || isCheckingDuplicates}
                        loading={createPersonMutation.isPending}
                        className={hasWarnings ? "from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700" : ""}
                        data-testid="button-create-person"
                      >
                        {hasWarnings ? "Create Anyway" : "Create Person"}
                      </PrimaryButton>
                    </motion.div>

                    {/* Validation Summary */}
                    <motion.div 
                      className="text-xs text-muted-foreground"
                      variants={staggerItem}
                    >
                      <p>* Required fields</p>
                      <p>Either email or phone number must be provided</p>
                    </motion.div>
                  </form>
                </Form>
              </motion.div>
            </GlassModal>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}