
import React, { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { BeekeeperInput, GeneratedWebProfile } from '../types';
import { Check, X, ExternalLink, Shield, Search, Filter } from 'lucide-react';

interface BeekeeperRecord {
  user_id: string;
  profile_data: GeneratedWebProfile;
  input_data: BeekeeperInput;
  is_approved: boolean;
  slug: string;
  updated_at: string;
}

export const AdminPanel: React.FC = () => {
  const [records, setRecords] = useState<BeekeeperRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await profileService.getAllProfiles();
      setRecords(data);
    } catch (err) {
      console.error("Error cargando perfiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string, status: boolean) => {
    try {
      await profileService.approveProfile(userId, status);
      setRecords(prev => prev.map(r =>
        r.user_id === userId ? { ...r, is_approved: status } : r
      ));
    } catch (err) {
      alert("Error al actualizar estado");
    }
  };

  const filteredRecords = records.filter(r => {
    const farmName = r.input_data?.farmName || '';
    const name = r.input_data?.name || '';
    return farmName.toLowerCase().includes(filter.toLowerCase()) ||
      name.toLowerCase().includes(filter.toLowerCase());
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-nounYellow border-t-black rounded-full animate-spin"></div>
      <p className="mt-4 font-bold pixel-font text-xs uppercase">Accediendo a la Colmena...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-black p-2 rounded-lg text-white shadow-hard-sm">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase pixel-font tracking-tighter">Panel de Control</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase">Gestión de Guardianes y Colmenas Digitales</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por marca o nombre..."
            className="pl-10 pr-4 py-2 border-4 border-black bg-white shadow-hard-sm focus:outline-none focus:translate-y-[-2px] transition-all w-full md:w-64"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border-4 border-black shadow-hard overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b-4 border-black font-black uppercase text-[10px] tracking-widest">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Marca / Apicultor</th>
                <th className="px-6 py-4">Instagram / RSS</th>
                <th className="px-6 py-4">Subdominio</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/5">
              {filteredRecords.map((record) => (
                <tr key={record.user_id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-6 py-4">
                    {record.is_approved ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-black text-[10px] uppercase flex items-center gap-1 w-fit">
                        <Check size={12} /> Publicado
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-black text-[10px] uppercase flex items-center gap-1 w-fit">
                        <Filter size={12} /> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-sm">{record.input_data?.farmName || 'Sin nombre'}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">{record.input_data?.name || 'Anónimo'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={record.input_data?.socialUrl || '#'}
                      target="_blank"
                      className="text-nounBlue font-bold text-xs flex items-center gap-1 hover:underline"
                    >
                      {(record.input_data?.socialUrl || 'Sin RSS').replace('https://', '')} <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-stone-500">
                    {record.slug}.beenouns.cc
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {record.is_approved ? (
                        <button
                          onClick={() => handleApprove(record.user_id, false)}
                          className="p-2 border-2 border-black bg-white hover:bg-red-50 text-red-600 transition-colors shadow-sm"
                          title="Desaprobar"
                        >
                          <X size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(record.user_id, true)}
                          className="p-2 border-2 border-black bg-nounYellow hover:bg-yellow-400 transition-all shadow-sm flex items-center gap-2"
                        >
                          <Check size={18} /> <span className="font-black text-[10px] uppercase">Aprobar</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRecords.length === 0 && (
          <div className="p-12 text-center text-gray-400 font-bold italic">
            No se encontraron solicitudes en la colmena.
          </div>
        )}
      </div>
    </div>
  );
};
