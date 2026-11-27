import Link from 'next/link';

export default function CGVPage() {
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
            Conditions Générales de Vente et d&apos;Utilisation (CGV / CGU)
          </h1>
          <p className="text-gray-400 text-sm">Dernière mise à jour : 27 novembre 2026</p>
        </header>

        <main className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-black mb-3">
              1. Objet &amp; Périmètre d&apos;Utilisation (Commerce de détail B2B)
            </h2>
            <p>
              Les présentes Conditions Générales de Vente et d&apos;Utilisation régissent la souscription,
              la concession de licence d&apos;utilisation, le téléchargement et le support du logiciel de
              point de vente <strong>Kōdo POS</strong>, édité et commercialisé par{' '}
              <strong>Kōdo Solutions</strong> (Belgique).
            </p>
            <p className="mt-2">
              Kōdo POS est un logiciel conçu exclusivement à destination des{' '}
              <strong>professionnels (B2B)</strong> exploitant un{' '}
              <strong>commerce de détail (retail)</strong> (prêt-à-porter, boutiques, commerces
              indépendants).{' '}
              <strong>
                Il n&apos;est pas destiné aux établissements soumis à une obligation sectorielle de
                caisse fiscale agréée, notamment les établissements du secteur Horeca en Belgique
                soumis au Système de Caisse Enregistreuse (SCE / SCE 2.0 avec module de données
                fiscales « boîte noire » agréé par le SPF Finances).
              </strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">
              2. Licence d&apos;Utilisation &amp; Propriété Intellectuelle
            </h2>
            <p>
              Sous réserve du paiement effectif de l&apos;abonnement en cours, Kōdo Solutions concède
              au client une licence d&apos;utilisation personnelle, non exclusive, non transférable et
              révocable, limitée à l&apos;exploitation interne de son établissement commercial (sauf
              extension multi-postes expressément convenue par écrit).
            </p>
            <p className="mt-2">
              Le logiciel, son code source, ses binaires, son interface et ses marques demeurent la
              propriété intellectuelle exclusive de Kōdo Solutions. Toute copie, revente, partage de
              clé de licence, rétro-ingénierie, décompilation ou distribution non autorisée est
              strictement interdite et entraîne la résiliation immédiate de la licence sans
              remboursement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">
              3. Traçabilité Technique, Cadre Réglementaire &amp; Absence de Certification Tiers
            </h2>
            <p>
              <strong>3.1. Dispositif technique intégré :</strong> Kōdo POS intègre un{' '}
              <strong>journal d&apos;audit chaîné par empreintes cryptographiques SHA-256</strong>, un
              mécanisme de <strong>clôture Z</strong> et des exports comptables destinés à faciliter
              la traçabilité opérationnelle et le suivi comptable des ventes du commerce.
            </p>
            <p className="mt-2">
              <strong>3.2. Absence de certification par organisme tiers :</strong> Kōdo Solutions
              informe expressément le client que Kōdo POS{' '}
              <strong>
                ne fait pas l&apos;objet d&apos;une certification délivrée par un organisme tiers
                accrédité
              </strong>{' '}
              (notamment <strong>NF525 / INFOCERT</strong>, <strong>LNE</strong> ou agrément{' '}
              <strong>SCE / SCE 2.0 du SPF Finances</strong>). Kōdo POS n&apos;est en aucun cas
              présenté ni commercialisé comme un logiciel certifié par un tiers.
            </p>
            <p className="mt-2">
              <strong>3.3. Adéquation légale selon le pays et l&apos;activité :</strong>
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>
                <strong>Belgique :</strong> Il appartient exclusivement au client de vérifier si son
                activité (en particulier toute activité Horeca ou mixte dépassant les seuils légaux
                fixés par le SPF Finances) l&apos;oblige à disposer d&apos;un SCE agréé avec boîte noire.
                Dans l&apos;affirmative, le client s&apos;interdit d&apos;utiliser Kōdo POS en substitution
                d&apos;un SCE agréé.
              </li>
              <li>
                <strong>France (art. 286 du CGI) et autres pays :</strong> Il appartient au client
                assujetti à la TVA en France ou soumis à une réglementation fiscale spécifique hors
                Belgique de vérifier, avant toute mise en production et avec son expert-comptable ou
                conseil fiscal, que le logiciel correspond à ses obligations légales et déclaratives.
                La souscription d&apos;une licence Kōdo POS n&apos;emporte pas délivrance implicite
                d&apos;une attestation individuelle d&apos;éditeur : le cas échéant, une attestation ne
                peut résulter que d&apos;un document nominatif, daté et expressément signé par Kōdo
                Solutions pour une version déterminée du logiciel.
              </li>
            </ul>
            <p className="mt-2">
              <strong>3.4. Obligations fiscales et archivage à la charge du client :</strong> Le
              client demeure seul responsable de la conformité de son paramétrage (taux de TVA,
              mentions légales sur ticket, numéro d&apos;entreprise/BCE ou SIRET, clôtures Z), de
              l&apos;export et de la sauvegarde externe régulière de sa base de données locale, ainsi
              que de la conservation de ses archives comptables pendant toute la durée légale
              applicable dans son pays (notamment 6 ans en France, 7 à 10 ans en Belgique). Kōdo
              Solutions ne saurait en aucun cas être tenu responsable d&apos;une utilisation non
              conforme, d&apos;une altération volontaire du poste client, d&apos;une absence de
              sauvegarde ou d&apos;un manquement fiscal de l&apos;exploitant.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">
              4. Tarifs, Abonnements &amp; Suspension de Licence
            </h2>
            <p>
              Les tarifs des abonnements (mensuels ou annuels) sont ceux affichés sur le site au
              moment de la commande et réglés par carte bancaire via notre prestataire sécurisé{' '}
              <strong>Stripe</strong>. Les abonnements sont renouvelés tacitement à chaque échéance
              jusqu&apos;à résiliation par le client depuis son portail de facturation Stripe avant la
              date de renouvellement.
            </p>
            <p className="mt-2">
              En cas d&apos;échec de paiement, de résiliation ou d&apos;expiration de l&apos;abonnement,
              la licence logicielle ainsi que l&apos;accès aux téléchargements et aux mises à jour sont
              automatiquement suspendus ou désactivés, sans suppression des données stockées localement
              sur le poste du client.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">
              5. Politique de Remboursement &amp; Absence de Droit de Rétractation
            </h2>
            <p>
              Les présentes ventes étant conclues entre <strong>professionnels (B2B)</strong> pour les
              besoins de leur activité commerciale, le droit légal de rétractation réservé aux
              consommateurs ne s&apos;applique pas. À titre subsidiaire, conformément à l&apos;article
              VI.53, 13° du Code de droit économique belge, le droit de rétractation est exclu pour la
              fourniture de contenus numériques non fournis sur support matériel dès le début
              d&apos;exécution.
            </p>
            <p className="mt-2">
              En conséquence, aucun remboursement (total ou partiel) ne sera accordé après la
              génération de la clé de licence, le téléchargement de l&apos;installateur (macOS{' '}
              <code>.dmg</code> ou Windows <code>.zip</code>) ou le début d&apos;une période
              d&apos;abonnement entamée. Toute résiliation prend effet à la fin de la période déjà
              facturée.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">
              6. Limitation de Responsabilité &amp; Sauvegardes
            </h2>
            <p>
              Kōdo POS est fourni « en l&apos;état » et « selon disponibilité », dans le cadre d&apos;une{' '}
              <strong>obligation de moyens</strong>. Kōdo Solutions met en œuvre des mesures
              raisonnables pour assurer la stabilité du logiciel, sans garantir l&apos;absence totale
              d&apos;anomalies ou d&apos;interruptions, notamment liées au matériel du client, au système
              d&apos;exploitation (macOS / Windows), aux périphériques tiers (imprimantes, douchettes,
              terminaux bancaires) ou à la connexion réseau.
            </p>
            <p className="mt-2">
              Sauf dol ou faute lourde légalement établie, Kōdo Solutions ne pourra en aucun cas être
              tenu responsable des dommages indirects ou immatériels tels que : perte de chiffre
              d&apos;affaires, perte d&apos;exploitation, perte de clientèle, perte de données due à
              l&apos;absence de sauvegarde externe du client, pénalités, amendes administratives ou
              redressements fiscaux. En toute hypothèse, la responsabilité totale et cumulée de Kōdo
              Solutions, toutes causes confondues, est strictement plafonnée au montant hors taxes
              effectivement encaissé au titre de la licence du client au cours des{' '}
              <strong>douze (12) derniers mois</strong> précédant le fait générateur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">7. Droit Applicable &amp; Litiges</h2>
            <p>
              Les présentes CGV/CGU sont régies exclusivement par le <strong>droit belge</strong>. En
              cas de différend et à défaut de résolution amiable dans un délai de 30 jours, les
              tribunaux francophones de l&apos;arrondissement judiciaire de{' '}
              <strong>Bruxelles (Belgique)</strong> seront seuls compétents.
            </p>
          </section>
        </main>

        <footer className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>Kōdo Solutions Belgique • Tous droits réservés.</span>
          <Link href="/politique-de-confidentialite" className="hover:text-black transition-colors">
            Politique de confidentialité
          </Link>
        </footer>
      </div>
    </div>
  );
}
