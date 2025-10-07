import { useEffect, useState } from "react";
import Api from "../../services/api";
import './users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const userEmail = localStorage.getItem("userEmail");
        const loginTime = localStorage.getItem("loginTime");
        
        if (!token || !userEmail) {
          window.location.href = "/";
          return;
        }

        setCurrentUser(userEmail);

        // Calcula tempo restante
        if (loginTime) {
          calculateTimeRemaining(loginTime);
        }

        // POST request com o email do usuário no body para validar o token
        const response = await Api.post("/users", 
          { email: userEmail },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setUsers(response.data);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        
        // Trata token expirado (5 horas)
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Sessão expirada. Faça login novamente.");
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("loginTime");
          
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          setError("Não foi possível carregar os usuários.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Contador regressivo do token
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    
    if (!loginTime) return;

    const interval = setInterval(() => {
      calculateTimeRemaining(loginTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateTimeRemaining = (loginTime) => {
    const now = new Date().getTime();
    const loginTimestamp = parseInt(loginTime);
    const expirationTime = loginTimestamp + (5 * 60 * 60 * 1000); // 5 horas em milissegundos
    const timeLeft = expirationTime - now;

    if (timeLeft <= 0) {
      setTimeRemaining("Sessão expirada");
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("loginTime");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginTime");
    window.location.href = "/";
  };

  if (loading) return <p className="loading">Carregando usuários...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="users-container">
      <h1>Usuários Cadastrados</h1>
      
      <div className="user-info">
        <p className="current-user">👤 Usuário conectado: <strong>{currentUser}</strong></p>
      </div>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}