// Format waktu "X menit yang lalu" / "X jam yang lalu"
export function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

// Cek apakah kafe sedang buka (zona WIB)
export function isOpenNow(open_time, close_time) {
  const now = new Date();
  const wibOffset = 7 * 60;
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);

  const [oh, om] = open_time.split(':').map(Number);
  const [ch, cm] = close_time.split(':').map(Number);
  const openMin  = oh * 60 + om;
  const closeMin = ch * 60 + cm;

  if (closeMin <= openMin) {
    return wibMinutes >= openMin || wibMinutes < closeMin;
  }
  return wibMinutes >= openMin && wibMinutes < closeMin;
}

// Format jam "HH:MM"
export function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr.substring(0, 5);
}

// Format tanggal Indonesia
export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// Hitung mundur ke tanggal berakhir
export function countdownTo(dateStr) {
  const target = new Date(dateStr);
  target.setHours(23, 59, 59, 999);
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);

  if (days > 0) return `${days} hari ${hours} jam lagi`;
  if (hours > 0) return `${hours} jam ${mins} menit lagi`;
  return `${mins} menit lagi`;
}

// Format rupiah
export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}
