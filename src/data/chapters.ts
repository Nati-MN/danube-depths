export const chapters = [
  { id: 'oberflaeche', nr: '01', title: 'Oberfläche' },
  { id: 'abstieg', nr: '02', title: 'Der Abstieg' },
  { id: 'leben', nr: '03', title: 'Leben im Fluss' },
  { id: 'arten', nr: '04', title: 'Arten entdecken' },
  { id: 'raeuber', nr: '05', title: 'Räuber' },
  { id: 'stroemung', nr: '06', title: 'Strömung' },
  { id: 'huchen', nr: '07', title: 'Der König der Donau' },
  { id: 'oesterreich', nr: '08', title: 'Österreich' },
  { id: 'fischerei', nr: '09', title: 'Fischerei' },
  { id: 'schutz', nr: '10', title: 'Schutz' },
  { id: 'ende', nr: '11', title: 'Ende' },
] as const;

/**
 * Kennzahlen für die animierten Statistiken.
 * Gerundete, allgemein zitierte Werte – vor Veröffentlichung bitte prüfen.
 */
export const facts = {
  donauGesamtKm: 2850,
  donauOesterreichKm: 350,
  anrainerstaaten: 10,
  fischartenDonauAT: 60,
  donauKraftwerkeAT: 10,
  freieFliessstrecken: 2,
};
