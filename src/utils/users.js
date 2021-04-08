export let onlineusers = []

export const addUser = (username) => {
  onlineusers.push(username)
}

export const removeUser = (id) => {
  for(var i=0; i<onlineusers.length; i++) {
    if (onlineusers[i] === id) {
      onlineusers.splice(i, 1)
    }
  }
}