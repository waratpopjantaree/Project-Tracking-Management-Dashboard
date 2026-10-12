import React, { useState, useEffect } from 'react';
import { 
  Project, 
  Task, 
  Issue, 
  AppSettings 
} from './types';
import { 
  sampleProjects, 
  sampleTasks, 
  sampleIssues, 
  initialSettings 
} from './data/sampleData';
import { generateNextId } from './utils/calculations';
import { Header } from './components/Header';
import { TabsNav, TabKey } from './components/TabsNav';
import { DashboardView } from './components/views/DashboardView';
import { ProjectMasterView } from './components/views/ProjectMasterView';
import { TaskTrackingView } from './components/views/TaskTrackingView';
import { IssueLogView } from './components/views/IssueLogView';
import { TimelineView } from './components/views/TimelineView';
import { SettingsView } from './components/views/SettingsView';
import { BlueprintView } from './components/views/BlueprintView';
import { ProjectModal } from './components/modals/ProjectModal';
import { TaskModal } from './components/modals/TaskModal';
import { IssueModal } from './components/modals/IssueModal';

const STORAGE_KEYS = {
  PROJECTS: 'pts_projects_v1',
  TASKS: 'pts_tasks_v1',
  ISSUES: 'pts_issues_v1',
  SETTINGS: 'pts_settings_v1'
};

export default function App() {
  // Main state with localStorage persistence
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : sampleProjects;
    } catch {
      return sampleProjects;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : sampleTasks;
    } catch {
      return sampleTasks;
    }
  });

  const [issues, setIssues] = useState<Issue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ISSUES);
      return saved ? JSON.parse(saved) : sampleIssues;
    } catch {
      return sampleIssues;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultTaskProjectId, setDefaultTaskProjectId] = useState<string | undefined>(undefined);

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [defaultIssueProjectId, setDefaultIssueProjectId] = useState<string | undefined>(undefined);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Handlers for Projects
  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.projectId === project.projectId ? project : p));
    } else {
      setProjects(prev => [...prev, project]);
    }
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.projectId !== projectId));
    // Also delete linked tasks and issues
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    setIssues(prev => prev.filter(i => i.projectId !== projectId));
  };

  // Handlers for Tasks
  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.taskId === task.taskId ? task : t));
    } else {
      setTasks(prev => [...prev, task]);
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.taskId !== taskId));
  };

  // Handlers for Issues
  const handleSaveIssue = (issue: Issue) => {
    if (editingIssue) {
      setIssues(prev => prev.map(i => i.issueId === issue.issueId ? issue : i));
    } else {
      setIssues(prev => [...prev, issue]);
    }
    setEditingIssue(null);
  };

  const handleDeleteIssue = (issueId: string) => {
    setIssues(prev => prev.filter(i => i.issueId !== issueId));
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้น 3 โครงการตัวอย่างใช่หรือไม่?')) {
      setProjects(sampleProjects);
      setTasks(sampleTasks);
      setIssues(sampleIssues);
      setSettings(initialSettings);
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.ISSUES);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    }
  };

  // Open modals
  const openNewProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const openEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const openNewTask = (projectId?: string) => {
    setEditingTask(null);
    setDefaultTaskProjectId(projectId);
    setIsTaskModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setDefaultTaskProjectId(task.projectId);
    setIsTaskModalOpen(true);
  };

  const openNewIssue = (projectId?: string) => {
    setEditingIssue(null);
    setDefaultIssueProjectId(projectId);
    setIsIssueModalOpen(true);
  };

  const openEditIssue = (issue: Issue) => {
    setEditingIssue(issue);
    setDefaultIssueProjectId(issue.projectId);
    setIsIssueModalOpen(true);
  };

  const nextProjectId = generateNextId('PRJ', projects.map(p => ({ projectId: p.projectId })));
  const nextTaskId = generateNextId('TASK', tasks.map(t => ({ taskId: t.taskId })));
  const nextIssueId = generateNextId('ISS', issues.map(i => ({ issueId: i.issueId })));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-purple-100 selection:text-purple-900">
      {/* Top Header */}
      <Header
        onOpenNewProject={openNewProject}
        onOpenNewTask={() => openNewTask()}
        onOpenNewIssue={() => openNewIssue()}
        onOpenBlueprint={() => setActiveTab('blueprint')}
        onResetData={handleResetData}
        activeTab={activeTab}
      />

      {/* Sheets Navigation Bar */}
      <TabsNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={{
          projects: projects.length,
          tasks: tasks.length,
          issues: issues.length
        }}
      />

      {/* Active Tab View */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            projects={projects}
            tasks={tasks}
            issues={issues}
            settings={settings}
            onNavigateToTab={setActiveTab}
            onOpenTaskModal={() => openNewTask()}
            onOpenIssueModal={() => openNewIssue()}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectMasterView
            projects={projects}
            tasks={tasks}
            issues={issues}
            settings={settings}
            onAddProject={openNewProject}
            onEditProject={openEditProject}
            onDeleteProject={handleDeleteProject}
            onSelectProjectFilter={() => {}}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskTrackingView
            tasks={tasks}
            projects={projects}
            settings={settings}
            onAddTask={() => openNewTask()}
            onEditTask={openEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'issues' && (
          <IssueLogView
            issues={issues}
            projects={projects}
            settings={settings}
            onAddIssue={() => openNewIssue()}
            onEditIssue={openEditIssue}
            onDeleteIssue={handleDeleteIssue}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            projects={projects}
            tasks={tasks}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
          />
        )}

        {activeTab === 'blueprint' && (
          <BlueprintView />
        )}
      </main>

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        initialProject={editingProject}
        generatedId={nextProjectId}
        settings={settings}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        generatedId={nextTaskId}
        projects={projects}
        settings={settings}
        defaultProjectId={defaultTaskProjectId}
      />

      <IssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSave={handleSaveIssue}
        initialIssue={editingIssue}
        generatedId={nextIssueId}
        projects={projects}
        settings={settings}
        defaultProjectId={defaultIssueProjectId}
      />
    </div>
  );
}
