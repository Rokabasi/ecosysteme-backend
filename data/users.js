// Mock users data
const users = [
  {
    id: 1,
    nom: 'Admin',
    prenom: 'System',
    email: 'admin@ecosysteme.cd',
    password: 'admin123', // In production, this should be hashed
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
    password: 'judiciaire123',
    direction: 'Judiciaire',
    fonction: 'Juriste',
    profil: 'direction',
    signature: '/signatures/judiciaire.png'
  },
  {
    id: 3,
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'etudes@ecosysteme.cd',
    password: 'etudes123',
    direction: 'Études',
    fonction: 'Chef de service',
    profil: 'direction',
    signature: '/signatures/etudes.png'
  },
  {
    id: 4,
    nom: 'Dubois',
    prenom: 'Pierre',
    email: 'reparations@ecosysteme.cd',
    password: 'reparations123',
    direction: 'Réparations',
    fonction: 'Responsable',
    profil: 'direction',
    signature: '/signatures/reparations.png'
  },
  {
    id: 5,
    nom: 'Leroy',
    prenom: 'Marie',
    email: 'acces@ecosysteme.cd',
    password: 'acces123',
    direction: 'Accès à la justice',
    fonction: 'Conseillère',
    profil: 'direction',
    signature: '/signatures/acces.png'
  },
  {
    id: 6,
    nom: 'Petit',
    prenom: 'Thomas',
    email: 'numerique@ecosysteme.cd',
    password: 'numerique123',
    direction: 'Numérique',
    fonction: 'Développeur',
    profil: 'direction',
    signature: '/signatures/numerique.png'
  },
  {
    id: 7,
    nom: 'Durand',
    prenom: 'Nathalie',
    email: 'audit@ecosysteme.cd',
    password: 'audit123',
    direction: 'Audit',
    fonction: 'Auditrice',
    profil: 'audit',
    signature: '/signatures/audit.png'
  },
  {
    id: 8,
    nom: 'Moreau',
    prenom: 'David',
    email: 'finance@ecosysteme.cd',
    password: 'finance123',
    direction: 'Finance',
    fonction: 'Comptable',
    profil: 'finance',
    signature: '/signatures/finance.png'
  }
];

module.exports = users;
