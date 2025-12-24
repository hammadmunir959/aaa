import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Database,
  HardDrive,
  Archive,
  RefreshCcw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Download,
  Clock,
  FileText,
  Settings,
  Play,
  Loader2,
  Shield,
  Activity,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardNavBar from "@/components/DashboardNavBar";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  backupApi,
  type BackupStats,
  type BackupFile,
  type BackupConfig,
} from "@/services/backupApi";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

const DataBackup = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createBackupDialogOpen, setCreateBackupDialogOpen] = useState(false);
  const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupFile | null>(null);
  const [cleanupDays, setCleanupDays] = useState(30);

  // Fetch backup statistics
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery<BackupStats, Error>({
    queryKey: ["backup-stats"],
    queryFn: backupApi.getStats,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  // Fetch backup list
  const {
    data: backupsData,
    isLoading: isLoadingBackups,
    error: backupsError,
  } = useQuery<{ backups: BackupFile[] }, Error>({
    queryKey: ["backup-list"],
    queryFn: backupApi.list,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  // Fetch backup configuration
  const {
    data: config,
    isLoading: isLoadingConfig,
  } = useQuery<BackupConfig, Error>({
    queryKey: ["backup-config"],
    queryFn: backupApi.getConfig,
    staleTime: 5 * 60 * 1000,
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: (type: "database" | "media" | "full") => backupApi.create(type),
    onSuccess: (data) => {
      toast({
        title: "Backup Started",
        description: `${data.type} backup task has been queued. Task ID: ${data.task_id}`,
      });
      setCreateBackupDialogOpen(false);
      // Refetch after a delay to show the new backup
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["backup-stats"] });
        queryClient.invalidateQueries({ queryKey: ["backup-list"] });
      }, 5000);
    },
    onError: (error: Error) => {
      toast({
        title: "Backup Failed",
        description: error.message || "Failed to create backup",
        variant: "destructive",
      });
    },
  });

  // Cleanup mutation
  const cleanupMutation = useMutation({
    mutationFn: (days: number) => backupApi.cleanup(days),
    onSuccess: (data) => {
      toast({
        title: "Cleanup Completed",
        description: `Removed ${data.deleted_count} old backup(s) older than ${data.retention_days} days`,
      });
      setCleanupDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["backup-stats"] });
      queryClient.invalidateQueries({ queryKey: ["backup-list"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Cleanup Failed",
        description: error.message || "Failed to cleanup backups",
        variant: "destructive",
      });
    },
  });

  // Verify backup mutation
  const verifyMutation = useMutation({
    mutationFn: (path: string) => backupApi.verify(path),
    onSuccess: (data) => {
      toast({
        title: data.valid ? "Backup Verified" : "Verification Failed",
        description: data.message,
        variant: data.valid ? "default" : "destructive",
      });
      setVerifyDialogOpen(false);
      setSelectedBackup(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify backup",
        variant: "destructive",
      });
    },
  });

  // Download backup mutation
  const downloadMutation = useMutation({
    mutationFn: (filename: string) => backupApi.download(filename),
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "The backup file download has started.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download backup file",
        variant: "destructive",
      });
    },
  });

  const handleCreateBackup = (type: "database" | "media" | "full") => {
    createBackupMutation.mutate(type);
  };

  const handleCleanup = () => {
    cleanupMutation.mutate(cleanupDays);
  };

  const handleVerify = (backup: BackupFile) => {
    setSelectedBackup(backup);
    verifyMutation.mutate(backup.path);
  };

  const handleDownload = (backup: BackupFile) => {
    downloadMutation.mutate(backup.filename);
  };

  const getBackupTypeIcon = (type: string) => {
    switch (type) {
      case "database":
        return <Database className="w-4 h-4" />;
      case "media":
        return <HardDrive className="w-4 h-4" />;
      case "full":
        return <Archive className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getBackupTypeColor = (type: string) => {
    switch (type) {
      case "database":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "media":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "full":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const backups = backupsData?.backups || [];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardNavBar />
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Data Backup</h1>
              <p className="text-muted-foreground mt-1">
                Manage database and media backups, monitor statistics, and perform operations
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={createBackupDialogOpen} onOpenChange={setCreateBackupDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Play className="w-4 h-4 mr-2" />
                    Create Backup
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Backup</DialogTitle>
                    <DialogDescription>
                      Select the type of backup you want to create
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleCreateBackup("database")}
                      disabled={createBackupMutation.isPending}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Database Backup
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleCreateBackup("media")}
                      disabled={createBackupMutation.isPending}
                    >
                      <HardDrive className="w-4 h-4 mr-2" />
                      Media Backup
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleCreateBackup("full")}
                      disabled={createBackupMutation.isPending}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Full Backup (Database + Media)
                    </Button>
                  </div>
                  {createBackupMutation.isPending && (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="text-sm text-muted-foreground">Creating backup...</span>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Dialog open={cleanupDialogOpen} onOpenChange={setCleanupDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cleanup
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cleanup Old Backups</DialogTitle>
                    <DialogDescription>
                      Remove backups older than the specified number of days
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="days">Retention Days</Label>
                      <Input
                        id="days"
                        type="number"
                        min="1"
                        value={cleanupDays}
                        onChange={(e) => setCleanupDays(parseInt(e.target.value) || 30)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={handleCleanup}
                      disabled={cleanupMutation.isPending}
                    >
                      {cleanupMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Cleaning...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Cleanup
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
                <Archive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    stats?.total_backups || 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.backups_by_type.database || 0} database,{" "}
                  {stats?.backups_by_type.media || 0} media,{" "}
                  {stats?.backups_by_type.full || 0} full
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    formatBytes(stats?.total_size_bytes || 0)
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.total_size_mb?.toFixed(2) || 0} MB total storage
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Oldest Backup</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : stats?.oldest_backup ? (
                    formatDistanceToNow(new Date(stats.oldest_backup), { addSuffix: true })
                  ) : (
                    "—"
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.oldest_backup
                    ? format(new Date(stats.oldest_backup), "MMM d, yyyy")
                    : "No backups"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Newest Backup</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : stats?.newest_backup ? (
                    formatDistanceToNow(new Date(stats.newest_backup), { addSuffix: true })
                  ) : (
                    "—"
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.newest_backup
                    ? format(new Date(stats.newest_backup), "MMM d, yyyy HH:mm")
                    : "No backups"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Card */}
          {config && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Backup Configuration
                </CardTitle>
                <CardDescription>Current backup system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge variant={config.enabled ? "default" : "secondary"} className="mt-1">
                      {config.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Retention Period</p>
                    <p className="text-sm text-muted-foreground mt-1">{config.retention_days} days</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Storage Type</p>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">{config.storage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Schedule</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Daily at {config.schedule_hour}:00
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium">Backup Directory</p>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    {config.backup_directory}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Backups Table */}
          <Card>
            <CardHeader>
              <CardTitle>Backup Files</CardTitle>
              <CardDescription>
                List of all available backup files with details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingBackups ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : backupsError ? (
                <div className="flex items-center justify-center py-8 text-destructive">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Failed to load backups: {backupsError.message}
                </div>
              ) : backups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Archive className="w-12 h-12 mb-2 opacity-50" />
                  <p>No backups found</p>
                  <p className="text-sm mt-1">Create your first backup to get started</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Filename</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups.map((backup) => (
                      <TableRow key={backup.path}>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getBackupTypeColor(backup.type)}
                          >
                            <span className="flex items-center gap-1">
                              {getBackupTypeIcon(backup.type)}
                              {backup.type}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {backup.filename}
                        </TableCell>
                        <TableCell>{formatBytes(backup.size)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{format(new Date(backup.created), "MMM d, yyyy")}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(backup.created), "HH:mm:ss")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(backup)}
                              disabled={downloadMutation.isPending}
                              title="Download backup"
                            >
                              {downloadMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(backup)}
                              disabled={verifyMutation.isPending}
                              title="Verify backup integrity"
                            >
                              {verifyMutation.isPending &&
                              selectedBackup?.path === backup.path ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default DataBackup;

