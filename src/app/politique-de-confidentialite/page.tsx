import Link from 'next/link';

export default function PolitiquePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 py-16 px-6 selection:bg-gray-200">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[32px] p-8 sm:p-12">
        <header className="mb-10 border-b border-gray-100 pb-8">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-400 hover:text-black transition-colors flex items-center gap-1 mb-4"
          >
            ← Retour à l&apos;accueil Kōdo Solutions
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-black mb-2">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-400 text-sm">Dernière mise à jour : 27 novembre 2026</p>
        </header>

        <main className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-black mb-3">1. Introduction</h2>
            <p>
              Chez <strong>Kōdo Solutions</strong>, nous accordons une importance primordiale à la
              protection de vos données personnelles. La présente politique décrit comment nous
              collectons, utilisons, conservons et protégeons vos informations lors de la souscription,
              du téléchargement et de l&apos;utilisation de notre logiciel de point de vente{' '}
              <strong>Kōdo POS</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">2. Données Collectées</h2>
            <p>
              Nous collectons uniquement les données strictement nécessaires à la fourniture de nos
              services :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>
                <strong>Données de contact et de licence :</strong> Nom, adresse email professionnelle,
                nom de l&apos;établissement, identifiant de licence, statut d&apos;abonnement et
                empreinte matérielle anonymisée du poste activé.
              </li>
              <li>
                <strong>Données de paiement :</strong> Traitées directement par notre prestataire
                certifié PCI-DSS (<strong>Stripe</strong>). Kōdo Solutions ne stocke jamais vos
                numéros complets de carte bancaire.
              </li>
              <li>
                <strong>Données de caisse :</strong> Stockées localement sur votre poste (macOS ou
                Windows) dans votre base SQLite. En cas d&apos;activation optionnelle de la
                synchronisation Cloud ou Shopify, seules les données nécessaires à cette
                synchronisation transitent de manière chiffrée.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">3. Finalités du Traitement</h2>
            <p>Vos données sont traitées pour :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>
                Gérer votre abonnement, délivrer votre clé de licence et sécuriser l&apos;accès aux
                téléchargements et mises à jour de Kōdo POS.
              </li>
              <li>
                Assurer le support technique et répondre à vos demandes de démonstration ou
                d&apos;assistance.
              </li>
              <li>
                Permettre le fonctionnement technique des exports comptables, des clôtures Z et du
                journal d&apos;audit chaîné SHA-256 au sein de votre logiciel.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">
              4. Conservation des Données &amp; Responsabilité d&apos;Archivage
            </h2>
            <p>
              Les données de prospection et de contact sont conservées pendant la durée de la relation
              commerciale et au maximum 3 ans après le dernier contact. Les données liées aux licences
              et factures sont conservées pendant la durée légale de conservation comptable.
            </p>
            <p className="mt-2">
              Vos données transactionnelles de caisse étant hébergées localement sur votre poste
              (macOS ou Windows), <strong>vous demeurez seul responsable</strong> de leur sauvegarde
              régulière et de leur archivage pendant toute la durée légale applicable dans votre pays
              (notamment 6 ans en France et 7 à 10 ans en Belgique).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">
              5. Sous-traitants Techniques &amp; Partage des Données
            </h2>
            <p>
              Kōdo Solutions ne vend ni ne loue vos données personnelles à des tiers. Nous nous
              appuyons uniquement sur des sous-traitants techniques reconnus présentant des garanties
              conformes au RGPD : <strong>Vercel</strong> (hébergement web),{' '}
              <strong>Google Firebase</strong> (base licences), <strong>Stripe</strong> (paiement et
              facturation), <strong>Cloudflare R2</strong> (distribution privée des installateurs et
              mises à jour) et <strong>Resend</strong> (envoi transactionnel des emails de licence).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">
              6. Sécurité du Hachage et Protection
            </h2>
            <p>
              L&apos;accès à l&apos;application Kōdo POS est protégé par code PIN. Les codes PIN sont
              hachés de manière irréversible (SHA-256 salé) localement dans la base SQLite. Les
              échanges réseau (licences, téléchargements signés, synchronisations Shopify/Cloud)
              utilisent exclusivement des connexions HTTPS chiffrées.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">7. Vos Droits (RGPD)</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
              d&apos;un droit d&apos;accès, de rectification, de portabilité, de limitation et
              d&apos;effacement de vos données personnelles. Pour exercer vos droits, contactez-nous à
              l&apos;adresse : <strong>privacy@kodo-solutions.be</strong>.
            </p>
          </section>
        </main>

        <footer className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>Kōdo Solutions Belgique • Tous droits réservés.</span>
          <Link href="/cgv" className="hover:text-black transition-colors">
            Conditions Générales de Vente (CGV)
          </Link>
        </footer>
      </div>
    </div>
  );
}
