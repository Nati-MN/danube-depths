/**
 * ARTENDATEN
 * ----------
 * Alle Angaben sind Richtwerte für eine Ausstellung und bewusst leicht
 * editierbar gehalten. Größen schwanken je nach Gewässer stark.
 * Bitte vor einer Veröffentlichung mit Fachquellen abgleichen
 * (z. B. Bundesamt für Wasserwirtschaft, Landesfischereiverbände, Rote Liste).
 *
 * Fischereirechtliche Angaben (Schonzeit, Mindestmaß) stehen NICHT hier,
 * sondern in `regulations.ts` – getrennt nach Bundesland.
 */

export type SpeciesId =
  | 'hecht'
  | 'zander'
  | 'wels'
  | 'bachforelle'
  | 'regenbogenforelle'
  | 'karpfen'
  | 'flussbarsch'
  | 'barbe'
  | 'nase'
  | 'huchen'
  | 'aesche'
  | 'schleie';

export interface Species {
  id: SpeciesId;
  name: string;
  scientific: string;
  family: string;
  /** typische Länge erwachsener Tiere in cm (von–bis) */
  typicalCm: [number, number];
  /** mögliche Maximallänge in cm (Richtwert) */
  maxCm: number;
  /** ein Satz für die kurze Feldnotiz */
  summary: string;
  habitat: string;
  diet: string;
  behavior: string;
  distribution: string;
  conservation: string;
  /** false = eingeführte, nicht heimische Art */
  native: boolean;
}

export const species: Species[] = [
  {
    id: 'bachforelle',
    name: 'Bachforelle',
    scientific: 'Salmo trutta fario',
    family: 'Lachsfische (Salmonidae)',
    typicalCm: [20, 40],
    maxCm: 80,
    summary: 'Leitfisch der kalten, schnell fließenden Oberläufe – standorttreu und wachsam.',
    habitat:
      'Kühle, sauerstoffreiche Bäche und Flüsse mit Kiesgrund, Unterständen und beschatteten Ufern.',
    diet: 'Insektenlarven, Anflugnahrung, Bachflohkrebse; größere Tiere auch kleine Fische.',
    behavior:
      'Verteidigt einen festen Standplatz hinter Steinen oder Wurzeln. Laicht im Spätherbst und Winter in Kiesgruben.',
    distribution:
      'In ganz Österreich in der Forellenregion der Fließgewässer, bis in hohe Lagen der Alpen.',
    conservation:
      'Empfindlich gegenüber Erwärmung, Verschlammung des Kiesgrunds und Verbauung. Regionale Bestände sind rückläufig.',
    native: true,
  },
  {
    id: 'regenbogenforelle',
    name: 'Regenbogenforelle',
    scientific: 'Oncorhynchus mykiss',
    family: 'Lachsfische (Salmonidae)',
    typicalCm: [25, 50],
    maxCm: 80,
    summary: 'Ein Gast aus Nordamerika – erkennbar am rötlich schimmernden Band entlang der Flanke.',
    habitat:
      'Kühle Flüsse, Bäche und Seen; verträgt etwas höhere Temperaturen als die Bachforelle.',
    diet: 'Insekten und deren Larven, Kleinkrebse, kleine Fische.',
    behavior: 'Weniger standorttreu als die Bachforelle, steht häufig in der freien Strömung.',
    distribution:
      'Im 19. Jahrhundert aus Nordamerika eingeführt, heute durch Besatz in vielen Gewässern Österreichs.',
    conservation:
      'Nicht heimisch. Besatz wird kritisch diskutiert, weil sie mit Bachforelle und Äsche um Lebensraum und Nahrung konkurrieren kann.',
    native: false,
  },
  {
    id: 'flussbarsch',
    name: 'Flussbarsch',
    scientific: 'Perca fluviatilis',
    family: 'Echte Barsche (Percidae)',
    typicalCm: [15, 30],
    maxCm: 50,
    summary: 'Dunkle Querbinden, rote Flossen, stachelige Rückenflosse – ein Jäger im Trupp.',
    habitat: 'Seen, Altarme und langsam fließende Flussabschnitte mit Struktur am Ufer.',
    diet: 'Jung: Plankton und Insektenlarven. Später Kleinfische – auch Artgenossen.',
    behavior: 'Jungfische jagen in Schwärmen, große Barsche leben zunehmend einzeln.',
    distribution: 'In fast allen stehenden und langsam fließenden Gewässern Österreichs.',
    conservation: 'Häufig und anpassungsfähig; gilt als nicht gefährdet.',
    native: true,
  },
  {
    id: 'karpfen',
    name: 'Karpfen',
    scientific: 'Cyprinus carpio',
    family: 'Karpfenfische (Cyprinidae)',
    typicalCm: [35, 70],
    maxCm: 110,
    summary: 'Durchwühlt mit vorstülpbarem Maul den Grund – ein Wärme liebender Friedfisch.',
    habitat: 'Warme, nährstoffreiche Seen, Teiche, Altarme und ruhige Flussabschnitte.',
    diet: 'Würmer, Schnecken, Insektenlarven, Muscheln und Pflanzenteile vom Gewässergrund.',
    behavior: 'Gesellig und vorsichtig, vor allem in der Dämmerung aktiv. Laicht in flachem, warmem Wasser.',
    distribution:
      'Weit verbreitet, überwiegend durch Besatz. Die Wildform der Donau ist deutlich schlanker als Zuchtkarpfen.',
    conservation:
      'Zuchtformen sind häufig. Der ursprüngliche Wildkarpfen der Donau ist dagegen selten geworden.',
    native: true,
  },
  {
    id: 'schleie',
    name: 'Schleie',
    scientific: 'Tinca tinca',
    family: 'Karpfenfische (Cyprinidae)',
    typicalCm: [20, 40],
    maxCm: 65,
    summary: 'Olivgrün, schleimig, mit winzigen Schuppen – verborgen zwischen den Wasserpflanzen.',
    habitat: 'Pflanzenreiche, schlammige Stillgewässer, Altarme und Auweiher.',
    diet: 'Schnecken, Insektenlarven, Würmer und kleine Muscheln.',
    behavior: 'Scheu und dämmerungsaktiv. Kommt mit wenig Sauerstoff zurecht und überdauert Kälte im Schlamm.',
    distribution: 'In Tieflandgewässern, Altarmen der Donau-Auen und vielen Seen.',
    conservation: 'Abhängig von intakten Altarmen und Augewässern, die durch Flussregulierung seltener wurden.',
    native: true,
  },
  {
    id: 'hecht',
    name: 'Hecht',
    scientific: 'Esox lucius',
    family: 'Hechte (Esocidae)',
    typicalCm: [50, 100],
    maxCm: 150,
    summary: 'Regungslos zwischen den Pflanzen – dann ein Stoß aus dem Stand.',
    habitat: 'Pflanzenreiche Uferzonen von Seen, Altarmen und langsam fließenden Flüssen.',
    diet: 'Fische aller Art, gelegentlich Frösche, Krebse oder junge Wasservögel.',
    behavior:
      'Lauerjäger und Einzelgänger. Die weit hinten sitzende Rückenflosse ermöglicht extreme Beschleunigung.',
    distribution: 'In nahezu allen größeren Seen und ruhigen Flussabschnitten Österreichs.',
    conservation:
      'Weit verbreitet. Braucht überschwemmte Wiesen und flache Krautzonen zum Laichen – sie fehlen an regulierten Flüssen.',
    native: true,
  },
  {
    id: 'zander',
    name: 'Zander',
    scientific: 'Sander lucioperca',
    family: 'Echte Barsche (Percidae)',
    typicalCm: [40, 70],
    maxCm: 120,
    summary: 'Jagt, wenn andere kaum noch sehen: in trübem Wasser und in der Dämmerung.',
    habitat: 'Größere, eher trübe Flüsse und Seen mit hartem Grund.',
    diet: 'Kleinere, schlanke Fische wie Lauben, Rotaugen und Barsche.',
    behavior:
      'Dämmerungs- und nachtaktiv. Lichtempfindliche Augen verschaffen ihm bei wenig Licht einen Vorteil.',
    distribution: 'Donau und ihre Stauräume, March, Neusiedler See sowie zahlreiche Seen.',
    conservation: 'Gilt als nicht gefährdet; profitiert von nährstoffreichen, trüben Gewässern.',
    native: true,
  },
  {
    id: 'wels',
    name: 'Wels',
    scientific: 'Silurus glanis',
    family: 'Echte Welse (Siluridae)',
    typicalCm: [100, 200],
    maxCm: 270,
    summary: 'Der größte Fisch in Österreichs Gewässern – er findet seine Beute mit Barteln statt mit den Augen.',
    habitat: 'Tiefe, warme, langsam fließende Flüsse und Seen mit Unterständen.',
    diet: 'Fische, Krebse, Muscheln, gelegentlich Wasservögel und Kleinsäuger.',
    behavior:
      'Nachtaktiv. Tagsüber in Kolken und unter Totholz. Das Männchen bewacht das Gelege.',
    distribution: 'Donau, March, Thaya, Neusiedler See und warme Seen des Tieflands und Alpenvorlands.',
    conservation: 'Nicht gefährdet; breitet sich in wärmer werdenden Gewässern eher aus.',
    native: true,
  },
  {
    id: 'barbe',
    name: 'Barbe',
    scientific: 'Barbus barbus',
    family: 'Karpfenfische (Cyprinidae)',
    typicalCm: [30, 60],
    maxCm: 90,
    summary: 'Namensgeberin der Barbenregion – mit vier Barteln dicht über dem Kies.',
    habitat: 'Strömende Flussabschnitte mit Kies- und Schottergrund.',
    diet: 'Insektenlarven, Schnecken, Kleinkrebse und Würmer, die sie am Grund aufstöbert.',
    behavior: 'Gesellig, bodenorientiert. Wandert zum Laichen flussaufwärts auf flache Kiesbänke.',
    distribution: 'Donau und größere Zubringer wie Inn, Traun, Enns, Mur und Drau.',
    conservation:
      'Als Wanderfisch auf durchgängige Flüsse angewiesen; durch Stauhaltungen und Querbauwerke zurückgegangen.',
    native: true,
  },
  {
    id: 'nase',
    name: 'Nase',
    scientific: 'Chondrostoma nasus',
    family: 'Karpfenfische (Cyprinidae)',
    typicalCm: [25, 40],
    maxCm: 50,
    summary: 'Weidet mit hornigen Lippen Algen von den Steinen – einst der Massenfisch der Donau.',
    habitat: 'Schnell fließende Flüsse mit steinigem, algenbewachsenem Grund.',
    diet: 'Algenaufwuchs, der mit der scharfkantigen Unterlippe abgeschabt wird, dazu Kleintiere.',
    behavior: 'Zieht in großen Schwärmen. Im Frühjahr wandern die Tiere gemeinsam zu flachen Kiesbänken.',
    distribution: 'Donau und Zubringer der Barben- und Äschenregion.',
    conservation:
      'Früher in riesigen Schwärmen, heute stark zurückgegangen – vor allem wegen unterbrochener Wanderwege und fehlender Laichplätze.',
    native: true,
  },
  {
    id: 'aesche',
    name: 'Äsche',
    scientific: 'Thymallus thymallus',
    family: 'Lachsfische (Salmonidae)',
    typicalCm: [30, 45],
    maxCm: 60,
    summary: 'Die hohe, fahnenartige Rückenflosse macht sie unverwechselbar.',
    habitat: 'Klare, kühle, mittelgroße Flüsse mit Kiesgrund – die „Äschenregion“.',
    diet: 'Insektenlarven, Anflugnahrung und Kleinkrebse.',
    behavior: 'Steht in lockeren Gruppen in der Strömung. Laicht im Frühjahr auf Kies.',
    distribution: 'Voralpen- und Alpenflüsse wie Traun, Enns, Mur, Drau, Salzach und Inn.',
    conservation:
      'Vielerorts stark zurückgegangen. Reagiert empfindlich auf Erwärmung, Schwallbetrieb und Verbauung.',
    native: true,
  },
  {
    id: 'huchen',
    name: 'Huchen',
    scientific: 'Hucho hucho',
    family: 'Lachsfische (Salmonidae)',
    typicalCm: [70, 120],
    maxCm: 150,
    summary: 'Der Donaulachs – weltweit nur im Einzugsgebiet der Donau zu Hause.',
    habitat: 'Kühle, sauerstoffreiche, kräftig strömende Flüsse mit tiefen Gumpen und Kiesbänken.',
    diet: 'Vor allem Fische wie Nasen, Barben und Äschen.',
    behavior:
      'Standorttreuer Einzelgänger. Zieht im Frühjahr flussaufwärts und laicht auf überströmtem Kies.',
    distribution:
      'Nur noch in Teilen des früheren Verbreitungsgebiets, etwa an Mur, Pielach, Drau und Gail.',
    conservation:
      'Stark gefährdet (IUCN: Endangered). In der FFH-Richtlinie der EU gelistet (Anhänge II und V). Hauptursachen: Staustufen, Verbauung, fehlende Laichplätze.',
    native: true,
  },
];

export const speciesById = Object.fromEntries(species.map((s) => [s.id, s])) as Record<
  SpeciesId,
  Species
>;
