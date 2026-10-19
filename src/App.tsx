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
import { ConfirmDeleteModal } from './components/modals/ConfirmDeleteModal';

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

  // Deletion Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    type: 'project' | 'task' | 'issue' | 'reset';
    associatedTasksCount?: number;
    associatedIssuesCount?: number;
  } | null>(null);

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

  const executeDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.projectId !== projectId));
    // Also delete linked tasks and issues
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    setIssues(prev => prev.filter(i => i.projectId !== projectId));
  };

  const promptDeleteProject = (projectId: string) => {
    const proj = projects.find(p => p.projectId === projectId);
    if (!proj) return;
    const linkedTasks = tasks.filter(t => t.projectId === projectId).length;
    const linkedIssues = issues.filter(i => i.projectId === projectId).length;

    setDeleteTarget({
      id: proj.projectId,
      name: proj.projectName,
      type: 'project',
      associatedTasksCount: linkedTasks,
      associatedIssuesCount: linkedIssues
    });
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

  const executeDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.taskId !== taskId));
  };

  const promptDeleteTask = (taskId: string) => {
    const t = tasks.find(item => item.taskId === taskId);
    if (!t) return;
    setDeleteTarget({
      id: t.taskId,
      name: t.taskName,
      type: 'task'
    });
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

  const executeDeleteIssue = (issueId: string) => {
    setIssues(prev => prev.filter(i => i.issueId !== issueId));
  };

  const promptDeleteIssue = (issueId: string) => {
    const i = issues.find(item => item.issueId === issueId);
    if (!i) return;
    setDeleteTarget({
      id: i.issueId,
      name: i.title,
      type: 'issue'
    });
  };

  // Reset to initial demo data
  const executeResetData = () => {
    setProjects(sampleProjects);
    setTasks(sampleTasks);
    setIssues(sampleIssues);
    setSettings(initialSettings);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.ISSUES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  };

  const promptResetData = () => {
    setDeleteTarget({
      id: 'ALL',
      name: 'ข้อมูลโครงการทั้งหมด',
      type: 'reset'
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'project') {
      executeDeleteProject(deleteTarget.id);
    } else if (deleteTarget.type === 'task') {
      executeDeleteTask(deleteTarget.id);
    } else if (deleteTarget.type === 'issue') {
      executeDeleteIssue(deleteTarget.id);
    } else if (deleteTarget.type === 'reset') {
      executeResetData();
    }
    setDeleteTarget(null);
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
        onResetData={promptResetData}
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
            onOpenProjectModal={openNewProject}
            onEditProject={openEditProject}
            onDeleteProject={promptDeleteProject}
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
            onDeleteProject={promptDeleteProject}
            onSelectProjectFilter={() => {}}
            onUpdateSettings={setSettings}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskTrackingView
            tasks={tasks}
            projects={projects}
            settings={settings}
            onAddTask={() => openNewTask()}
            onEditTask={openEditTask}
            onDeleteTask={promptDeleteTask}
          />
        )}

        {activeTab === 'issues' && (
          <IssueLogView
            issues={issues}
            projects={projects}
            settings={settings}
            onAddIssue={() => openNewIssue()}
            onEditIssue={openEditIssue}
            onDeleteIssue={promptDeleteIssue}
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
        onDelete={promptDeleteProject}
        onUpdateSettings={setSettings}
        initialProject={editingProject}
        generatedId={nextProjectId}
        settings={settings}
        projects={projects}
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

      {/* In-App Deletion & Confirmation Modal (No window.confirm) */}
      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={
          deleteTarget?.type === 'project'
            ? 'ยืนยันการลบโครงการหลัก'
            : deleteTarget?.type === 'task'
            ? 'ยืนยันการลบงานย่อย'
            : deleteTarget?.type === 'issue'
            ? 'ยืนยันการลบปัญหา'
            : 'ยืนยันการรีเซ็ตข้อมูล'
        }
        itemName={deleteTarget?.name || ''}
        itemId={deleteTarget?.id || ''}
        itemType={deleteTarget?.type || 'project'}
        associatedInfo={{
          tasksCount: deleteTarget?.associatedTasksCount,
          issuesCount: deleteTarget?.associatedIssuesCount
        }}
      />
    </div>
  );
}
