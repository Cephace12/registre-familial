import { ref } from 'vue'

const ADMIN_PIN = 'KINHOHEGBE'
const isAdmin = ref(sessionStorage.getItem('isAdmin') === 'true')

export function useAdmin() {
  function login(pin) {
    if (pin.trim() === ADMIN_PIN) {
      isAdmin.value = true
      sessionStorage.setItem('isAdmin', 'true')
      return true
    }
    return false
  }

  function logout() {
    isAdmin.value = false
    sessionStorage.removeItem('isAdmin')
  }

  return { isAdmin, login, logout }
}
