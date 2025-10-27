import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          Narcymorph
        </h1>

        <p className="text-2xl text-gray-600 dark:text-gray-300 mb-4">
          Découvrez votre personnalité à travers l'IA
        </p>

        <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Analyse psychologique combinant questionnaire, morphopsychologie et associations culturelles
          pour créer votre profil unique
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Commencer l'aventure
            </Button>
          </Link>

          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Se connecter
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Analyse IA</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Profil psychologique détaillé basé sur vos réponses et votre photo
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold mb-2">Associations Culturelles</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Découvrez votre animal totem, personnage Naruto, maison Harry Potter...
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Chat IA Personnalisé</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Conversez avec l'IA pour affiner votre profil de personnalité
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
