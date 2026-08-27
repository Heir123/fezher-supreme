import React from 'react'
import { useAuth } from '../../context/AuthContext'

const RoleBasedAccess = ({ 
  children, 
  roles = [], 
  fallback = null,
  adminOnly = false,
  managerOnly = false
}) => {
  const { userRole, isAdmin, isManager } = useAuth()

  // Check if user has required role
  const hasAccess = () => {
    if (adminOnly) return isAdmin
    if (managerOnly) return isManager || isAdmin
    if (roles.length > 0) return roles.includes(userRole)
    return true
  }

  if (!hasAccess()) {
    return fallback
  }

  return children
}

export const AdminOnly = ({ children, fallback = null }) => {
  const { isAdmin } = useAuth()
  return isAdmin ? children : fallback
}

export const ManagerOnly = ({ children, fallback = null }) => {
  const { isManager } = useAuth()
  return isManager ? children : fallback
}

export default RoleBasedAccess