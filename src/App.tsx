import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  LogOut, 
  Edit2, 
  Trash2, 
  Store, 
  X, 
  Save, 
  Loader2,
  PackageOpen
} from 'lucide-react';

import { ImageWithFallback } from './components/figma/ImageWithFallback';

// --- TIPOS ---
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  sku: string;
  image: string;
}

// --- MOCK API (Optimizado) ---
const mockAPI = {
  // Datos iniciales
  initialData: [
    { id: 1, name: 'Zapatillas Running Pro', category: 'calzado', price: 129.99, description: 'Zapatillas de alto rendimiento para corredores profesionales', stock: 15, sku: 'ZAP-RUN-001', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { id: 2, name: 'Balón de Fútbol Oficial', category: 'equipamiento', price: 45.99, description: 'Balón oficial para partidos profesionales', stock: 30, sku: 'BAL-FUT-002', image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400' },
    { id: 3, name: 'Camiseta Deportiva', category: 'ropa', price: 35.99, description: 'Camiseta transpirable para entrenamiento intenso', stock: 50, sku: 'CAM-DEP-003', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { id: 4, name: 'Botella de Agua', category: 'accesorios', price: 15.99, description: 'Botella térmica de 1L para mantenerte hidratado', stock: 100, sku: 'BOT-AGU-004', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400' },
    { id: 5, name: 'Raqueta de Tenis', category: 'equipamiento', price: 199.99, description: 'Raqueta profesional con fibra de carbono', stock: 8, sku: 'RAQ-TEN-005', image: 'https://images.unsplash.com/photo-1617883861744-14159a0a0d85?w=400' }
  ],
  
  // Simulación de latencia
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  async getProducts() {
    await this.delay(300);
    return { data: [...this.initialData], status: 200 }; // Retorna copia para evitar mutaciones directas
  }
};

// --- COMPONENTES AUXILIARES ---

const LoginScreen = ({ onLogin }: { onLogin: (u: string) => void }) => {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.username === 'admin' && form.password === 'admin123') {
      onLogin(form.username);
    } else {
      alert('❌ Usuario o contraseña incorrectos\n\nPrueba con: admin / admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] p-5 font-sans">
      <div className="bg-white p-12 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#4A9FD8] to-[#2E7FB8] rounded-2xl flex items-center justify-center shadow-lg shadow-[#4A9FD8]/30">
            <Store className="text-white w-10 h-10" />
          </div>
          <h1 className="text-gray-800 text-3xl font-bold tracking-tight mb-2">Gestión de Inventario</h1>
          <p className="text-gray-500 text-sm">Sistema para tiendas deportivas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-xs font-bold text-gray-700 uppercase tracking-wide">Usuario</label>
            <input
              type="text"
              className="w-full p-3.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#4A9FD8] focus:ring-4 focus:ring-[#E3F2FD] outline-none transition-all"
              placeholder="Ingresa tu usuario"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-xs font-bold text-gray-700 uppercase tracking-wide">Contraseña</label>
            <input
              type="password"
              className="w-full p-3.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#4A9FD8] focus:ring-4 focus:ring-[#E3F2FD] outline-none transition-all"
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-br from-[#4A9FD8] to-[#2E7FB8] text-white p-4 rounded-xl font-medium shadow-lg shadow-[#4A9FD8]/30 hover:-translate-y-0.5 transition-all">
            Iniciar Sesión
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 text-center">
          <strong className="text-gray-700">Demo:</strong> admin / admin123
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  // Carga inicial
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await mockAPI.getProducts();
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado eficiente con useMemo (evita re-renders innecesarios)
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch = !term || 
        p.name.toLowerCase().includes(term) || 
        p.sku.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, filterCategory, searchTerm]);

  // Manejadores CRUD
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.price) return;

    const newProd = {
      ...currentProduct,
      id: currentProduct.id || Date.now(), // ID temporal simple
      stock: Number(currentProduct.stock),
      price: Number(currentProduct.price),
      image: currentProduct.image || 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400'
    } as Product;

    if (modalMode === 'create') {
      setProducts(prev => [...prev, newProd]);
      alert('✓ Producto creado');
    } else {
      setProducts(prev => prev.map(p => p.id === newProd.id ? newProd : p));
      alert('✓ Producto actualizado');
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const openModal = (mode: 'create' | 'edit', product?: Product) => {
    setModalMode(mode);
    setCurrentProduct(product || { category: 'calzado', stock: 0, price: 0 });
    setShowModal(true);
  };

  if (!isAuthenticated) return <LoginScreen onLogin={(u) => { setIsAuthenticated(true); setUsername(u); }} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] p-5 sm:p-8 font-sans text-gray-800">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <header className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-white/10 mb-8 flex flex-wrap justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-10 bg-gradient-to-b from-[#4A9FD8] to-[#2E7FB8] rounded-full"></div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Sistema de Gestión</h1>
            </div>
            <p className="text-gray-500 text-sm ml-4">Bienvenido, <strong className="text-gray-800">{username}</strong></p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => openModal('create')}
              className="flex items-center gap-2 bg-gradient-to-br from-[#4A9FD8] to-[#2E7FB8] text-white px-6 py-3.5 rounded-xl font-medium shadow-lg shadow-[#4A9FD8]/30 hover:-translate-y-0.5 transition-all"
            >
              <Plus size={20} /> Nuevo Producto
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="px-6 py-3.5 border-2 border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* FILTROS */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-5 items-end">
          <div className="flex-1 min-w-[280px]">
            <label className="block mb-2 text-xs font-bold text-gray-700 uppercase tracking-wide">Buscar</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Nombre, SKU o descripción..." 
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#4A9FD8] focus:ring-4 focus:ring-[#E3F2FD] outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="min-w-[200px]">
            <label className="block mb-2 text-xs font-bold text-gray-700 uppercase tracking-wide">Categoría</label>
            <select 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#4A9FD8] outline-none bg-white cursor-pointer"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="calzado">Calzado</option>
              <option value="ropa">Ropa</option>
              <option value="accesorios">Accesorios</option>
              <option value="equipamiento">Equipamiento</option>
            </select>
          </div>

          <div className="px-6 py-3 bg-blue-50 border border-blue-200 rounded-xl text-center min-w-[120px]">
            <div className="text-2xl font-bold text-gray-800 leading-none">{filteredProducts.length}</div>
            <div className="text-[10px] uppercase font-bold text-gray-500 mt-1">Productos</div>
          </div>
        </div>

        {/* TABLA */}
        {loading ? (
          <div className="bg-white p-20 rounded-2xl text-center border border-gray-200 text-gray-400 flex flex-col items-center">
            <Loader2 className="animate-spin mb-4 text-[#4A9FD8]" size={40} />
            <span className="text-sm font-medium">Cargando inventario...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white p-20 rounded-2xl text-center border border-gray-200 text-gray-400 flex flex-col items-center">
            <PackageOpen className="mb-4 text-gray-300" size={48} />
            <span className="text-lg">No se encontraron productos</span>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2C2C2C] text-white">
                  <tr>
                    {['Imagen', 'SKU', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Acciones'].map((h, i) => (
                      <th key={i} className={`p-5 text-xs font-bold tracking-wider uppercase ${h === 'Precio' ? 'text-right' : h === 'Stock' || h === 'Acciones' ? 'text-center' : 'text-left'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="p-4 pl-6">
                        <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" />
                      </td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-xs font-mono border border-gray-200">
                          {p.sku}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="font-semibold text-gray-800 mb-1">{p.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-2">{p.description}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border bg-blue-50 text-blue-700 border-blue-100">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-gray-700">
                        €{p.price.toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border ${
                          p.stock < 10 
                            ? 'bg-red-50 text-red-700 border-red-100' 
                            : 'bg-green-50 text-green-700 border-green-100'
                        }`}>
                          {p.stock} uds
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal('edit', p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalMode === 'create' ? '✨ Crear Producto' : '✏️ Editar Producto'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-800 transition-colors">
                  <X size={28} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nombre</label>
                    <input required className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#4A9FD8] outline-none transition-all" 
                      value={currentProduct.name || ''} 
                      onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">SKU</label>
                      <input required className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#4A9FD8] outline-none transition-all" 
                        value={currentProduct.sku || ''} 
                        onChange={e => setCurrentProduct({...currentProduct, sku: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Categoría</label>
                      <select className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#4A9FD8] bg-white outline-none" 
                        value={currentProduct.category} 
                        onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                      >
                        {['calzado', 'ropa', 'accesorios', 'equipamiento'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Precio (€)</label>
                      <input type="number" step="0.01" required className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#4A9FD8] outline-none transition-all" 
                        value={currentProduct.price || ''} 
                        onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Stock</label>
                      <input type="number" required className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#4A9FD8] outline-none transition-all" 
                        value={currentProduct.stock || ''} 
                        onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Descripción</label>
                    <textarea rows={3} className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#4A9FD8] outline-none transition-all resize-none" 
                      value={currentProduct.description || ''} 
                      onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">URL Imagen</label>
                    <input type="url" className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#4A9FD8] outline-none transition-all" 
                      value={currentProduct.image || ''} 
                      onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-[#4A9FD8] to-[#2E7FB8] text-white rounded-xl font-medium shadow-lg shadow-[#4A9FD8]/30 hover:-translate-y-0.5 transition-all">
                    <Save size={18} /> Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}