import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

// 密码哈希
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

// 验证密码
export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

// 验证密码强度
export const validatePasswordStrength = (password) => {
  // 至少8位,包含字母和数字
  const minLength = password.length >= 8
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  return {
    valid: minLength && hasLetter && hasNumber,
    message: !minLength ? '密码长度至少8位' : 
             !hasLetter ? '密码必须包含字母' : 
             !hasNumber ? '密码必须包含数字' : 
             '密码强度符合要求'
  }
}
