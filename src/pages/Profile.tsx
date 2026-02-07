import { motion } from "framer-motion";
import { User, Quote, Target, Calendar, Edit3, Save, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useProfile, ProfileData } from "@/hooks/useProfile";

const Profile = () => {
  const { profile, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(profile);

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  useEffect(() => {
    if (!isEditing) {
      setFormData(profile);
    }
  }, [profile, isEditing]);

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold">About Me</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium opacity-80">
            Tell us a bit about yourself.
          </p>
        </motion.div>

        {/* Profile Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 glow-primary relative"
        >
          <div className="absolute top-6 right-6">
            {!isEditing ? (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-5 w-5" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" /> Save
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <User className="h-12 w-12" />
            </div>

            <div className="flex-1 w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                    My Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      placeholder="e.g. Ace"
                    />
                  ) : (
                    <p className="text-xl font-semibold">{profile.nickname || "Set a nickname"}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Age
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g. 25"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="text-lg">{profile.age ? `${profile.age} years old` : "Set age"}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                  My Aim
                </label>
                {isEditing ? (
                  <Input
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    placeholder="What are you striving for?"
                  />
                ) : (
                  <div className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-lg leading-relaxed italic text-foreground/90">
                      {profile.goal || "Define your main goal"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Favorite Quote
                </label>
                {isEditing ? (
                  <Textarea
                    value={formData.favQuote}
                    onChange={(e) => setFormData({ ...formData, favQuote: e.target.value })}
                    placeholder="Enter a quote that inspires you..."
                    rows={3}
                  />
                ) : (
                  <div className="flex items-start gap-2 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <Quote className="h-5 w-5 text-primary mt-1 scale-x-[-1]" />
                    <p className="text-base italic text-muted-foreground leading-relaxed">
                      {profile.favQuote || "Add a favorite quote to inspire yourself"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Motivational Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Zap className="h-3 w-3" />
            Keep Growing
          </div>
          <h3 className="text-lg font-semibold mb-2">Build Your Best Life</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Reviewing your goals and identity regularly helps you stay focused on what truly matters.
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Profile;
