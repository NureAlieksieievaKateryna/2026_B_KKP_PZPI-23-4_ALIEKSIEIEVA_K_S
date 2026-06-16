import keycloak from "./keycloak";

export async function apiFetch(url, options = {}) {
  try {
    await keycloak.updateToken(30);

    localStorage.setItem("token", keycloak.token);

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
  } catch (error) {
    keycloak.login();
  }
}    