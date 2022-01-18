export const nameMasking = (userName: string) => {
  const nameStrArr = userName.trim().split(' ')
  if (nameStrArr.length === 1) return userName
  return '****' + nameStrArr.at(-1)
}
