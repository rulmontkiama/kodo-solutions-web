import Link from 'next/link';

export default function PolitiquePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 py-16 px-6 selection:bg-gray-200">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[32px] p-12">
        <header className="mb-10 border-b border-gray-100 pb-8">
          <Link href="/kodo-pos" className="text-sm font-semibold text-gray-400 hover:text-black transition-colors flex items-center gap-1 mb-4">
            ← Retour à Kōdo POS
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-black mb-2">Politique de Confidentialité</h1>
          <p className="text-gray-400 text-sm">Dernière mise à jour : 18 juillet 2026 • Bêta Fermée Commerce de Détail (Belgique)</p>
        </header>

        <main className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-black mb-3">1. Cadre du Traitement des Données</h2>
            <p>
              Dans le cadre du programme de test bêta privé du logiciel de caisse <strong>Kōdo POS</strong>, édité par son concepteur indépendant en Belgique, la confidentialité et la sécurité de vos données commerciales et personnelles sont scrupuleusement préservées conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">2. Données Collectées</h2>
            <p>
              Les catégories de données traitées sont strictly limitées à la gestion du banc d&apos;essai B2B :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>Candidature Bêta & Contact</strong> : Nom du gérant, nom et adresse de la boutique de vêtements, ville, adresse e-mail professionnelle.</li>
              <li><strong>Données de test opérationnel (si synchronisation cloud activée)</strong> : Tickets de test, gestion de stock d&apos;articles textiles (tailles/couleurs), registres d&apos;intégrité locaux hachés en SHA-256 stockés de manière étanche.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">3. Finalités Exclusives</h2>
            <p>
              Vos données sont traitées exclusivement pour :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>Évaluer et valider l&apos;éligibilité de votre boutique au programme de test bêta privé.</li>
              <li>Vous contacter pour l&apos;établissement de la convention de test bêta et l&apos;activation des identifiants de test.</li>
              <li>Analyser les retours d&apos;expérience techniques (logs de bugs, retours d&apos;usage) pour améliorer le logiciel.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">4. Non-commercialisation & Hébergement</h2>
            <p>
              Vos données ne sont jamais vendues, louées ou cédées à des tiers à des fins commerciales. L&apos;infrastructure technique s&apos;appuie sur Google Firebase et Vercel avec des protocoles de chiffrement conformes aux normes européennes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">5. Sécurité & Hachage des Identifiants</h2>
            <p>
              Les accès à l&apos;application sont protégés par PIN avec hachage irréversible (SHA-256 avec grain de sel) localement dans la base de données. Toutes les communications réseau utilisent des connexions chiffrées HTTPS de bout en bout.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">6. Vos Droits (RGPD)</h2>
            <p>
              Conformément à la réglementation RGPD, vous bénéficiez d&apos;un droit d&apos;accès, de rectification, d&apos;opposition et de suppression de vos données personnelles. Vous pouvez exercer ce droit à tout moment en contactant le concepteur via le formulaire officiel du site.
            </p>
          </section>
        </main>

        <footer className="mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
          Kōdo POS • Développeur Indépendant Belgique • Protection des données RGPD.
        </footer>
      </div>
    </div>
  );
}
