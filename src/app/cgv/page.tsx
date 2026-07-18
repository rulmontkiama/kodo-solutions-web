import Link from 'next/link';

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 py-16 px-6 selection:bg-gray-200">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[32px] p-12">
        <header className="mb-10 border-b border-gray-100 pb-8">
          <Link href="/kodo-pos" className="text-sm font-semibold text-gray-400 hover:text-black transition-colors flex items-center gap-1 mb-4">
            ← Retour à l'obtention de Kōdo POS
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-black mb-2">Conditions Générales de Vente (CGV)</h1>
          <p className="text-gray-400 text-sm">Dernière mise à jour : 18 juillet 2026</p>
        </header>

        <main className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-black mb-3">1. Objet & Prestations</h2>
            <p>
              Les présentes Conditions Générales de Vente régissent l'acquisition, la concession de licence d'utilisation et le support du logiciel de caisse enregistreuse **Kōdo POS**, développé et commercialisé par **Kōdo Solutions** (Belgique).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">2. Licence d'Utilisation & Propriété Intellectuelle</h2>
            <p>
              Kōdo Solutions concède au client une licence d'utilisation personnelle, non-exclusive, non-transférable et limitée à l'exploitation de son établissement commercial. Le logiciel reste la propriété intellectuelle exclusive de Kōdo Solutions. Toute rétro-ingénierie, modification ou distribution non autorisée du code binaire est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">3. Conformité Légale & Traçabilité (Système de Caisse Enregistreuse)</h2>
            <p>
              Kōdo POS intègre un dispositif d'Audit Trail cryptographique (chaînage des transactions par signature SHA-256) afin de garantir l'inaltérabilité, la conservation et l'archivage des données de vente, conformément aux exigences applicables aux systèmes de caisse enregistreuse en Belgique et en Europe.
            </p>
            <p className="mt-2">
              Le client s'engage à utiliser le logiciel conformément à la législation fiscale en vigueur. Kōdo Solutions ne saurait être tenu responsable en cas d'utilisation frauduleuse ou de non-respect des obligations légales par l'exploitant du commerce.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">4. Tarifs & Modalités de Paiement</h2>
            <p>
              Les tarifs des licences ou abonnements de support sont ceux affichés sur notre site internet au moment de la souscription. Sauf accord contraire, les abonnements sont facturés mensuellement ou annuellement et sont payables par prélèvement ou carte bancaire.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">5. Politique de Remboursement & Rétractation</h2>
            <p>
              Conformément à l'article VI.53, 13° du Code de droit économique belge, le droit de rétractation ne peut être exercé pour la fourniture de contenus numériques non fournis sur un support matériel si l'exécution a commencé avec l'accord préalable exprès du consommateur.
            </p>
            <p className="mt-2">
              Aucun remboursement ne sera accordé après le téléchargement effectif du fichier d'installation (DMG) ou après l'activation de la licence de production.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">6. Responsabilité & Garantie</h2>
            <p>
              Kōdo POS est fourni « en l'état ». Kōdo Solutions met en œuvre tous les moyens raisonnables pour assurer le bon fonctionnement du logiciel, mais ne garantit pas une exécution totalement exempte d'erreurs ou ininterrompue. Notre responsabilité maximale est limitée au montant effectivement payé par le client pour la licence au cours des 12 derniers mois.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">7. Droit Applicable & Litiges</h2>
            <p>
              Les présentes CGV sont soumises au droit belge. En cas de litige, et à défaut de résolution amiable, les tribunaux de Bruxelles (Belgique) seront seuls compétents.
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
