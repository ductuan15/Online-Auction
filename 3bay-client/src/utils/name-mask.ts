export const nameMasking = (userName: string) => {
  const nameStrArr = userName.trim().split(' ')
  console.log(nameStrArr);
  if (nameStrArr.length === 1) return userName
  return '****' + nameStrArr.at(-1)
}
