'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Narcymorph</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300">{user.username}</span>
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Tableau de bord</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Bienvenue, {user.username}!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Votre profil est en cours de création. Complétez les étapes suivantes pour découvrir
              votre personnalité.
            </p>

            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  ✓
                </div>
                <span>Compte créé</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  1
                </div>
                <span className="text-gray-500">Upload de photo</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  2
                </div>
                <span className="text-gray-500">Questionnaire de personnalité</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  3
                </div>
                <span className="text-gray-500">Analyse IA</span>
              </div>
            </div>

            <div className="mt-8">
              <Button size="lg">Commencer l'onboarding</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h4 className="font-semibold mb-2">Profil</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                0% completé
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h4 className="font-semibold mb-2">Associations</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                0 découvertes
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h4 className="font-semibold mb-2">Amis</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                0 amis
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
