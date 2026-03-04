import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';

// Hooks & UI
import { useAdmin } from '../hooks/useAdmin';
import Notification from './ui/Notification';

// Modular Components
import Sidebar from './admin/Sidebar';
import LoginForm from './admin/LoginForm';
import ProfileEditor from './admin/ProfileEditor';
import ProjectsEditor from './admin/ProjectsEditor';
import SkillsEditor from './admin/SkillsEditor';
import ExperienceEditor from './admin/ExperienceEditor';
import SettingsEditor from './admin/SettingsEditor';
import AboutEditor from './admin/AboutEditor';

export default function AdminPanel() {
  const {
    user,
    data,
    loading,
    authLoading,
    saving,
    uploading,
    notification,
    login,
    logout,
    saveSection,
    uploadImage,
    deleteImage,
    updateField,
    addItem,
    removeItem,
    showNotification
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (authLoading) return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="font-mono text-orange-400">Verificando sesión...</div>
    </div>
  );

  if (!user) return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleLogin={(e) => { e.preventDefault(); login(email, password); }}
      saving={saving}
    />
  );

  if (loading || !data) return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="font-mono text-orange-400">Cargando datos...</div>
    </div>
  );

  const renderContent = () => {
    const commonProps = { data, saving, handleSave: saveSection, updateField };
    const listProps = { ...commonProps, addItem, removeItem };
    const uploadProps = { ...commonProps, uploading, handleFileUpload: uploadImage };

    switch (activeTab) {
      case 'profile':
        return <ProfileEditor {...uploadProps} handleDeleteImage={deleteImage} />;
      case 'projects':
        return <ProjectsEditor {...uploadProps} addItem={addItem} removeItem={removeItem} />;
      case 'skills':
        return <SkillsEditor {...listProps} />;
      case 'experience':
        return <ExperienceEditor {...listProps} />;
      case 'about':
        return <AboutEditor {...uploadProps} handleDeleteImage={deleteImage} />;
      case 'settings':
        return <SettingsEditor {...uploadProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleLogout={logout}
      />

      <main className="flex-1 lg:ml-72 p-6 md:p-12 max-w-7xl mx-auto">
        {renderContent()}
      </main>

      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => { }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
