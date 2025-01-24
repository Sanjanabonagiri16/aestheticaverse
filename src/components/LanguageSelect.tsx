import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
];

interface LanguageSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const LanguageSelect = ({ value, onValueChange }: LanguageSelectProps) => {
  const [loading, setLoading] = useState(false);

  const saveLanguagePreference = async (language: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to save language preference");
        return;
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferred_language: language,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      toast.success("Language preference saved!");
    } catch (error) {
      console.error("Error saving language preference:", error);
      toast.error("Failed to save language preference");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newValue: string) => {
    onValueChange(newValue);
    saveLanguagePreference(newValue);
  };

  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('user_preferences')
          .select('preferred_language')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (data?.preferred_language) {
          onValueChange(data.preferred_language);
        }
      } catch (error) {
        console.error("Error loading language preference:", error);
      }
    };

    loadLanguagePreference();
  }, []);

  return (
    <Select value={value} onValueChange={handleLanguageChange} disabled={loading}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map(({ code, name }) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};