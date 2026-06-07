import { useState, useEffect } from 'react';

const PHASES_CONFIG = [
  {
    id: 1,
    name: 'Discovery',
    icon: '🔍',
    color: '#FF6B35',
    items: [
      'Buyer persona venezolano/latinoamericano definido',
      'Análisis de competencia directa e indirecta',
      'TAM/SAM/SOM estimado',
      'Precios validados con 5+ clientes potenciales',
      'Propuesta única de valor de BOCADO definida',
      'Canales de adquisición identificados',
      '10 pre-pedidos tomados para validar demanda',
    ],
  },
  {
    id: 2,
    name: 'Negocio',
    icon: '💼',
    color: '#E83F6F',
    items: [
      'Tiers de precios definidos (20 uds, 50 uds, combos)',
      'Funnel comercial completo diseñado',
      'CAC y LTV calculados',
      'Política de pagos definida (Zelle/Venmo → Stripe)',
      'Sistema de referidos diseñado',
      'Partnerships con comunidades venezolanas identificados',
      'Proyección de ingresos Año 1 completa',
    ],
  },
  {
    id: 3,
    name: 'MVP',
    icon: '🚀',
    color: '#2274A5',
    items: [
      'PRD completo de la plataforma web',
      'Schema de base de datos en Supabase',
      'Página principal con hero y catálogo',
      'Flujo de carrito y checkout completo',
      'Sistema de estados del pedido (9 estados)',
      'Dashboard administrativo con login',
      'Control de pickup activo/inactivo',
      'Página de seguimiento de pedido',
      'Notificaciones por email (Resend)',
      'Deploy en Vercel con dominio personalizado',
    ],
  },
  {
    id: 4,
    name: 'AI Agents',
    icon: '🤖',
    color: '#32936F',
    items: [
      'Order Confirmation Agent (email inmediato)',
      'Status Update Agent (emails por cambio de estado)',
      'Customer Support Agent (WhatsApp FAQ)',
      'Content Marketing Agent (3 posts/semana)',
      'Orders Analytics Agent (reporte semanal)',
      'Lead Recovery Agent (carritos abandonados)',
    ],
  },
  {
    id: 5,
    name: 'GTM',
    icon: '📣',
    color: '#9B5DE5',
    items: [
      'Oferta de lanzamiento irresistible creada',
      'Landing page optimizada para mobile',
      'Perfil de Instagram activo con 6+ posts',
      'Campaña Meta Ads configurada',
      'Secuencia de 7 emails post-pedido lista',
      'Scripts de DM para WhatsApp redactados',
      'Publicación en 10 grupos venezolanos',
      'Primer pickup anunciado con fecha y hora',
    ],
  },
  {
    id: 6,
    name: 'Automatización',
    icon: '⚙️',
    color: '#F4845F',
    items: [
      'n8n instalado y conectado a Supabase',
      'Workflow: email automático al crear pedido',
      'Workflow: email automático al cambiar estado',
      'Workflow: reporte semanal al dueño',
      'Workflow: recordatorio de pickup 48h antes',
      'Workflow: follow-up post-entrega D+1 y D+7',
      'Google Sheets con datos de pedidos y métricas',
      'Dashboard de KPIs en tiempo real',
    ],
  },
  {
    id: 7,
    name: 'Ejecución',
    icon: '🏆',
    color: '#FFD700',
    items: [
      'Día 1: Proyecto Next.js + Supabase + Vercel configurado',
      'Día 2: Home + catálogo con productos reales',
      'Día 3: Flujo de pedido completo funcionando',
      'Día 4: Dashboard admin + emails de estado',
      'Día 5: Pickup + página de seguimiento',
      'Día 6: CRUD de productos + QA en móvil',
      'Día 7: Lanzamiento y primer pedido real',
      '30 días: 20+ pedidos y métricas validadas',
    ],
  },
];

const DEFAULT_PROJECT = {
  id: 'bocado',
  name: 'BOCADO',
  tagline: 'Tequeños Venezolanos',
  startDate: '2026-05-20',
  phases: PHASES_CONFIG.map((p) => ({
    id: p.id,
    status: 'pending',
    notes: '',
    items: p.items.map((text, i) => ({ id: `p${p.id}-${i}`, text, done: false })),
  })),
};

function getStatusLabel(status) {
  return { pending: 'Pendiente', 'in-progress': 'En progreso', completed: 'Completada' }[status] || status;
}

function calcPhaseProgress(phaseData) {
  if (!phaseData?.items?.length) return 0;
  const done = phaseData.items.filter((i) => i.done).length;
  return Math.round((done / phaseData.items.length) * 100);
}

function calcTotalProgress(project) {
  if (!project?.phases?.length) return 0;
  const total = project.phases.reduce((sum, p) => sum + calcPhaseProgress(p), 0);
  return Math.round(total / project.phases.length);
}

export default function ProjectTracker() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('bocado-tracker-v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [DEFAULT_PROJECT];
  });

  const [currentProjectId, setCurrentProjectId] = useState('bocado');
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('bocado-tracker-v1', JSON.stringify(projects));
    } catch {}
  }, [projects]);

  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  function updateProject(updater) {
    setProjects((prev) =>
      prev.map((p) => (p.id === currentProjectId ? updater(p) : p))
    );
  }

  function toggleItem(phaseId, itemId) {
    updateProject((proj) => ({
      ...proj,
      phases: proj.phases.map((ph) =>
        ph.id === phaseId
          ? {
              ...ph,
              items: ph.items.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item
              ),
            }
          : ph
      ),
    }));
  }

  function setPhaseStatus(phaseId, status) {
    updateProject((proj) => ({
      ...proj,
      phases: proj.phases.map((ph) =>
        ph.id === phaseId ? { ...ph, status } : ph
      ),
    }));
  }

  function setPhaseNotes(phaseId, notes) {
    updateProject((proj) => ({
      ...proj,
      phases: proj.phases.map((ph) =>
        ph.id === phaseId ? { ...ph, notes } : ph
      ),
    }));
  }

  function addProject() {
    if (!newProjectName.trim()) return;
    const id = newProjectName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newProj = {
      ...DEFAULT_PROJECT,
      id,
      name: newProjectName,
      tagline: 'Nuevo proyecto',
      phases: PHASES_CONFIG.map((p) => ({
        id: p.id,
        status: 'pending',
        notes: '',
        items: p.items.map((text, i) => ({ id: `${id}-p${p.id}-${i}`, text, done: false })),
      })),
    };
    setProjects((prev) => [...prev, newProj]);
    setCurrentProjectId(id);
    setNewProjectName('');
    setShowNewProject(false);
  }

  const totalProgress = calcTotalProgress(project);

  return (
    <div style={styles.root}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>🧡 BOCADO</div>
          <div style={styles.headerMeta}>
            <span style={styles.tagline}>{project.tagline}</span>
            <span style={styles.startDate}>Inicio: {project.startDate}</span>
          </div>
        </div>
        <div style={styles.progressBig}>
          <div style={styles.progressBigNum}>{totalProgress}%</div>
          <div style={styles.progressBigLabel}>completado</div>
        </div>
      </div>

      {/* TOTAL PROGRESS BAR */}
      <div style={styles.totalBarWrap}>
        <div style={{ ...styles.totalBar, width: `${totalProgress}%` }} />
      </div>

      {/* PROJECT SELECTOR */}
      <div style={styles.projectRow}>
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setCurrentProjectId(p.id)}
            style={{
              ...styles.projectBtn,
              ...(p.id === currentProjectId ? styles.projectBtnActive : {}),
            }}
          >
            {p.name}
          </button>
        ))}
        {showNewProject ? (
          <div style={styles.newProjectRow}>
            <input
              style={styles.newProjectInput}
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Nombre del proyecto"
              onKeyDown={(e) => e.key === 'Enter' && addProject()}
              autoFocus
            />
            <button style={styles.newProjectSave} onClick={addProject}>✓</button>
            <button style={styles.newProjectCancel} onClick={() => setShowNewProject(false)}>✕</button>
          </div>
        ) : (
          <button style={styles.addProjectBtn} onClick={() => setShowNewProject(true)}>+ Proyecto</button>
        )}
      </div>

      {/* PHASES */}
      <div style={styles.phases}>
        {PHASES_CONFIG.map((config, idx) => {
          const phaseData = project.phases.find((p) => p.id === config.id);
          if (!phaseData) return null;
          const progress = calcPhaseProgress(phaseData);
          const isExpanded = expandedPhase === config.id;
          const statusColor = {
            pending: '#555',
            'in-progress': config.color,
            completed: '#32936F',
          }[phaseData.status];

          return (
            <div key={config.id} style={styles.phaseCard}>
              {/* Phase header */}
              <div
                style={styles.phaseHeader}
                onClick={() => setExpandedPhase(isExpanded ? null : config.id)}
              >
                <div style={styles.phaseLeft}>
                  <div style={{ ...styles.phaseIcon, background: config.color + '22', color: config.color }}>
                    {config.icon}
                  </div>
                  <div>
                    <div style={styles.phaseName}>
                      <span style={{ color: config.color }}>Fase {config.id}</span>
                      <span style={styles.phaseNameText}> — {config.name}</span>
                    </div>
                    <div style={styles.phaseStatusRow}>
                      <select
                        style={{ ...styles.statusSelect, color: statusColor, borderColor: statusColor + '55' }}
                        value={phaseData.status}
                        onChange={(e) => { e.stopPropagation(); setPhaseStatus(config.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="in-progress">En progreso</option>
                        <option value="completed">Completada</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div style={styles.phaseRight}>
                  <div style={styles.phasePercent}>{progress}%</div>
                  <div style={styles.phaseBarWrap}>
                    <div style={{ ...styles.phaseBar, width: `${progress}%`, background: config.color }} />
                  </div>
                  <div style={{ ...styles.chevron, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▾
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div style={styles.phaseBody}>
                  {/* Checklist */}
                  <div style={styles.checklistTitle}>Entregables</div>
                  <div style={styles.checklist}>
                    {phaseData.items.map((item) => (
                      <label key={item.id} style={styles.checkItem}>
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => toggleItem(config.id, item.id)}
                          style={styles.checkbox}
                        />
                        <span style={{ ...styles.checkText, ...(item.done ? styles.checkTextDone : {}) }}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Notes */}
                  <div style={styles.checklistTitle}>Notas / Decisiones</div>
                  <textarea
                    style={styles.notesInput}
                    value={phaseData.notes}
                    onChange={(e) => setPhaseNotes(config.id, e.target.value)}
                    placeholder="Documenta decisiones, bloqueos o aprendizajes de esta fase..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <span style={styles.footerText}>BOCADO · AI Business Developer · 2026-05-20</span>
        <span style={styles.footerSub}>Crunchy outside, cheesy inside. 🧀</span>
      </div>
    </div>
  );
}

const styles = {
  root: {
    background: '#0D0D0D',
    minHeight: '100vh',
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    color: '#E8E8E8',
    padding: '24px',
    maxWidth: '900px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  headerLeft: { display: 'flex', flexDirection: 'column', gap: '4px' },
  logo: { fontSize: '28px', fontWeight: '700', color: '#FFA600', letterSpacing: '-0.5px' },
  headerMeta: { display: 'flex', flexDirection: 'column', gap: '2px' },
  tagline: { fontSize: '13px', color: '#888', letterSpacing: '2px', textTransform: 'uppercase' },
  startDate: { fontSize: '12px', color: '#555' },
  progressBig: { textAlign: 'right' },
  progressBigNum: { fontSize: '36px', fontWeight: '700', color: '#FFA600', lineHeight: '1' },
  progressBigLabel: { fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' },
  totalBarWrap: {
    height: '4px',
    background: '#1E1E1E',
    borderRadius: '2px',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  totalBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #FFA600, #FFC107)',
    borderRadius: '2px',
    transition: 'width 0.6s ease',
  },
  projectRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '24px',
    alignItems: 'center',
  },
  projectBtn: {
    background: '#1A1A1A',
    border: '1px solid #2A2A2A',
    color: '#888',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.2s',
  },
  projectBtnActive: {
    background: '#FFA60022',
    border: '1px solid #FFA600',
    color: '#FFA600',
  },
  addProjectBtn: {
    background: 'transparent',
    border: '1px dashed #333',
    color: '#555',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
  },
  newProjectRow: { display: 'flex', gap: '6px', alignItems: 'center' },
  newProjectInput: {
    background: '#1A1A1A',
    border: '1px solid #FFA600',
    color: '#E8E8E8',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
  },
  newProjectSave: {
    background: '#FFA600',
    border: 'none',
    color: '#000',
    padding: '6px 10px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
  },
  newProjectCancel: {
    background: '#1A1A1A',
    border: '1px solid #333',
    color: '#888',
    padding: '6px 10px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  phases: { display: 'flex', flexDirection: 'column', gap: '10px' },
  phaseCard: {
    background: '#111',
    border: '1px solid #1E1E1E',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  phaseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  phaseLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  phaseIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },
  phaseName: { fontSize: '14px', fontWeight: '600', marginBottom: '4px' },
  phaseNameText: { color: '#C8C8C8' },
  phaseStatusRow: { display: 'flex', alignItems: 'center' },
  statusSelect: {
    background: 'transparent',
    border: '1px solid',
    borderRadius: '20px',
    padding: '2px 10px',
    fontSize: '11px',
    fontFamily: "'Poppins', sans-serif",
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    fontWeight: '500',
  },
  phaseRight: { display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 },
  phasePercent: { fontSize: '13px', color: '#888', minWidth: '36px', textAlign: 'right' },
  phaseBarWrap: { width: '80px', height: '4px', background: '#1E1E1E', borderRadius: '2px', overflow: 'hidden' },
  phaseBar: { height: '100%', borderRadius: '2px', transition: 'width 0.4s ease' },
  chevron: { color: '#444', fontSize: '16px', transition: 'transform 0.2s', width: '16px', textAlign: 'center' },
  phaseBody: {
    padding: '0 20px 20px',
    borderTop: '1px solid #1A1A1A',
  },
  checklistTitle: { fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', margin: '16px 0 10px' },
  checklist: { display: 'flex', flexDirection: 'column', gap: '8px' },
  checkItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' },
  checkbox: { marginTop: '3px', accentColor: '#FFA600', flexShrink: 0 },
  checkText: { fontSize: '13px', color: '#C8C8C8', lineHeight: '1.5' },
  checkTextDone: { textDecoration: 'line-through', color: '#444' },
  notesInput: {
    width: '100%',
    background: '#0D0D0D',
    border: '1px solid #1E1E1E',
    borderRadius: '8px',
    color: '#888',
    padding: '10px 12px',
    fontSize: '12px',
    fontFamily: "'Poppins', sans-serif",
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    lineHeight: '1.6',
  },
  footer: {
    marginTop: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #1A1A1A',
    paddingTop: '16px',
  },
  footerText: { fontSize: '11px', color: '#333' },
  footerSub: { fontSize: '11px', color: '#444' },
};
