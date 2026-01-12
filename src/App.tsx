import { useState, useEffect } from 'react';

// Simulación de API REST para gestión de productos
const mockAPI = {
  products: [
    {
      id: 1,
      name: 'Zapatillas Running Pro',
      category: 'calzado',
      price: 129.99,
      description: 'Zapatillas de alto rendimiento para corredores profesionales',
      stock: 15,
      sku: 'ZAP-RUN-001',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
    },
    {
      id: 2,
      name: 'Balón de Fútbol Oficial',
      category: 'equipamiento',
      price: 45.99,
      description: 'Balón oficial para partidos profesionales',
      stock: 30,
      sku: 'BAL-FUT-002',
      image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400'
    },
    {
      id: 3,
      name: 'Camiseta Deportiva',
      category: 'ropa',
      price: 35.99,
      description: 'Camiseta transpirable para entrenamiento intenso',
      stock: 50,
      sku: 'CAM-DEP-003',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
    },
    {
      id: 4,
      name: 'Botella de Agua',
      category: 'accesorios',
      price: 15.99,
      description: 'Botella térmica de 1L para mantenerte hidratado',
      stock: 100,
      sku: 'BOT-AGU-004',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'
    },
    {
      id: 5,
      name: 'Raqueta de Tenis',
      category: 'equipamiento',
      price: 199.99,
      description: 'Raqueta profesional con fibra de carbono',
      stock: 8,
      sku: 'RAQ-TEN-005',
      image: 'https://images.unsplash.com/photo-1617883861744-14159a0a0d85?w=400'
    }
  ],

  getProducts: function() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: this.products, status: 200 });
      }, 300);
    });
  },

  getProduct: function(id: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = this.products.find(p => p.id === id);
        resolve({ data: product, status: product ? 200 : 404 });
      }, 200);
    });
  },

  createProduct: function(product: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct = {
          ...product,
          id: Math.max(...this.products.map(p => p.id), 0) + 1
        };
        this.products.push(newProduct);
        resolve({ data: newProduct, status: 201 });
      }, 400);
    });
  },

  updateProduct: function(id: number, updatedData: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...updatedData };
          resolve({ data: this.products[index], status: 200 });
        } else {
          resolve({ data: null, status: 404 });
        }
      }, 400);
    });
  },

  deleteProduct: function(id: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products.splice(index, 1);
          resolve({ data: { message: 'Producto eliminado' }, status: 200 });
        } else {
          resolve({ data: null, status: 404 });
        }
      }, 300);
    });
  }
};

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

const styles = {
  primaryBlue: '#4A9FD8',
  lightBlue: '#E3F2FD',
  darkBlue: '#2E7FB8',
  darkGray: '#2C2C2C',
  mediumGray: '#4A4A4A',
  lightGray: '#F5F5F5',
  borderGray: '#E0E0E0',
  white: '#FFFFFF'
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'calzado',
    price: '',
    description: '',
    stock: '',
    sku: '',
    image: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await mockAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      category: 'calzado',
      price: '',
      description: '',
      stock: '',
      sku: '',
      image: ''
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock.toString(),
      sku: product.sku,
      image: product.image
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock || !formData.sku) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
      stock: parseInt(formData.stock),
      sku: formData.sku,
      image: formData.image || 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400'
    };

    try {
      if (modalMode === 'create') {
        await mockAPI.createProduct(productData);
        alert('✓ Producto creado exitosamente');
      } else {
        await mockAPI.updateProduct(selectedProduct!.id, productData);
        alert('✓ Producto actualizado exitosamente');
      }
      
      await loadProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('× Error al guardar producto');
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      return;
    }

    try {
      await mockAPI.deleteProduct(product.id);
      alert('✓ Producto eliminado exitosamente');
      await loadProducts();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('× Error al eliminar producto');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulación de autenticación - Usuario: admin, Password: admin123
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsAuthenticated(true);
      setUsername(loginForm.username);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('❌ Usuario o contraseña incorrectos\n\nPrueba con:\nUsuario: admin\nContraseña: admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  // Pantalla de Login
  if (!isAuthenticated) {
    return (
      <div style={{ 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: styles.white,
          padding: '50px 60px',
          borderRadius: '20px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          border: `1px solid ${styles.borderGray}`
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: `linear-gradient(135deg, ${styles.primaryBlue} 0%, ${styles.darkBlue} 100%)`,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              boxShadow: '0 8px 24px rgba(74, 159, 216, 0.3)'
            }}>
              🏪
            </div>
            <h1 style={{ 
              color: styles.darkGray, 
              margin: '0 0 8px 0',
              fontSize: '28px',
              letterSpacing: '-0.5px'
            }}>
              Gestión de Inventario
            </h1>
            <p style={{ 
              color: styles.mediumGray, 
              margin: 0,
              fontSize: '15px'
            }}>
              Sistema para tiendas deportivas
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: styles.darkGray,
                fontSize: '13px',
                letterSpacing: '0.3px',
                textTransform: 'uppercase'
              }}>
                Usuario
              </label>
              <input
                type="text"
                name="username"
                value={loginForm.username}
                onChange={handleLoginInputChange}
                placeholder="Ingresa tu usuario"
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: `2px solid ${styles.borderGray}`,
                  borderRadius: '10px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = styles.primaryBlue;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${styles.lightBlue}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = styles.borderGray;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: styles.darkGray,
                fontSize: '13px',
                letterSpacing: '0.3px',
                textTransform: 'uppercase'
              }}>
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginInputChange}
                placeholder="Ingresa tu contraseña"
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: `2px solid ${styles.borderGray}`,
                  borderRadius: '10px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = styles.primaryBlue;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${styles.lightBlue}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = styles.borderGray;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: `linear-gradient(135deg, ${styles.primaryBlue} 0%, ${styles.darkBlue} 100%)`,
                color: styles.white,
                border: 'none',
                padding: '16px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: '0 4px 16px rgba(74, 159, 216, 0.3)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(74, 159, 216, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(74, 159, 216, 0.3)';
              }}
            >
              Iniciar Sesión
            </button>
          </form>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: styles.lightGray,
            borderRadius: '10px',
            fontSize: '13px',
            color: styles.mediumGray,
            textAlign: 'center'
          }}>
            <strong style={{ color: styles.darkGray }}>Demo:</strong> admin / admin123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      minHeight: '100vh',
      padding: '30px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{
          background: styles.white,
          padding: '35px 40px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          marginBottom: '30px',
          border: `1px solid rgba(255,255,255,0.1)`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  width: '6px',
                  height: '40px',
                  background: `linear-gradient(180deg, ${styles.primaryBlue} 0%, ${styles.darkBlue} 100%)`,
                  borderRadius: '3px'
                }}></div>
                <h1 style={{ 
                  color: styles.darkGray, 
                  margin: 0,
                  fontSize: '32px',
                  letterSpacing: '-0.5px'
                }}>
                  Sistema de Gestión de Inventario
                </h1>
              </div>
              <p style={{ 
                color: styles.mediumGray, 
                margin: '0 0 0 18px',
                fontSize: '15px',
                letterSpacing: '0.3px'
              }}>
                Bienvenido, <strong>{username}</strong> • Panel de administración para control de stock
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                onClick={openCreateModal}
                style={{
                  background: `linear-gradient(135deg, ${styles.primaryBlue} 0%, ${styles.darkBlue} 100%)`,
                  color: styles.white,
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 12px rgba(74, 159, 216, 0.3)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.3px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(74, 159, 216, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 159, 216, 0.3)';
                }}
              >
                <span style={{ fontSize: '18px' }}>+</span>
                Nuevo Producto
              </button>
              <button 
                onClick={handleLogout}
                style={{
                  background: styles.white,
                  color: styles.mediumGray,
                  border: `2px solid ${styles.borderGray}`,
                  padding: '14px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.3px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = styles.lightGray;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = styles.white;
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div style={{
          background: styles.white,
          padding: '28px 32px',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          marginBottom: '25px',
          border: `1px solid ${styles.borderGray}`
        }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1', minWidth: '280px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: styles.darkGray,
                fontSize: '13px',
                letterSpacing: '0.3px',
                textTransform: 'uppercase'
              }}>
                Buscar Producto
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre, SKU o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${styles.borderGray}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = styles.primaryBlue;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${styles.lightBlue}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = styles.borderGray;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <div style={{ minWidth: '200px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: styles.darkGray,
                fontSize: '13px',
                letterSpacing: '0.3px',
                textTransform: 'uppercase'
              }}>
                Categoría
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${styles.borderGray}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  background: styles.white
                }}
              >
                <option value="all">Todas las categorías</option>
                <option value="calzado">Calzado</option>
                <option value="ropa">Ropa</option>
                <option value="accesorios">Accesorios</option>
                <option value="equipamiento">Equipamiento</option>
              </select>
            </div>
            <div style={{ 
              padding: '12px 20px',
              background: `linear-gradient(135deg, ${styles.lightBlue} 0%, #F0F8FF 100%)`,
              borderRadius: '8px',
              border: `1px solid ${styles.primaryBlue}`,
              minWidth: '140px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', color: styles.darkGray, marginBottom: '2px' }}>
                {filteredProducts.length}
              </div>
              <div style={{ fontSize: '12px', color: styles.mediumGray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Productos
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div style={{
            background: styles.white,
            padding: '80px',
            borderRadius: '12px',
            textAlign: 'center',
            color: styles.mediumGray,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: `1px solid ${styles.borderGray}`
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
            <div style={{ fontSize: '16px' }}>Cargando productos...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            background: styles.white,
            padding: '80px',
            borderRadius: '12px',
            textAlign: 'center',
            color: styles.mediumGray,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: `1px solid ${styles.borderGray}`
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
            <div style={{ fontSize: '16px' }}>No se encontraron productos</div>
          </div>
        ) : (
          <div style={{
            background: styles.white,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
            border: `1px solid ${styles.borderGray}`
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ 
                    background: `linear-gradient(135deg, ${styles.darkGray} 0%, #3A3A3A 100%)`,
                    color: styles.white 
                  }}>
                    <th style={{ padding: '18px 20px', textAlign: 'left', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Imagen</th>
                    <th style={{ padding: '18px 20px', textAlign: 'left', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>SKU</th>
                    <th style={{ padding: '18px 20px', textAlign: 'left', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Nombre</th>
                    <th style={{ padding: '18px 20px', textAlign: 'left', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Categoría</th>
                    <th style={{ padding: '18px 20px', textAlign: 'right', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Precio</th>
                    <th style={{ padding: '18px 20px', textAlign: 'center', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Stock</th>
                    <th style={{ padding: '18px 20px', textAlign: 'center', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr 
                      key={product.id}
                      style={{
                        borderBottom: `1px solid ${styles.borderGray}`,
                        background: index % 2 === 0 ? styles.white : styles.lightGray,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FAFAFA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? styles.white : styles.lightGray;
                      }}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: `2px solid ${styles.borderGray}`
                          }}
                        />
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <code style={{ 
                          background: styles.lightGray, 
                          padding: '6px 12px', 
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: styles.darkGray,
                          border: `1px solid ${styles.borderGray}`
                        }}>
                          {product.sku}
                        </code>
                      </td>
                      <td style={{ padding: '16px 20px', maxWidth: '300px' }}>
                        <div style={{ fontSize: '15px', color: styles.darkGray, marginBottom: '4px' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '13px', color: styles.mediumGray, lineHeight: '1.4' }}>
                          {product.description}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          background: `linear-gradient(135deg, ${styles.lightBlue} 0%, #F0F8FF 100%)`,
                          color: styles.darkGray,
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          border: `1px solid ${styles.primaryBlue}`
                        }}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <span style={{ fontSize: '17px', color: styles.darkGray }}>
                          €{product.price.toFixed(2)}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <span style={{
                          background: product.stock < 10 ? '#FFE5E5' : '#E8F5E9',
                          color: product.stock < 10 ? '#D32F2F' : '#2E7D32',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          border: `1px solid ${product.stock < 10 ? '#FFCDD2' : '#C8E6C9'}`
                        }}>
                          {product.stock} uds
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => openEditModal(product)}
                            style={{
                              background: styles.white,
                              color: styles.darkGray,
                              border: `2px solid ${styles.primaryBlue}`,
                              padding: '8px 16px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = styles.primaryBlue;
                              e.currentTarget.style.color = styles.white;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = styles.white;
                              e.currentTarget.style.color = styles.darkGray;
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            style={{
                              background: styles.white,
                              color: '#D32F2F',
                              border: '2px solid #FFCDD2',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#D32F2F';
                              e.currentTarget.style.color = styles.white;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = styles.white;
                              e.currentTarget.style.color = '#D32F2F';
                            }}
                          >
                            🗑️
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

        {/* Modal Create/Edit */}
        {showModal && (
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(44, 44, 44, 0.7)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <div style={{
              background: styles.white,
              padding: '40px',
              borderRadius: '16px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              border: `1px solid ${styles.borderGray}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: `2px solid ${styles.primaryBlue}`
              }}>
                <h2 style={{ 
                  color: styles.darkGray, 
                  margin: 0,
                  fontSize: '26px',
                  letterSpacing: '-0.5px'
                }}>
                  {modalMode === 'create' ? '✨ Crear Nuevo Producto' : '✏️ Editar Producto'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '32px',
                    cursor: 'pointer',
                    color: styles.mediumGray,
                    lineHeight: '1',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = styles.darkGray;
                    e.currentTarget.style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = styles.mediumGray;
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: styles.darkGray,
                    fontSize: '13px',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}>
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Zapatillas Running Pro"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${styles.borderGray}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = styles.primaryBlue;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${styles.lightBlue}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = styles.borderGray;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: styles.darkGray,
                    fontSize: '13px',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}>
                    SKU (Código) *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Ej: ZAP-RUN-001"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${styles.borderGray}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = styles.primaryBlue;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${styles.lightBlue}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = styles.borderGray;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: styles.darkGray,
                      fontSize: '13px',
                      letterSpacing: '0.3px',
                      textTransform: 'uppercase'
                    }}>
                      Categoría *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${styles.borderGray}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer',
                        background: styles.white
                      }}
                    >
                      <option value="calzado">Calzado</option>
                      <option value="ropa">Ropa</option>
                      <option value="accesorios">Accesorios</option>
                      <option value="equipamiento">Equipamiento</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: styles.darkGray,
                      fontSize: '13px',
                      letterSpacing: '0.3px',
                      textTransform: 'uppercase'
                    }}>
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${styles.borderGray}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = styles.primaryBlue;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${styles.lightBlue}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = styles.borderGray;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: styles.darkGray,
                    fontSize: '13px',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}>
                    Precio (€) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${styles.borderGray}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = styles.primaryBlue;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${styles.lightBlue}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = styles.borderGray;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: styles.darkGray,
                    fontSize: '13px',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}>
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descripción del producto..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${styles.borderGray}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = styles.primaryBlue;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${styles.lightBlue}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = styles.borderGray;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: styles.darkGray,
                    fontSize: '13px',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}>
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${styles.borderGray}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = styles.primaryBlue;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${styles.lightBlue}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = styles.borderGray;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      background: styles.white,
                      color: styles.mediumGray,
                      border: `2px solid ${styles.borderGray}`,
                      padding: '12px 28px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = styles.lightGray;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = styles.white;
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: `linear-gradient(135deg, ${styles.primaryBlue} 0%, ${styles.darkBlue} 100%)`,
                      color: styles.white,
                      border: 'none',
                      padding: '12px 32px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(74, 159, 216, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(74, 159, 216, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 159, 216, 0.3)';
                    }}
                  >
                    {modalMode === 'create' ? '✓ Crear Producto' : '💾 Guardar Cambios'}
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