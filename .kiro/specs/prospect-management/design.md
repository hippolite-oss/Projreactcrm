# Design Document : Gestion des Prospects depuis la Page Home

## 🎯 Architecture Générale

### Vue d'ensemble du Système
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Page Home     │    │   Backend API   │    │   Interface     │
│   (Public)      │───▶│   Prospects     │◀───│   Admin         │
│                 │    │                 │    │                 │
│ - Formulaire    │    │ - Entity        │    │ - Liste         │
│ - Validation    │    │ - Service       │    │ - Détails       │
│ - Soumission    │    │ - Controller    │    │ - Actions       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   EmailJS       │
                    │   Service       │
                    │                 │
                    │ - Templates     │
                    │ - Envoi emails  │
                    │ - Historique    │
                    └─────────────────┘
```

## 🗄️ Modèle de Données

### Entité Prospect

```typescript
@Entity('prospects')
@Index(['email'], { unique: true })
@Index(['statut'])
@Index(['createdAt'])
export class Prospect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nom: string;

  @Column({ length: 100, nullable: true })
  entreprise: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  telephone: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ 
    type: 'enum', 
    enum: ProspectStatus,
    default: ProspectStatus.NOUVEAU
  })
  statut: ProspectStatus;

  @Column({ type: 'text', nullable: true })
  notes_admin: string;

  @Column({ nullable: true })
  date_contact: Date;

  @Column({ nullable: true, length: 100 })
  contacte_par: string; // Email de l'admin qui a contacté

  @Column({ default: false })
  email_envoye: boolean;

  @Column({ nullable: true })
  date_email: Date;

  @Column({ nullable: true, length: 50 })
  source: string; // 'website', 'referral', etc.

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>; // Données additionnelles

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum ProspectStatus {
  NOUVEAU = 'nouveau',
  CONTACTE = 'contacte', 
  QUALIFIE = 'qualifie',
  CONVERTI = 'converti',
  PERDU = 'perdu'
}
```

### DTOs

```typescript
// Création de prospect (public)
export class CreateProspectDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nom: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  entreprise?: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @IsOptional()
  @IsString()
  source?: string;
}

// Mise à jour prospect (admin)
export class UpdateProspectDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nom?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  entreprise?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEnum(ProspectStatus)
  statut?: ProspectStatus;

  @IsOptional()
  @IsString()
  notes_admin?: string;
}

// Envoi d'email
export class SendEmailProspectDto {
  @IsNotEmpty()
  @IsString()
  template: string; // 'welcome', 'qualification', 'proposal'

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsObject()
  variables?: Record<string, any>;
}
```

## 🔧 Services Backend

### ProspectsService

```typescript
@Injectable()
export class ProspectsService {
  constructor(
    @InjectRepository(Prospect)
    private prospectRepository: Repository<Prospect>,
    private emailService: EmailService,
  ) {}

  // Création de prospect (public)
  async create(createProspectDto: CreateProspectDto): Promise<{
    success: boolean;
    data: Prospect;
    message: string;
  }> {
    // Vérifier si l'email existe déjà
    const existingProspect = await this.prospectRepository.findOne({
      where: { email: createProspectDto.email }
    });

    if (existingProspect) {
      throw new ConflictException('Un prospect avec cet email existe déjà');
    }

    const prospect = this.prospectRepository.create({
      ...createProspectDto,
      source: createProspectDto.source || 'website'
    });

    const savedProspect = await this.prospectRepository.save(prospect);

    // Optionnel : Envoyer email de confirmation automatique
    // await this.sendWelcomeEmail(savedProspect.id);

    return {
      success: true,
      data: savedProspect,
      message: 'Votre demande a été enregistrée avec succès'
    };
  }

  // Liste des prospects (admin)
  async findAll(
    page = 1, 
    limit = 15, 
    search?: string, 
    statut?: string,
    sortBy = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<{
    success: boolean;
    data: Prospect[];
    pagination: PaginationInfo;
  }> {
    const queryBuilder = this.prospectRepository.createQueryBuilder('prospect');

    // Filtres
    if (search) {
      queryBuilder.andWhere(
        '(prospect.nom ILIKE :search OR prospect.entreprise ILIKE :search OR prospect.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (statut && statut !== 'all') {
      queryBuilder.andWhere('prospect.statut = :statut', { statut });
    }

    // Tri
    queryBuilder.orderBy(`prospect.${sortBy}`, sortOrder);

    // Pagination
    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Statistiques prospects
  async getStats(): Promise<{
    total: number;
    nouveau: number;
    contacte: number;
    qualifie: number;
    converti: number;
    perdu: number;
    nouveaux_7j: number;
  }> {
    const [total, nouveau, contacte, qualifie, converti, perdu] = await Promise.all([
      this.prospectRepository.count(),
      this.prospectRepository.count({ where: { statut: ProspectStatus.NOUVEAU } }),
      this.prospectRepository.count({ where: { statut: ProspectStatus.CONTACTE } }),
      this.prospectRepository.count({ where: { statut: ProspectStatus.QUALIFIE } }),
      this.prospectRepository.count({ where: { statut: ProspectStatus.CONVERTI } }),
      this.prospectRepository.count({ where: { statut: ProspectStatus.PERDU } }),
    ]);

    // Nouveaux prospects des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const nouveaux_7j = await this.prospectRepository.count({
      where: {
        createdAt: MoreThan(sevenDaysAgo)
      }
    });

    return { total, nouveau, contacte, qualifie, converti, perdu, nouveaux_7j };
  }

  // Marquer comme contacté
  async marquerContacte(id: number, adminEmail: string): Promise<Prospect> {
    const prospect = await this.findOne(id);
    
    prospect.statut = ProspectStatus.CONTACTE;
    prospect.date_contact = new Date();
    prospect.contacte_par = adminEmail;

    return this.prospectRepository.save(prospect);
  }

  // Envoyer email à un prospect
  async sendEmail(
    id: number, 
    emailDto: SendEmailProspectDto,
    adminEmail: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const prospect = await this.findOne(id);

    const emailSent = await this.emailService.sendProspectEmail(
      prospect,
      emailDto.template,
      emailDto.subject,
      emailDto.message,
      emailDto.variables
    );

    if (emailSent) {
      // Marquer l'email comme envoyé
      prospect.email_envoye = true;
      prospect.date_email = new Date();
      
      // Si c'est le premier contact, changer le statut
      if (prospect.statut === ProspectStatus.NOUVEAU) {
        prospect.statut = ProspectStatus.CONTACTE;
        prospect.date_contact = new Date();
        prospect.contacte_par = adminEmail;
      }

      await this.prospectRepository.save(prospect);
    }

    return {
      success: emailSent,
      message: emailSent 
        ? 'Email envoyé avec succès' 
        : 'Erreur lors de l\'envoi de l\'email'
    };
  }
}
```

### EmailService Extension

```typescript
// Ajouter à EmailService existant
export class EmailService {
  // ... méthodes existantes ...

  /**
   * Envoyer un email à un prospect
   */
  async sendProspectEmail(
    prospect: Prospect,
    template: string,
    customSubject?: string,
    customMessage?: string,
    variables?: Record<string, any>
  ): Promise<boolean> {
    try {
      const templates = {
        welcome: {
          subject: 'Merci pour votre intérêt - Démonstration CRM',
          template: 'prospect-welcome'
        },
        qualification: {
          subject: 'Qualification de vos besoins CRM',
          template: 'prospect-qualification'
        },
        proposal: {
          subject: 'Proposition commerciale personnalisée',
          template: 'prospect-proposal'
        }
      };

      const templateConfig = templates[template] || templates.welcome;
      
      const emailData = {
        to: prospect.email,
        subject: customSubject || templateConfig.subject,
        template: templateConfig.template,
        context: {
          nom: prospect.nom,
          entreprise: prospect.entreprise,
          message_initial: prospect.message,
          custom_message: customMessage,
          ...variables
        }
      };

      // Utiliser le système d'email existant (Nodemailer ou EmailJS)
      return await this.sendEmail(emailData);
    } catch (error) {
      this.logger.error(`Erreur envoi email prospect ${prospect.id}: ${error.message}`);
      return false;
    }
  }
}
```

## 🎨 Interface Frontend

### 1. Modification du Formulaire Home

```jsx
// Dans Home.jsx - Section Contact
const ContactForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    entreprise: '',
    email: '',
    telephone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/prospects', formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({ nom: '', entreprise: '', email: '', telephone: '', message: '' });
        
        // Message de succès
        toast.success('Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError('Un prospect avec cet email existe déjà. Nous vous contacterons bientôt.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          Demande envoyée !
        </h3>
        <p className="text-green-700">
          Merci pour votre intérêt. Notre équipe vous contactera dans les plus brefs délais.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-4 text-green-600 hover:text-green-800 font-medium"
        >
          Envoyer une nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nom *
          </label>
          <input
            type="text"
            required
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Entreprise
          </label>
          <input
            type="text"
            value={formData.entreprise}
            onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
            className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Nom de votre entreprise"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email *
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="votre@email.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Téléphone
        </label>
        <input
          type="tel"
          value={formData.telephone}
          onChange={(e) => setFormData({...formData, telephone: e.target.value})}
          className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="+33 1 23 45 67 89"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Message
        </label>
        <textarea
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Parlez-nous de vos besoins..."
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Envoi en cours...
          </div>
        ) : (
          'Demander ma démo gratuite'
        )}
      </button>
    </form>
  );
};
```

### 2. Page Prospects (Adaptation de Contacts.jsx)

```jsx
const Prospects = () => {
  const [prospects, setProspects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const fetchProspects = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 15);
      if (search) params.append('search', search);
      if (statutFilter) params.append('statut', statutFilter);

      const res = await api.get('/api/prospects', { params });
      
      if (res.data.success) {
        setProspects(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error('Erreur chargement prospects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarquerContacte = async (id) => {
    try {
      await api.put(`/api/prospects/${id}/contact`);
      fetchProspects(pagination.page);
      toast.success('Prospect marqué comme contacté');
    } catch (error) {
      toast.error('Erreur lors du marquage');
    }
  };

  const handleSendEmail = async (id, emailData) => {
    try {
      const response = await api.post(`/api/prospects/${id}/email`, emailData);
      if (response.data.success) {
        toast.success('Email envoyé avec succès');
        fetchProspects(pagination.page);
        setShowEmailModal(false);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    }
  };

  const getStatutBadge = (statut) => {
    const styles = {
      nouveau: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
      contacte: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      qualifie: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      converti: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
      perdu: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    };
    
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${styles[statut]}`}>
        {statut.charAt(0).toUpperCase() + statut.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-purple-950 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-2xl ring-4 ring-purple-200/50">
              <Users className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Prospects
              </h1>
              <p className="text-lg text-purple-700 dark:text-purple-300 mt-2">
                Gestion des demandes de démonstration
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filtres */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher nom / entreprise / email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Tous statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="contacte">Contacté</option>
              <option value="qualifie">Qualifié</option>
              <option value="converti">Converti</option>
              <option value="perdu">Perdu</option>
            </select>

            <button
              onClick={() => {
                setSearch('');
                setStatutFilter('');
                fetchProspects(1);
              }}
              className="px-6 py-3 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Liste des prospects */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            </div>
          ) : prospects.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                Aucun prospect trouvé
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
                  <tr>
                    <th className="px-8 py-5 text-left">Date</th>
                    <th className="px-8 py-5 text-left">Nom</th>
                    <th className="px-8 py-5 text-left">Entreprise</th>
                    <th className="px-8 py-5 text-left">Email</th>
                    <th className="px-8 py-5 text-center">Statut</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 dark:divide-purple-900/50">
                  {prospects.map(prospect => (
                    <motion.tr
                      key={prospect.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors"
                    >
                      <td className="px-8 py-5 font-medium">
                        {new Date(prospect.createdAt).toLocaleString('fr-FR', { 
                          dateStyle: 'short', 
                          timeStyle: 'short' 
                        })}
                      </td>
                      <td className="px-8 py-5 font-medium">{prospect.nom}</td>
                      <td className="px-8 py-5">{prospect.entreprise || '—'}</td>
                      <td className="px-8 py-5">{prospect.email}</td>
                      <td className="px-8 py-5 text-center">
                        {getStatutBadge(prospect.statut)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Bouton Voir détails */}
                          <button
                            onClick={() => {
                              setSelectedProspect(prospect);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                            title="Voir les détails"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          {/* Bouton Envoyer email */}
                          <button
                            onClick={() => {
                              setSelectedProspect(prospect);
                              setShowEmailModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition"
                            title="Envoyer un email"
                          >
                            <Mail className="w-5 h-5" />
                          </button>

                          {/* Bouton Marquer contacté */}
                          {prospect.statut === 'nouveau' && (
                            <button
                              onClick={() => handleMarquerContacte(prospect.id)}
                              className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition"
                              title="Marquer comme contacté"
                            >
                              <Phone className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modales */}
        {showDetailModal && selectedProspect && (
          <ProspectDetailModal
            prospect={selectedProspect}
            onClose={() => setShowDetailModal(false)}
            onUpdate={() => {
              fetchProspects(pagination.page);
              setShowDetailModal(false);
            }}
          />
        )}

        {showEmailModal && selectedProspect && (
          <ProspectEmailModal
            prospect={selectedProspect}
            onClose={() => setShowEmailModal(false)}
            onSend={handleSendEmail}
          />
        )}
      </div>
    </div>
  );
};
```

## 🔄 Intégration avec le Système Existant

### 1. Notifications (NotificationContext)

```jsx
// Ajouter aux notifications existantes
const NotificationContext = () => {
  const [notifications, setNotifications] = useState({
    commandes: 0,
    prospects: 0, // Nouveau
    total: 0
  });

  const fetchNotifications = async () => {
    try {
      const [commandesRes, prospectsRes] = await Promise.all([
        api.get('/api/commande-online/stats'),
        api.get('/api/prospects/stats') // Nouveau endpoint
      ]);

      const commandesStats = commandesRes.data;
      const prospectsStats = prospectsRes.data;

      setNotifications({
        commandes: commandesStats.nouveau || 0,
        prospects: prospectsStats.nouveau || 0,
        total: (commandesStats.nouveau || 0) + (prospectsStats.nouveau || 0)
      });
    } catch (error) {
      console.error('Erreur notifications:', error);
    }
  };

  // ... reste du contexte
};
```

### 2. Sidebar Navigation

```jsx
// Ajouter dans Sidebar.jsx
const sidebarItems = [
  // ... items existants ...
  {
    name: 'Prospects',
    href: '/dashboard/prospects',
    icon: Users,
    badge: notifications.prospects > 0 ? notifications.prospects : null
  },
  // ... autres items ...
];
```

### 3. Dashboard Widgets

```jsx
// Ajouter widget prospects au dashboard
const ProspectsWidget = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/prospects/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Erreur stats prospects:', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Chargement...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Prospects</h3>
        <Users className="w-6 h-6 text-blue-600" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold text-blue-600">{stats.nouveau}</p>
          <p className="text-sm text-gray-600">Nouveaux</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">{stats.converti}</p>
          <p className="text-sm text-gray-600">Convertis</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{stats.nouveaux_7j}</span> nouveaux cette semaine
        </p>
      </div>
      
      <Link 
        to="/dashboard/prospects"
        className="mt-4 block text-center bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition"
      >
        Voir tous les prospects
      </Link>
    </div>
  );
};
```

## 📧 Templates d'Emails

### Templates EmailJS

```html
<!-- Template: prospect-welcome -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Merci pour votre intérêt</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c5aa0;">Merci pour votre intérêt !</h2>
        
        <p>Bonjour <strong>{{nom}}</strong>,</p>
        
        <p>Nous avons bien reçu votre demande de démonstration et nous vous remercions de votre intérêt pour notre solution CRM.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📋 Votre demande :</h3>
            <ul style="list-style: none; padding: 0;">
                <li><strong>Nom :</strong> {{nom}}</li>
                {{#if entreprise}}<li><strong>Entreprise :</strong> {{entreprise}}</li>{{/if}}
                <li><strong>Email :</strong> {{email}}</li>
                {{#if telephone}}<li><strong>Téléphone :</strong> {{telephone}}</li>{{/if}}
            </ul>
            {{#if message_initial}}
            <p><strong>Votre message :</strong><br>{{message_initial}}</p>
            {{/if}}
        </div>
        
        {{#if custom_message}}
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p>{{custom_message}}</p>
        </div>
        {{/if}}
        
        <p>Notre équipe commerciale vous contactera dans les plus brefs délais pour organiser une démonstration personnalisée de notre solution.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0;">Cordialement,<br>
            <strong>L'équipe CRM System</strong></p>
        </div>
    </div>
</body>
</html>
```

## 🧪 Propriétés de Correctness

### Propriété 1 : Unicité des Prospects
```typescript
/**
 * Validates: Requirements 1.1 - Soumission de Prospect
 * Property: Un email ne peut être associé qu'à un seul prospect
 */
describe('Prospect Email Uniqueness', () => {
  it('should reject duplicate email addresses', async () => {
    const prospectData = {
      nom: 'Test User',
      email: 'test@example.com',
      entreprise: 'Test Corp'
    };

    // Premier prospect
    const first = await prospectsService.create(prospectData);
    expect(first.success).toBe(true);

    // Tentative de doublon
    await expect(prospectsService.create(prospectData))
      .rejects.toThrow('Un prospect avec cet email existe déjà');
  });
});
```

### Propriété 2 : Validation des Données
```typescript
/**
 * Validates: Requirements 1.1 - Validation côté serveur
 * Property: Toutes les données de prospect doivent être valides
 */
describe('Prospect Data Validation', () => {
  it('should validate required fields', async () => {
    const invalidData = { entreprise: 'Test Corp' }; // Manque nom et email

    await expect(prospectsService.create(invalidData))
      .rejects.toThrow();
  });

  it('should validate email format', async () => {
    const invalidEmail = {
      nom: 'Test User',
      email: 'invalid-email'
    };

    await expect(prospectsService.create(invalidEmail))
      .rejects.toThrow();
  });
});
```

### Propriété 3 : Changements de Statut
```typescript
/**
 * Validates: Requirements 2.2, 3.2 - Gestion des statuts
 * Property: Les transitions de statut doivent être logiques
 */
describe('Prospect Status Transitions', () => {
  it('should transition from nouveau to contacte when marked as contacted', async () => {
    const prospect = await createTestProspect();
    expect(prospect.statut).toBe('nouveau');

    const updated = await prospectsService.marquerContacte(prospect.id, 'admin@test.com');
    expect(updated.statut).toBe('contacte');
    expect(updated.date_contact).toBeDefined();
    expect(updated.contacte_par).toBe('admin@test.com');
  });
});
```

### Propriété 4 : Intégrité des Communications
```typescript
/**
 * Validates: Requirements 4.1 - Communication avec prospects
 * Property: L'envoi d'email doit mettre à jour les métadonnées
 */
describe('Prospect Email Communication', () => {
  it('should update email metadata when email is sent', async () => {
    const prospect = await createTestProspect();
    
    const result = await prospectsService.sendEmail(
      prospect.id,
      { template: 'welcome' },
      'admin@test.com'
    );

    expect(result.success).toBe(true);
    
    const updated = await prospectsService.findOne(prospect.id);
    expect(updated.email_envoye).toBe(true);
    expect(updated.date_email).toBeDefined();
    expect(updated.statut).toBe('contacte');
  });
});
```

## 📊 Métriques et Monitoring

### KPIs à Suivre
1. **Taux de conversion formulaire** : Soumissions réussies / Tentatives
2. **Temps de réponse moyen** : Délai entre soumission et premier contact
3. **Taux de conversion prospect → client** : Prospects convertis / Total prospects
4. **Qualité des leads** : Répartition par statut final
5. **Performance des templates email** : Taux d'ouverture par template

### Tableaux de Bord
- Widget prospects sur le dashboard principal
- Graphiques d'évolution temporelle
- Répartition par source (website, referral, etc.)
- Performance des campagnes email

Cette architecture complète permet de transformer le formulaire statique de la page Home en un véritable système de gestion de prospects, intégré harmonieusement avec l'écosystème CRM existant.