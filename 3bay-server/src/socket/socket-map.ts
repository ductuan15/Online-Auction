class SocketMap {
  private map = new Map<number, Set<string>>()
  private reverseMap = new Map<string, number>()
  private readonly verbose: boolean

  constructor(verbose = false) {
    this.verbose = verbose
  }

  add(entityId: number, socketId: string) {
    if (this.map.has(entityId)) {
      this.map.get(entityId)?.add(socketId)
    } else {
      this.map.set(entityId, new Set([socketId]))
    }
    this.reverseMap.set(socketId, entityId)
    if (this.verbose) {
      console.log(this.map)
      console.log(this.reverseMap)
    }
  }

  removeEntity(entityId: number) {
    const auctions = this.map.get(entityId)
    this.map.delete(entityId)
    auctions?.forEach((id) => this.reverseMap.delete(id))
  }

  removeSocketId(socketId: string) {
    const entityId = this.reverseMap.get(socketId)
    this.reverseMap.delete(socketId)
    if (entityId) {
      this.map.get(entityId)?.delete(socketId)
      if (this.map.get(entityId)?.size === 0) {
        this.map.delete(entityId)
      }
    }
    if (this.verbose) {
      console.log(this.map)
      console.log(this.reverseMap)
    }
  }

  getSocketClients(entityId: number): Set<string> | undefined {
    return this.map.get(entityId)
  }
}

export default SocketMap