"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Eye, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  FileText,
  Settings,
  Users,
  Database
} from "lucide-react";

interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ip_address: string;
  status: 'success' | 'failed' | 'warning';
}

interface ComplianceCheck {
  id: string;
  name: string;
  status: 'compliant' | 'non_compliant' | 'warning';
  last_check: string;
  description: string;
  remediation?: string;
}

interface DataRetentionPolicy {
  id: string;
  content_type: string;
  retention_period: number;
  auto_delete: boolean;
  last_cleanup: string;
  items_affected: number;
}

export default function SecurityCompliance() {
  const [activeTab, setActiveTab] = useState("audit");
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [retentionPolicies, setRetentionPolicies] = useState<DataRetentionPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Mock data for demo
      setAuditLogs([
        {
          id: "log-1",
          user: "sarah@company.com",
          action: "Content Published",
          resource: "Blog Post: Q4 Launch",
          timestamp: "2024-01-15T10:30:00Z",
          ip_address: "192.168.1.100",
          status: 'success'
        },
        {
          id: "log-2",
          user: "mike@company.com", 
          action: "User Permission Changed",
          resource: "emily@company.com",
          timestamp: "2024-01-15T09:15:00Z",
          ip_address: "192.168.1.101",
          status: 'success'
        },
        {
          id: "log-3",
          user: "system",
          action: "Failed Login Attempt",
          resource: "admin@company.com",
          timestamp: "2024-01-15T08:45:00Z",
          ip_address: "203.0.113.1",
          status: 'failed'
        }
      ]);

      setComplianceChecks([
        {
          id: "comp-1",
          name: "GDPR Data Processing",
          status: 'compliant',
          last_check: "2024-01-15T06:00:00Z",
          description: "All user data processing complies with GDPR requirements"
        },
        {
          id: "comp-2",
          name: "SOC 2 Type II Controls",
          status: 'compliant',
          last_check: "2024-01-15T06:00:00Z",
          description: "Security controls meet SOC 2 Type II standards"
        },
        {
          id: "comp-3",
          name: "Content Encryption",
          status: 'warning',
          last_check: "2024-01-15T06:00:00Z",
          description: "Some legacy content not encrypted",
          remediation: "Migrate remaining 12 files to encrypted storage"
        },
        {
          id: "comp-4",
          name: "Access Control Review",
          status: 'non_compliant',
          last_check: "2024-01-14T06:00:00Z",
          description: "3 users have excessive permissions",
          remediation: "Review and update user permissions for compliance"
        }
      ]);

      setRetentionPolicies([
        {
          id: "ret-1",
          content_type: "Draft Content",
          retention_period: 90,
          auto_delete: true,
          last_cleanup: "2024-01-10T02:00:00Z",
          items_affected: 45
        },
        {
          id: "ret-2",
          content_type: "Audit Logs",
          retention_period: 2555, // 7 years
          auto_delete: false,
          last_cleanup: "2024-01-01T02:00:00Z",
          items_affected: 0
        },
        {
          id: "ret-3",
          content_type: "User Sessions",
          retention_period: 30,
          auto_delete: true,
          last_cleanup: "2024-01-14T02:00:00Z",
          items_affected: 156
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'failed':
      case 'non_compliant':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'compliant':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
      case 'non_compliant':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { id: "audit", label: "Audit Logs", icon: Eye },
    { id: "compliance", label: "Compliance", icon: Shield },
    { id: "retention", label: "Data Retention", icon: Database },
    { id: "security", label: "Security Settings", icon: Lock }
  ];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-semibold">Security & Compliance</h3>
          <Badge className="bg-red-100 text-red-700">Enterprise</Badge>
        </div>
        
        <Button size="sm" variant="outline">
          <Download className="w-4 h-4 mr-1" />
          Export Report
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 text-red-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Audit Logs */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Recent Activity</h4>
            <div className="flex gap-2">
              <select className="px-3 py-1 border rounded-md text-sm">
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
              <Button size="sm" variant="outline">Filter</Button>
            </div>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <div className="font-medium">{log.action}</div>
                      <div className="text-sm text-gray-600">
                        {log.user} • {log.resource}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div>{new Date(log.timestamp).toLocaleString()}</div>
                    <div>{log.ip_address}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Checks */}
      {activeTab === "compliance" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-green-600">
                {complianceChecks.filter(c => c.status === 'compliant').length}
              </div>
              <div className="text-sm text-green-700">Compliant</div>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="font-semibold text-yellow-600">
                {complianceChecks.filter(c => c.status === 'warning').length}
              </div>
              <div className="text-sm text-yellow-700">Warnings</div>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="font-semibold text-red-600">
                {complianceChecks.filter(c => c.status === 'non_compliant').length}
              </div>
              <div className="text-sm text-red-700">Non-Compliant</div>
            </div>
          </div>

          {complianceChecks.map((check) => (
            <div key={check.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <h5 className="font-semibold">{check.name}</h5>
                    <p className="text-sm text-gray-600">{check.description}</p>
                  </div>
                </div>
                
                <Badge className={getStatusColor(check.status)}>
                  {check.status.replace('_', ' ')}
                </Badge>
              </div>

              {check.remediation && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Remediation Required
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    {check.remediation}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Last checked: {new Date(check.last_check).toLocaleString()}</span>
                <Button size="sm" variant="outline">Run Check</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Retention */}
      {activeTab === "retention" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Data Retention Policies</h4>
            <Button size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Configure Policy
            </Button>
          </div>

          {retentionPolicies.map((policy) => (
            <div key={policy.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-semibold">{policy.content_type}</h5>
                  <div className="text-sm text-gray-600">
                    Retention: {policy.retention_period} days
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={policy.auto_delete ? "default" : "secondary"}>
                    {policy.auto_delete ? "Auto-delete" : "Manual"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Last cleanup:</span>
                  <div>{new Date(policy.last_cleanup).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Items affected:</span>
                  <div>{policy.items_affected}</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <Button size="sm" variant="outline">Edit Policy</Button>
                <Button size="sm" variant="outline">Run Cleanup</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Single Sign-On (SSO)",
                description: "Configure SAML/OIDC integration",
                status: "Configured",
                icon: Users
              },
              {
                title: "Two-Factor Authentication",
                description: "Enforce 2FA for all users",
                status: "Enabled",
                icon: Lock
              },
              {
                title: "Data Encryption",
                description: "AES-256 encryption at rest and in transit",
                status: "Active",
                icon: Shield
              },
              {
                title: "Geographic Restrictions",
                description: "Control data residency and access",
                status: "EU/US Only",
                icon: Globe
              }
            ].map((setting, index) => {
              const Icon = setting.icon;
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <Icon className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold mb-1">{setting.title}</h5>
                      <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-700">
                          {setting.status}
                        </Badge>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}