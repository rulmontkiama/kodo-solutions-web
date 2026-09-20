import Link from 'next/link';

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 py-16 px-6 selection:bg-gray-200">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[32px] p-12">
        <header className="mb-10 border-b border-gray-100 pb-8">
          <Link href="/kodo-pos" className="text-sm font-semibold text-gray-400 hover:text-black transition-colors flex items-center gap-1 mb-4">
            ← Retour à Kōdo POS
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-black mb-2">Conditions Générales d&apos;Utilisation & Bêta-Test</h1>
          <p className="text-gray-400 text-sm">Dernière mise à jour : 18 juillet 2026 • Statut : Bêta-Test Fermé & Gracieux</p>
        </header>

        <main className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-black mb-3">1. Éditeur du Logiciel & Cadre Légal</h2>
            <p>
              Le logiciel <strong>Kōdo POS</strong> est un prototype expérimental développé et édité par un concepteur indépendant agissant en qualité de personne physique résidant en Belgique (en cours d&apos;immatriculation). Le logiciel est mis à disposition à titre purement gracieux, expérimental, précaire et révocable dans le cadre d&apos;un programme de test bêta fermé.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">2. Secteur d&apos;Activité Exclusif & Refus Horeca / SCE 2.0</h2>
            <p>
              Kōdo POS est exclusivement conçu pour le <strong>commerce de détail physique de vêtements et de prêt-à-porter</strong> (gestion des déclinaisons tailles/couleurs, retours, inventaires, arrondi légal espèces à 5 centimes).
            </p>
            <p className="mt-3 bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs font-medium leading-relaxed">
              <strong>AVERTISSEMENT SECTEUR HORECA :</strong> Kōdo POS ne dispose d&apos;aucune homologation FDM / SCE 2.0 (Système de Caisse Enregistreuse certifié par le SPF Finances) et n&apos;est en aucun cas destiné aux établissements de restauration, cafés, snacks ou bars. Toute utilisation dans le secteur Horeca est strictly interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">3. Licence Précaire d&apos;Évaluation & Gratuité</h2>
            <p>
              L&apos;accès au programme de test bêta est 100 % gratuit pour les boutiques sélectionnées après validation de leur candidature et signature préalable d&apos;une convention de test. Aucun paiement, souscription de carte bancaire ou frais d&apos;activation n&apos;est exigé pour participer au banc d&apos;essai.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">4. Fourniture « EN L’ÉTAT » (AS IS) & Absence de Garantie</h2>
            <p>
              Le logiciel est fourni <strong>« EN L’ÉTAT » (AS IS)</strong>, sans aucune garantie expresse ou implicite d&apos;absence de bugs, d&apos;exactitude comptable, d&apos;aptitude à un usage commercial particulier ou de continuité de service. L&apos;éditeur se réserve le droit de modifier, suspendre ou désactiver l&apos;accès au prototype à tout moment sans préavis ni indemnité.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">5. Obligation de Double Tenue Comptable & Responsabilité Fiscale</h2>
            <p>
              Le commerçant testeur conserve l&apos;obligation formelle et légale de maintenir en parallèle son système d&apos;encaissement habituel, sa caisse enregistreuse officielle ou son journal des recettes légal conformément à la réglementation fiscale belge applicable au commerce de détail.
            </p>
            <p className="mt-2">
              Le commerçant testeur demeure seul responsable de la vérification de ses clôtures de caisse (rapports Z), de ses déclarations de chiffre d&apos;affaires et de sa conformité TVA auprès de son expert-comptable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">6. Exclusion et Limitation Absolue de Responsabilité (0 €)</h2>
            <p>
              En contrepartie de la mise à disposition gratuite du prototype, la responsabilité civile, contractuelle ou délictuelle du concepteur est expressément et irrévocablement plafonnée à la somme globale de <strong>ZÉRO EURO (0,00 €)</strong>.
            </p>
            <p className="mt-2">
              Le concepteur ne pourra être tenu responsable d&apos;aucun préjudice direct ou indirect, perte d&apos;exploitation, manque à gagner, dysfonctionnement du tiroir-caisse, perte ou altération de données, ou redressement fiscal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">7. Propriété Intellectuelle & Confidentialité</h2>
            <p>
              L&apos;intégralité du code source, de la structure de base de données, des interfaces graphiques et du savoir-faire demeure la propriété exclusive du concepteur. Toute ingénierie inverse (reverse engineering), décompilation, copie ou distribution est strictement interdite. Tous les retours d&apos;expérience (feedbacks) transmis par le testeur deviennent la propriété exclusive du concepteur sans prétention à rémunération.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">8. Droit Applicable & Juridiction Compétente</h2>
            <p>
              Les présentes conditions et le programme de test sont exclusivement régis par le <strong>Droit belge</strong>. En cas de différend, compétence exclusive est attribuée aux tribunaux francophones de l&apos;arrondissement judiciaire du domicile du concepteur.
            </p>
          </section>
        </main>

        <footer className="mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
          Kōdo POS • Développeur Indépendant Belgique • Programme Bêta Fermé.
        </footer>
      </div>
    </div>
  );
}
