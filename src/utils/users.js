let onlineusers = []

export const addUser = (id, room) => {
  const index = onlineusers.findIndex(x => x.room_name === room)
  if (index < 0) {
    onlineusers.push({
      room_name: room,
      users: [id]
    })
  } else {
    onlineusers[index].users.push(id)
  }
}

export const removeUser = (id, room) => {
  const index = onlineusers.findIndex(x => x.room_name === room)
  if (index > 0) {
    for (var i=0; i<onlineusers[index].users.length; i++) {
      if (onlineusers[index].users[i] === id) {
        onlineusers[index].users.splice(i, 1)
      }
    }
  }
}

export const users = (room) => {
  const index = onlineusers.findIndex(x => x.room_name === room) 
  if (index >= 0) {
    return onlineusers[index].users
  }
}