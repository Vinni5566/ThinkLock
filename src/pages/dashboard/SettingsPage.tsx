import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useThemeStore } from '@/store/useThemeStore';

const SettingsPage = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your ThinkLock preferences.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="gradient-card rounded-2xl p-6 space-y-6 border border-border">
        <h3 className="font-semibold text-sm border-b border-border pb-4">Appearance</h3>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Dark Mode</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Toggle between light and dark theme.</p>
          </div>
          <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
