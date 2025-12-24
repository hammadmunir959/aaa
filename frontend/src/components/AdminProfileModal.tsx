import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Mail, Shield, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AdminProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminProfileModal = ({ open, onOpenChange }: AdminProfileModalProps) => {
  const { user } = useAuth();

  if (!user) return null;

  const adminName =
    user.firstName || user.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : "Admin User";

  const getStatusBadge = () => {
    if (!user.status) return null;

    const statusConfig = {
      active: {
        label: "Active",
        variant: "default" as const,
        icon: CheckCircle2,
        className: "bg-green-500 hover:bg-green-600",
      },
      pending_approval: {
        label: "Pending Approval",
        variant: "secondary" as const,
        icon: Clock,
        className: "bg-accent hover:bg-accent/90",
      },
      suspended: {
        label: "Suspended",
        variant: "destructive" as const,
        icon: XCircle,
        className: "bg-red-500 hover:bg-red-600",
      },
    };

    const config = statusConfig[user.status];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getAdminTypeBadge = () => {
    const isSuperAdmin = user.adminType === "super-admin";
    return (
      <Badge variant={isSuperAdmin ? "default" : "secondary"}>
        <Shield className="w-3 h-3 mr-1" />
        {isSuperAdmin ? "Super Admin" : "Admin"}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Admin Profile
          </DialogTitle>
          <DialogDescription>
            View your admin account information and status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{adminName}</h3>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge()}
                {getAdminTypeBadge()}
              </div>
            </div>
          </div>

          <Separator />

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{adminName}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user.email}</span>
                {user.isEmailVerified && (
                  <Badge variant="outline" className="ml-2">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Admin Type</label>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="capitalize">{user.adminType.replace("-", " ")}</span>
              </div>
            </div>

            {user.status && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                <div className="flex items-center gap-2 text-sm">
                  {getStatusBadge()}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">User ID</label>
              <div className="text-sm text-muted-foreground font-mono">
                #{user.id}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProfileModal;

