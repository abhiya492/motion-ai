"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Workflow, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Send,
  Settings,
  Zap,
  Globe,
  Shield
} from "lucide-react";

interface WorkflowStep {
  id: string;
  name: string;
  assignee: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  due_date: string;
  comments?: string;
}

interface ContentWorkflow {
  id: string;
  content_title: string;
  current_step: number;
  steps: WorkflowStep[];
  created_at: string;
  priority: 'low' | 'medium' | 'high';
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  executions: number;
}

export default function WorkflowAutomation() {
  const [activeTab, setActiveTab] = useState("workflows");
  const [workflows, setWorkflows] = useState<ContentWorkflow[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const fetchWorkflowData = async () => {
    try {
      // Mock data for demo
      setWorkflows([
        {
          id: "wf-1",
          content_title: "Q4 Product Launch Blog Series",
          current_step: 1,
          steps: [
            {
              id: "step-1",
              name: "Content Creation",
              assignee: "Sarah Chen",
              status: 'completed',
              due_date: "2024-01-15",
              comments: "Initial draft completed"
            },
            {
              id: "step-2", 
              name: "Brand Review",
              assignee: "Marketing Team",
              status: 'in_progress',
              due_date: "2024-01-17"
            },
            {
              id: "step-3",
              name: "Legal Compliance",
              assignee: "Legal Team",
              status: 'pending',
              due_date: "2024-01-20"
            },
            {
              id: "step-4",
              name: "Final Approval",
              assignee: "CMO",
              status: 'pending',
              due_date: "2024-01-22"
            }
          ],
          created_at: "2024-01-10",
          priority: 'high'
        }
      ]);

      setAutomationRules([
        {
          id: "rule-1",
          name: "Auto-assign by Topic",
          trigger: "Content contains 'product'",
          action: "Assign to Product Marketing Team",
          enabled: true,
          executions: 23
        },
        {
          id: "rule-2",
          name: "Brand Compliance Check",
          trigger: "Content ready for review",
          action: "Run brand guideline analysis",
          enabled: true,
          executions: 156
        },
        {
          id: "rule-3",
          name: "Multi-channel Publishing",
          trigger: "Content approved",
          action: "Publish to website, social, email",
          enabled: false,
          executions: 89
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { id: "workflows", label: "Active Workflows", icon: Workflow },
    { id: "automation", label: "Automation Rules", icon: Zap },
    { id: "templates", label: "Workflow Templates", icon: Settings }
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
      <div className="flex items-center gap-3 mb-6">
        <Workflow className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold">Workflow Automation</h3>
        <Badge className="bg-blue-100 text-blue-700">Enterprise</Badge>
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
                  ? 'bg-white dark:bg-gray-600 text-purple-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Workflows */}
      {activeTab === "workflows" && (
        <div className="space-y-6">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-lg">{workflow.content_title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={workflow.priority === 'high' ? 'destructive' : workflow.priority === 'medium' ? 'secondary' : 'outline'}>
                      {workflow.priority} priority
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Created {new Date(workflow.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button size="sm">
                  <Send className="w-4 h-4 mr-1" />
                  Send Reminder
                </Button>
              </div>

              {/* Workflow Steps */}
              <div className="space-y-3">
                {workflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(step.status)}
                      <span className="font-medium">{step.name}</span>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{step.assignee}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(step.status)}>
                          {step.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Due: {new Date(step.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-500">
                    {workflow.steps.filter(s => s.status === 'completed').length} of {workflow.steps.length} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(workflow.steps.filter(s => s.status === 'completed').length / workflow.steps.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Automation Rules */}
      {activeTab === "automation" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Automation Rules</h4>
            <Button size="sm">
              <Zap className="w-4 h-4 mr-1" />
              Create Rule
            </Button>
          </div>

          {automationRules.map((rule) => (
            <div key={rule.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h5 className="font-medium">{rule.name}</h5>
                  <Badge variant={rule.enabled ? "default" : "secondary"}>
                    {rule.enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  {rule.executions} executions
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Trigger:</span>
                  <div className="text-gray-600 mt-1">{rule.trigger}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Action:</span>
                  <div className="text-gray-600 mt-1">{rule.action}</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <Button size="sm" variant="outline">Edit</Button>
                <Button 
                  size="sm" 
                  variant={rule.enabled ? "destructive" : "default"}
                >
                  {rule.enabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Workflow Templates */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "Blog Post Workflow",
              description: "Standard blog creation and approval process",
              steps: 4,
              icon: Globe
            },
            {
              name: "Compliance Review",
              description: "Legal and brand compliance workflow",
              steps: 3,
              icon: Shield
            },
            {
              name: "Multi-Channel Publishing",
              description: "Automated publishing across platforms",
              steps: 5,
              icon: Send
            }
          ].map((template, index) => {
            const Icon = template.icon;
            return (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium mb-1">{template.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{template.steps} steps</span>
                      <Button size="sm" variant="outline">Use Template</Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}