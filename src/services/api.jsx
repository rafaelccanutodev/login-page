   import axios from 'axios';
   const Api = axios.create({
     baseURL: 'https://flaskuserapi-production.up.railway.app',  // Sem /api se as rotas forem raiz
     timeout: 10000,  // 10s para evitar timeout
     headers: {
       'Content-Type': 'application/json',
     },
   });
   // Interceptor para logar respostas/erros (adicione temporariamente)
   Api.interceptors.response.use(
     (response) => {
       console.log('Resposta da API:', response);  // Log da resposta completa
       return response;
     },
     (error) => {
       console.error('Erro da API:', error.response || error);  // Log detalhado
       return Promise.reject(error);
     }
   );
   export default Api;
   