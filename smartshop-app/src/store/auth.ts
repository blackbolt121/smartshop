// Guardar los tokens en localStorage
import axios from "axios";
export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

// Recuperar los tokens
export const getAccessToken = () => {
  //validateToken().then(token => {console.log(token)})
  //    .catch(error => {console.log(error);});
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

// Eliminar los tokens (por ejemplo, cuando el usuario cierre sesión)
export const removeTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};


export async function validateToken() {
  const token = localStorage.getItem('access_token');
  console.log(`Bearer ${token}`)
  console.log('http://localhost:8080/auth/validate')
  const headers =  {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  }

  console.log(headers);
  try {
    const response = await axios.post('http://localhost:8080/auth/validate',null,{
      headers: headers,
    });
    console.log(response.status)
    return true

  } catch {
    console.log("Failed to validate token");
    return false;
  }
}
