import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, LogOut, Pencil, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cafeService } from '../services/cafeService.js';
import { promoService } from '../services/promoService.js';
import { authService } from '../services/authService.js';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const newCafe = () => ({
  name: '', description: '', address: '', area: 'Tembalang', latitude: '', longitude: '',
  price_min: '', price_max: '', open_time: '08:00', close_time: '22:00',
  wifi_speed_mbps: '', outlet_level: 3, noise_level: 3, seat_capacity: 20,
  has_ac: false, has_musholla: false, tags: '', image_url: '',
});
const newPromo = () => ({ cafe_id: '', title: '', description: '', terms: '', requires_ktm: false, valid_from: '', valid_until: '' });
const dateOnly = (value) => value ? String(value).slice(0, 10) : '';
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

async function optimizeCafeImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Pilih foto JPG, PNG, atau WebP.');
  }
  if (file.size > 20 * 1024 * 1024) throw new Error('Ukuran foto asli maksimal 20 MB.');

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    const loaded = new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('Foto tidak dapat dibuka. Coba file gambar lain.'));
    });
    image.src = objectUrl;
    await loaded;

    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);

    let blob;
    for (const quality of [0.82, 0.7, 0.58, 0.46]) {
      blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (blob && blob.size <= MAX_IMAGE_BYTES) break;
    }
    if (!blob || blob.size > MAX_IMAGE_BYTES) throw new Error('Foto terlalu besar setelah dikompres. Pilih foto lain.');

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'foto-kafe';
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function Field({ label, children, className = '' }) {
  return <label className={`admin-field ${className}`}><span>{label}</span>{children}</label>;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('cafes');
  const [cafes, setCafes] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [cafeForm, setCafeForm] = useState(newCafe);
  const [selectedCafeImage, setSelectedCafeImage] = useState(null);
  const [cafeImagePreview, setCafeImagePreview] = useState('');
  const [promoForm, setPromoForm] = useState(newPromo);

  useEffect(() => {
    if (!selectedCafeImage) {
      setCafeImagePreview(cafeForm.image_url || '');
      return undefined;
    }
    const previewUrl = URL.createObjectURL(selectedCafeImage);
    setCafeImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedCafeImage, cafeForm.image_url]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [cafeResponse, promoResponse] = await Promise.all([cafeService.getAll({ limit: 100 }), promoService.getAll()]);
      setCafes(cafeResponse.data.data.cafes ?? []);
      setPromos(promoResponse.data.data ?? []);
    } catch (err) {
      setError(err.message || 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const resetForm = () => {
    setEditing(null);
    setFormError('');
    setCafeForm(newCafe());
    setSelectedCafeImage(null);
    setPromoForm(newPromo());
  };

  const startEditCafe = (cafe) => {
    setTab('cafes'); setEditing(cafe.id); setFormError('');
    setSelectedCafeImage(null);
    setCafeForm({ ...newCafe(), ...cafe, tags: (cafe.tags ?? []).join(', ') });
    document.getElementById('admin-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startEditPromo = (promo) => {
    setTab('promos'); setEditing(promo.id); setFormError('');
    setPromoForm({ ...newPromo(), ...promo, valid_from: dateOnly(promo.valid_from), valid_until: dateOnly(promo.valid_until) });
    document.getElementById('admin-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const saveCafe = async (event) => {
    event.preventDefault(); setSaving(true); setFormError('');
    const payload = {
      name: cafeForm.name, description: cafeForm.description || null, address: cafeForm.address, area: cafeForm.area,
      latitude: Number(cafeForm.latitude), longitude: Number(cafeForm.longitude),
      price_min: Number(cafeForm.price_min || 0), price_max: Number(cafeForm.price_max || 0),
      open_time: cafeForm.open_time, close_time: cafeForm.close_time,
      wifi_speed_mbps: Number(cafeForm.wifi_speed_mbps || 0), outlet_level: Number(cafeForm.outlet_level),
      noise_level: Number(cafeForm.noise_level), seat_capacity: Number(cafeForm.seat_capacity),
      has_ac: Boolean(cafeForm.has_ac), has_musholla: Boolean(cafeForm.has_musholla),
      tags: cafeForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      image_url: cafeForm.image_url || null,
    };
    if (payload.price_max < payload.price_min) {
      setFormError('Harga maksimum harus sama dengan atau lebih besar dari harga minimum.');
      setSaving(false);
      return;
    }
    try {
      if (selectedCafeImage) {
        const uploadResponse = await cafeService.uploadImage(selectedCafeImage);
        payload.image_url = uploadResponse.data.data.image_url;
      }
      if (editing) await cafeService.update(editing, payload); else await cafeService.create(payload);
      resetForm(); await loadData();
    } catch (err) { setFormError(err.message || 'Tidak dapat menyimpan kafe.'); }
    finally { setSaving(false); }
  };

  const chooseCafeImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setFormError('');
    try {
      const optimized = await optimizeCafeImage(file);
      setSelectedCafeImage(optimized);
    } catch (err) {
      setFormError(err.message || 'Foto tidak dapat diproses.');
    }
  };

  const savePromo = async (event) => {
    event.preventDefault(); setSaving(true); setFormError('');
    const payload = {
      cafe_id: promoForm.cafe_id, title: promoForm.title,
      description: promoForm.description || null, terms: promoForm.terms || null,
      requires_ktm: Boolean(promoForm.requires_ktm),
      valid_from: promoForm.valid_from, valid_until: promoForm.valid_until,
    };
    if (payload.valid_until < payload.valid_from) {
      setFormError('Tanggal berakhir harus sama dengan atau setelah tanggal mulai.');
      setSaving(false);
      return;
    }
    try {
      if (editing) await promoService.update(editing, payload); else await promoService.create(payload);
      resetForm(); await loadData();
    } catch (err) { setFormError(err.message || 'Tidak dapat menyimpan promo.'); }
    finally { setSaving(false); }
  };

  const deleteCafe = async (cafe) => {
    if (!window.confirm(`Hapus kafe “${cafe.name}”? Ulasan, promo, crowd report, dan favorit terkait juga dapat ikut terhapus.`)) return;
    try { await cafeService.delete(cafe.id); await loadData(); }
    catch (err) { setError(err.message || 'Tidak dapat menghapus kafe.'); }
  };

  const deletePromo = async (promo) => {
    if (!window.confirm(`Hapus promo “${promo.title}”?`)) return;
    try { await promoService.delete(promo.id); await loadData(); }
    catch (err) { setError(err.message || 'Tidak dapat menghapus promo.'); }
  };

  return (
    <div className="page-container admin-page">
      <Link to="/profil" className="btn btn-secondary btn-sm admin-back"><ArrowLeft size={16} /> Profil</Link>
      <div className="admin-heading">
        <div><p className="admin-eyebrow">ADMINISTRASI</p><h1 className="page-title">Kelola Data</h1><p className="page-subtitle">Tambah, ubah, dan hapus data kafe serta promo.</p></div>
        <div className="admin-heading-actions"><button className="btn btn-secondary" onClick={loadData} disabled={loading}><RefreshCw size={16} /> Muat ulang</button><button className="btn btn-secondary" onClick={() => { authService.logout(); navigate('/profil', { replace: true }); }}><LogOut size={16} /> Keluar</button></div>
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Jenis data">
        <button role="tab" aria-selected={tab === 'cafes'} className={tab === 'cafes' ? 'active' : ''} onClick={() => { setTab('cafes'); resetForm(); }}>Kafe <span>{cafes.length}</span></button>
        <button role="tab" aria-selected={tab === 'promos'} className={tab === 'promos' ? 'active' : ''} onClick={() => { setTab('promos'); resetForm(); }}>Promo <span>{promos.length}</span></button>
      </div>

      {error && <ErrorState message={error} onRetry={loadData} />}
      {loading ? <LoadingSpinner /> : !error && (
        <div className="admin-list">
          {tab === 'cafes' && (cafes.length ? cafes.map((cafe) => (
            <article className="admin-row" key={cafe.id}>
              <div className="admin-row-copy"><strong>{cafe.name}</strong><span>{cafe.area} · Rp{Number(cafe.price_min || 0).toLocaleString('id-ID')}–Rp{Number(cafe.price_max || 0).toLocaleString('id-ID')} · {cafe.wifi_speed_mbps} Mbps</span></div>
              <div className="admin-row-actions"><button className="icon-btn" onClick={() => startEditCafe(cafe)} aria-label={`Edit ${cafe.name}`}><Pencil size={18} /></button><button className="icon-btn danger" onClick={() => deleteCafe(cafe)} aria-label={`Hapus ${cafe.name}`}><Trash2 size={18} /></button></div>
            </article>
          )) : <EmptyState title="Belum ada data kafe" description="Tambahkan kafe pertama menggunakan formulir di bawah." />)}
          {tab === 'promos' && (promos.length ? promos.map((promo) => (
            <article className="admin-row" key={promo.id}>
              <div className="admin-row-copy"><strong>{promo.title}</strong><span>{promo.cafes?.name || cafes.find((cafe) => cafe.id === promo.cafe_id)?.name || 'Kafe'} · berlaku sampai {dateOnly(promo.valid_until)}</span></div>
              <div className="admin-row-actions"><button className="icon-btn" onClick={() => startEditPromo(promo)} aria-label={`Edit ${promo.title}`}><Pencil size={18} /></button><button className="icon-btn danger" onClick={() => deletePromo(promo)} aria-label={`Hapus ${promo.title}`}><Trash2 size={18} /></button></div>
            </article>
          )) : <EmptyState title="Belum ada promo" description="Tambahkan promo pertama menggunakan formulir di bawah." />)}
        </div>
      )}

      <section className="admin-editor" id="admin-editor">
        <div className="admin-editor-heading"><div><p className="admin-eyebrow">{editing ? 'UBAH DATA' : 'DATA BARU'}</p><h2>{editing ? 'Edit' : 'Tambah'} {tab === 'cafes' ? 'Kafe' : 'Promo'}</h2></div>{editing && <button className="btn btn-ghost btn-sm" onClick={resetForm}><X size={16} /> Batal edit</button>}</div>
        {formError && <p className="admin-form-error" role="alert">{formError}</p>}

        {tab === 'cafes' ? (
          <form className="admin-form-grid" onSubmit={saveCafe}>
            <Field label="Nama kafe *"><input className="form-input" required maxLength={100} value={cafeForm.name} onChange={(e) => setCafeForm({ ...cafeForm, name: e.target.value })} /></Field>
            <Field label="Area *"><input className="form-input" required value={cafeForm.area} onChange={(e) => setCafeForm({ ...cafeForm, area: e.target.value })} /></Field>
            <Field label="Alamat *" className="wide"><input className="form-input" required value={cafeForm.address} onChange={(e) => setCafeForm({ ...cafeForm, address: e.target.value })} /></Field>
            <Field label="Deskripsi" className="wide"><textarea className="form-input form-textarea" value={cafeForm.description || ''} onChange={(e) => setCafeForm({ ...cafeForm, description: e.target.value })} /></Field>
            <Field label="Latitude *"><input className="form-input" type="number" step="any" required value={cafeForm.latitude} onChange={(e) => setCafeForm({ ...cafeForm, latitude: e.target.value })} /></Field>
            <Field label="Longitude *"><input className="form-input" type="number" step="any" required value={cafeForm.longitude} onChange={(e) => setCafeForm({ ...cafeForm, longitude: e.target.value })} /></Field>
            <Field label="Harga minimum"><input className="form-input" type="number" min="0" value={cafeForm.price_min} onChange={(e) => setCafeForm({ ...cafeForm, price_min: e.target.value })} /></Field>
            <Field label="Harga maksimum"><input className="form-input" type="number" min="0" value={cafeForm.price_max} onChange={(e) => setCafeForm({ ...cafeForm, price_max: e.target.value })} /></Field>
            <Field label="Jam buka *"><input className="form-input" type="time" required value={String(cafeForm.open_time).slice(0, 5)} onChange={(e) => setCafeForm({ ...cafeForm, open_time: e.target.value })} /></Field>
            <Field label="Jam tutup *"><input className="form-input" type="time" required value={String(cafeForm.close_time).slice(0, 5)} onChange={(e) => setCafeForm({ ...cafeForm, close_time: e.target.value })} /></Field>
            <Field label="WiFi (Mbps)"><input className="form-input" type="number" min="0" step="0.1" value={cafeForm.wifi_speed_mbps} onChange={(e) => setCafeForm({ ...cafeForm, wifi_speed_mbps: e.target.value })} /></Field>
            <Field label="Kapasitas kursi"><input className="form-input" type="number" min="0" value={cafeForm.seat_capacity} onChange={(e) => setCafeForm({ ...cafeForm, seat_capacity: e.target.value })} /></Field>
            <Field label="Colokan (1–5)"><select className="form-input form-select" value={cafeForm.outlet_level} onChange={(e) => setCafeForm({ ...cafeForm, outlet_level: e.target.value })}>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}</select></Field>
            <Field label="Ketenangan (1–5)"><select className="form-input form-select" value={cafeForm.noise_level} onChange={(e) => setCafeForm({ ...cafeForm, noise_level: e.target.value })}>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}</select></Field>
            <Field label="Foto kafe" className="wide">
              <input className="form-input image-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseCafeImage} />
              <small className="image-upload-hint">Pilih foto dari perangkat (JPG, PNG, atau WebP). Foto otomatis diperkecil sebelum diunggah.</small>
            </Field>
            {cafeImagePreview && <div className="image-upload-preview wide"><img src={cafeImagePreview} alt="Pratinjau foto kafe" /><div><span>{selectedCafeImage ? 'Foto baru siap diunggah' : 'Foto saat ini'}</span><button type="button" className="btn btn-ghost btn-sm" onClick={() => { setSelectedCafeImage(null); setCafeForm({ ...cafeForm, image_url: '' }); }}>Hapus foto</button></div></div>}
            <Field label="Tag (pisahkan koma)" className="wide"><input className="form-input" value={cafeForm.tags} onChange={(e) => setCafeForm({ ...cafeForm, tags: e.target.value })} placeholder="skripsi, kerja-kelompok, santai" /></Field>
            <div className="admin-checks"><label><input type="checkbox" checked={Boolean(cafeForm.has_ac)} onChange={(e) => setCafeForm({ ...cafeForm, has_ac: e.target.checked })} /> Ada AC</label><label><input type="checkbox" checked={Boolean(cafeForm.has_musholla)} onChange={(e) => setCafeForm({ ...cafeForm, has_musholla: e.target.checked })} /> Ada musholla</label></div>
            <div className="admin-form-actions wide"><button type="button" className="btn btn-secondary" onClick={resetForm}>Kosongkan</button><button className="btn btn-primary" disabled={saving}><Save size={16} />{saving ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Tambah kafe'}</button></div>
          </form>
        ) : (
          <form className="admin-form-grid" onSubmit={savePromo}>
            <Field label="Kafe *" className="wide"><select className="form-input form-select" required value={promoForm.cafe_id} onChange={(e) => setPromoForm({ ...promoForm, cafe_id: e.target.value })}><option value="">Pilih kafe</option>{cafes.map((cafe) => <option key={cafe.id} value={cafe.id}>{cafe.name}</option>)}</select></Field>
            <Field label="Judul promo *" className="wide"><input className="form-input" required value={promoForm.title} onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })} /></Field>
            <Field label="Deskripsi" className="wide"><textarea className="form-input form-textarea" value={promoForm.description || ''} onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })} /></Field>
            <Field label="Syarat & ketentuan" className="wide"><textarea className="form-input form-textarea" value={promoForm.terms || ''} onChange={(e) => setPromoForm({ ...promoForm, terms: e.target.value })} /></Field>
            <Field label="Mulai berlaku *"><input className="form-input" type="date" required value={promoForm.valid_from} onChange={(e) => setPromoForm({ ...promoForm, valid_from: e.target.value })} /></Field>
            <Field label="Berakhir *"><input className="form-input" type="date" required min={promoForm.valid_from} value={promoForm.valid_until} onChange={(e) => setPromoForm({ ...promoForm, valid_until: e.target.value })} /></Field>
            <div className="admin-checks"><label><input type="checkbox" checked={Boolean(promoForm.requires_ktm)} onChange={(e) => setPromoForm({ ...promoForm, requires_ktm: e.target.checked })} /> Memerlukan KTM</label></div>
            <div className="admin-form-actions wide"><button type="button" className="btn btn-secondary" onClick={resetForm}>Kosongkan</button><button className="btn btn-primary" disabled={saving || !cafes.length}><Save size={16} />{saving ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Tambah promo'}</button></div>
          </form>
        )}
      </section>
      <div className="admin-add-fab"><button className="btn btn-primary" onClick={() => { resetForm(); document.getElementById('admin-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}><Plus size={18} /> Tambah {tab === 'cafes' ? 'kafe' : 'promo'}</button></div>
    </div>
  );
}
