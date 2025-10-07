import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/api';
import './login.css';
import './login-responsive.css';
import Logo from '../../assets/login-page.png';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setSenha('');
    setNome('');
  };

  // -------------------- LOGIN --------------------
  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !senha) {
      alert('Preencha email e senha!');
      return;
    }
    setLoading(true);
    try {
      const response = await Api.post('/login', {
        email,
        password: senha,
      });
      console.log('Login bem-sucedido:', response.data);

      // Salva token e email no localStorage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userEmail', email);

      // Redireciona para a página de usuários
      navigate('/users');
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      alert(`Erro ao fazer login: ${error.response?.data?.message || 'Verifique suas credenciais.'}`);
    } finally {
      setLoading(false);
    }
  }

  // -------------------- CADASTRO --------------------
  async function handleRegister(e) {
    e.preventDefault();
    if (!nome || !email || !senha) {
      alert('Preencha todos os campos!');
      return;
    }
    setLoading(true);
    try {
      const response = await Api.post('/register', {
        name: nome,
        email,
        password: senha,
      });
      console.log('Cadastro realizado:', response.data);
      alert('Cadastro concluído!');
      setIsRegister(false);
      resetForm();
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      alert(`Erro ao cadastrar: ${error.response?.data?.message || 'Tente novamente.'}`);
    } finally {
      setLoading(false);
    }
  }

  const switchToRegister = () => {
    resetForm();
    setIsRegister(true);
  };

  const switchToLogin = () => {
    resetForm();
    setIsRegister(false);
  };

  // -------------------- RENDER --------------------
  return (
    <section className="section-login">
      {!isRegister ? (
        <form className="form-login" onSubmit={handleLogin}>
          <img src={Logo} alt="Logo" className="logo-login" />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="E-mail:"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            placeholder="Senha:"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
          />
          <div className="btn-group-cadastro">
            <button type="submit" className="btn-entrar" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button type="button" className="btn-cadastrar" onClick={switchToRegister} disabled={loading}>
              Cadastrar
            </button>
          </div>
        </form>
      ) : (
        <form className="form-login form-cadastro" onSubmit={handleRegister}>
          <img src={Logo} alt="Logo" className="logo-login" />
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            placeholder="Nome completo:"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
          />
          <label htmlFor="email-cadastro">Email</label>
          <input
            type="email"
            placeholder="E-mail:"
            id="email-cadastro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <label htmlFor="senha-cadastro">Senha</label>
          <input
            type="password"
            placeholder="Senha:"
            id="senha-cadastro"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
          />
          <div className="btn-group-cadastro">
            <button type="submit" className="btn-entrar" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
            <button type="button" className="btn-cadastrar" onClick={switchToLogin} disabled={loading}>
              Voltar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}