"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Calendar, 
  BookOpen, 
  Settings,
  Plus,
  Crown,
  Edit,
  Eye,
  Shield,
  Clock,
  MessageSquare,
  FileText
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'writer' | 'reviewer';
  avatar: string;
  last_active: string;
  content_count: number;
}

interface ContentCalendarItem {
  id: string;
  title: string;
  type: string;
  assignee: string;
  due_date: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  priority: 'low' | 'medium' | 'high';
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  usage_count: number;
  created_by: string;
}

export default function TeamCollaboration() {
  const [activeTab, setActiveTab] = useState("team");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [calendarItems, setCalendarItems] = useState<ContentCalendarItem[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      // Mock data for demo
      setTeamMembers([
        {
          id: "1",
          name: "Sarah Chen",
          email: "sarah@company.com",
          role: 'admin',
          avatar: "SC",
          last_active: "2024-01-15T10:30:00Z",
          content_count: 24
        },
        {
          id: "2", 
          name: "Mike Johnson",
          email: "mike@company.com",
          role: 'editor',
          avatar: "MJ",
          last_active: "2024-01-15T09:15:00Z",
          content_count: 18
        },
        {
          id: "3",
          name: "Emily Davis",
          email: "emily@company.com", 
          role: 'writer',
          avatar: "ED",
          last_active: "2024-01-14T16:45:00Z",
          content_count: 32
        }
      ]);

      setCalendarItems([
        {
          id: "cal-1",
          title: "Q1 Product Launch Blog Series",
          type: "Blog Post",
          assignee: "Emily Davis",
          due_date: "2024-01-20",
          status: 'draft',
          priority: 'high'
        },
        {
          id: "cal-2",
          title: "Customer Success Story Video",
          type: "Video Content",
          assignee: "Mike Johnson",
          due_date: "2024-01-18",
          status: 'review',
          priority: 'medium'
        }
      ]);

      setTemplates([
        {
          id: "tpl-1",
          name: "Product Launch Blog",
          description: "Standard template for product announcement blogs",
          category: "Marketing",
          usage_count: 15,
          created_by: "Sarah Chen"
        },
        {
          id: "tpl-2",
          name: "Customer Case Study",
          description: "Template for customer success stories",
          category: "Sales",
          usage_count: 8,
          created_by: "Mike Johnson"
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'editor': return <Edit className="w-4 h-4 text-blue-600" />;
      case 'writer': return <FileText className="w-4 h-4 text-green-600" />;
      case 'reviewer': return <Eye className="w-4 h-4 text-purple-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { id: "team", label: "Team Members", icon: Users },
    { id: "calendar", label: "Content Calendar", icon: Calendar },
    { id: "templates", label: "Template Library", icon: BookOpen },
    { id: "permissions", label: "Permissions", icon: Shield }
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
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold">Team Collaboration</h3>
          <Badge className="bg-blue-100 text-blue-700">Team</Badge>
        </div>
        
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Invite Member
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
                  ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Team Members */}
      {activeTab === "team" && (
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-purple-600">{member.avatar}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{member.name}</h4>
                      {getRoleIcon(member.role)}
                      <Badge variant="outline" className="text-xs capitalize">
                        {member.role}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{member.email}</div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last active: {new Date(member.last_active).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {member.content_count} pieces created
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Calendar */}
      {activeTab === "calendar" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Upcoming Content</h4>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Content
            </Button>
          </div>

          {calendarItems.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-semibold">{item.title}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{item.type}</Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority} priority
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium">Due: {new Date(item.due_date).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-600">Assigned to: {item.assignee}</div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline">View</Button>
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm">Update Status</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Library */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Content Templates</h4>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold">{template.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <div>Used {template.usage_count} times</div>
                    <div>Created by {template.created_by}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm">Use Template</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permissions */}
      {activeTab === "permissions" && (
        <div className="space-y-6">
          <h4 className="font-semibold">Role Permissions</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                role: "Admin",
                permissions: ["Full access", "User management", "Billing", "Settings"],
                color: "yellow"
              },
              {
                role: "Editor", 
                permissions: ["Edit all content", "Approve content", "Manage templates"],
                color: "blue"
              },
              {
                role: "Writer",
                permissions: ["Create content", "Edit own content", "Use templates"],
                color: "green"
              },
              {
                role: "Reviewer",
                permissions: ["View content", "Add comments", "Approve content"],
                color: "purple"
              }
            ].map((roleData, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full bg-${roleData.color}-500`}></div>
                  <h5 className="font-semibold">{roleData.role}</h5>
                </div>
                
                <ul className="space-y-1">
                  {roleData.permissions.map((permission, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      {permission}
                    </li>
                  ))}
                </ul>
                
                <Button size="sm" variant="outline" className="mt-3">
                  Edit Permissions
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}