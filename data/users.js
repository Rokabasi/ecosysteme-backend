// Mock users data
const users = [
  {
    id: 1,
    nom: 'NTOTO',
    prenom: 'Jules',
    email: 'admin@ecosysteme.cd',
    password: '123', // In production, this should be hashed
    direction: 'Administration',
    fonction: 'Administrateur',
    profil: 'admin',
    signature: '/signatures/admin.png'
  },
  { 
    id: 2,
    nom: 'FIKIRI',
    prenom: 'Jean',
    email: 'judiciaire@ecosysteme.cd',
    password: '123',
    direction: 'JURIDIQUE',
    fonction: 'Juriste',
    profil: 'Juriste',
    signature: '/signatures/judiciaire.png'
  },
  {
    id: 3,
    nom: 'KONGOLO',
    prenom: 'Sophie',
    email: 'etudes@ecosysteme.cd',
    password: '123',
    direction: 'ETUDES',
    fonction: 'Chef de service',
    profil: 'Analyste',
    signature: '/signatures/etudes.png'
  },
  {
    id: 4,
    nom: 'NZITA',
    prenom: 'Pierre',
    email: 'reparations@ecosysteme.cd',
    password: '123',
    direction: 'REPARATIONS',
    fonction: 'Responsable',
    profil: 'Analyste',
    signature: '/signatures/reparations.png'
  },
  {
    id: 5,
    nom: 'ALIMASI',
    prenom: 'Marie',
    email: 'acces@ecosysteme.cd',
    password: '123',
    direction: 'ACCES A LA JUSTICE',
    fonction: 'Conseillère',
    profil: 'Analyste',
    signature: '/signatures/acces.png'
  },
  {
    id: 6,
    nom: 'MATONDO',
    prenom: 'Thomas',
    email: 'numerique@ecosysteme.cd',
    password: '123',
    direction: 'NUMERIQUE',
    fonction: 'Développeur',
    profil: 'Admin',
    signature: '/signatures/numerique.png'
  },
  {
    id: 7,
    nom: 'KIESE',
    prenom: 'Nathalie',
    email: 'audit@ecosysteme.cd',
    password: '123',
    direction: 'AUDIT',
    fonction: 'Auditrice',
    profil: 'Auditeur',
    signature: '/signatures/audit.png'
  },
  {
    id: 8,
    nom: 'MIEZI',
    prenom: 'David',
    email: 'finance@ecosysteme.cd',
    password: '123',
    direction: 'FINANCE',
    fonction: 'Comptable',
    profil: 'Financier',
    signature: '/signatures/finance.png'
  },
  {
    id: 9,
    nom: 'KALONJI',
    prenom: 'Nathan',
    email: 'controleur@ecosysteme.cd',
    password: '123',
    direction: 'AUDIT',
    fonction: 'Controleur',
    profil: 'Controleur',
    signature: '/signatures/audit.png'
  },
];

module.exports = users;
