// Mock users data
const users = [
  {
    id: 1,
    nom: 'Admin',
    prenom: 'System',
    email: 'admin@ecosysteme.cd',
    password: '123', // In production, this should be hashed
    direction: 'Administration',
    fonction: 'Administrateur',
    profil: 'admin',
    signature: '/signatures/admin.png'
  },
  {
    id: 2,
    nom: 'Dupont',
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
    nom: 'Martin',
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
    nom: 'Dubois',
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
    nom: 'Leroy',
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
    nom: 'Petit',
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
    nom: 'Durand',
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
    nom: 'Moreau',
    prenom: 'David',
    email: 'finance@ecosysteme.cd',
    password: '123',
    direction: 'FINANCE',
    fonction: 'Comptable',
    profil: 'financier',
    signature: '/signatures/finance.png'
  }
];

module.exports = users;
