import Link from 'next/link';

export default function PolitiquePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 py-16 px-6 selection:bg-gray-200">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[32px] p-12">
        <header className="mb-10 border-b border-gray-100 pb-8">
          <Link href="/kodo-pos" className="text-sm font-semibold text-gray-400 hover:text-black transition-colors flex items-center gap-1 mb-4">
            ← Retour à l&apos;obtention de Kōdo POS
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-black mb-2">Politique de Confidentialité</h1>
          <p className="text-gray-400 text-sm">Dernière mise à jour : 18 juillet 2026</p>
        </header>

        <main className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-black mb-3">1. Introduction</h2>
            <p>
              Chez **Kōdo Solutions**, nous accordons une importance primordiale à la protection de vos données personnelles. La présente politique décrit comment nous collectons, utilisons, conservons et protégeons vos informations lors du téléchargement et de l&apos;utilisation de notre application de caisse **Kōdo POS**.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">2. Données Collectées</h2>
            <p>
              Nous collectons uniquement les données strictement nécessaires aux finalités de nos services :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>Données de lead/téléchargement</strong> : Votre nom, adresse email professionnelle et le nom de votre établissement commercial.</li>
              <li><strong>Données de synchronisation cloud (si activée)</strong> : Les données transactionnelles (tickets, ventes de produits, clôtures Z, signatures d&apos;intégrité) synchronisées de manière sécurisée vers votre espace Cloud personnel hébergé sur Firebase Firestore.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">3. Finalités du Traitement</h2>
            <p>
              Vos données sont traitées pour :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>Permettre le téléchargement et l&apos;activation de votre licence Kōdo POS.</li>
              <li>Assurer la synchronisation en temps réel de votre point de vente pour éviter la perte de données en cas de panne matérielle.</li>
              <li>Garantir la conformité comptable et la génération légale des rapports d&apos;audit (Audit Trail).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">4. Conservation des Données</h2>
            <p>
              Les données de lead sont conservées pendant toute la durée de la relation commerciale et un maximum de 3 ans après notre dernier contact. Vos données transactionnelles de caisse sont stockées localement sur votre Mac et sur votre instance Firebase, et sont conservées conformément aux exigences fiscales et comptables locales (généralement 7 à 10 ans).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">5. Partage des Données</h2>
            <p>
              Kōdo Solutions ne vend, ne loue, ni ne partage aucune de vos données personnelles ou commerciales avec des tiers. Nos sous-traitants techniques (hébergement Google Firebase / Vercel) respectent des engagements stricts de sécurité et de conformité au RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">6. Sécurité du Hachage et Protection</h2>
            <p>
              L&apos;accès à l&apos;application Kōdo POS est sécurisé par un code PIN. Vos codes PIN sont hachés de manière irréversible (SHA-256 avec grain de sel) localement dans la base de données SQLite. Les connexions réseau pour les synchronisations Shopify et Cloud utilisent des protocoles HTTPS chiffrés et sécurisés de bout en bout.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">7. Vos Droits (RGPD)</h2>
            <p>
              Conformément à la réglementation européenne sur la protection des données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de portabilité, de limitation et d&apos;effacement de vos données personnelles. Pour exercer ces droits, vous pouvez nous contacter à l&apos;adresse email : <strong>privacy@kodo-solutions.be</strong>.
            </p>
          </section>
        </main>

        <footer className="mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
          Kōdo Solutions Belgique • Tous droits réservés.
        </footer>
      </div>
    </div>
  );
}
