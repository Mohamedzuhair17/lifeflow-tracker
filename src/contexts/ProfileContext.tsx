import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface ProfileData {
    nickname: string;
    age: string;
    favQuote: string;
    goal: string;
}

const DEFAULT_PROFILE: ProfileData = {
    nickname: "",
    age: "",
    favQuote: "",
    goal: "",
};

interface ProfileContextType {
    profile: ProfileData;
    updateProfile: (newData: Partial<ProfileData>) => Promise<void>;
    loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ProfileData>(() => {
        if (typeof window === "undefined") return DEFAULT_PROFILE;
        const saved = localStorage.getItem("lifetrack_profile");
        return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (data) {
                    const profileData = {
                        nickname: data.nickname || "",
                        age: data.age?.toString() || "",
                        favQuote: data.fav_quote || "",
                        goal: data.goal || "",
                    };
                    setProfile(profileData);
                    localStorage.setItem("lifetrack_profile", JSON.stringify(profileData));
                } else if (error && error.code === "PGRST116") {
                    setProfile(DEFAULT_PROFILE);
                }
            } catch (err) {
                console.error("Profile sync error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const updateProfile = async (newData: Partial<ProfileData>) => {
        const updated = { ...profile, ...newData };
        setProfile(updated);
        localStorage.setItem("lifetrack_profile", JSON.stringify(updated));

        if (user) {
            const { error } = await supabase.from("profiles").upsert({
                id: user.id,
                nickname: updated.nickname,
                age: updated.age ? parseInt(updated.age) : null,
                fav_quote: updated.favQuote,
                goal: updated.goal,
                updated_at: new Date().toISOString(),
            });

            if (error) {
                toast.error("Cloud sync failed: " + error.message);
            }
        }
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile, loading }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};
