export const useConnectionStatus = () => {
  const connectionStatus = useState('connectionStatus', () => ({
    isConnected: true,
    isRequesting: false
  }))

  const setConnected = (connected) => {
    if (connectionStatus.value) {
      connectionStatus.value.isConnected = connected
    }
  }

  const setRequesting = (requesting) => {
    if (connectionStatus.value) {
      connectionStatus.value.isRequesting = requesting
    }
  }

  const pulse = () => {
    if (!connectionStatus.value) return
    connectionStatus.value.isRequesting = true
    setTimeout(() => {
      if (connectionStatus.value) {
        connectionStatus.value.isRequesting = false
      }
    }, 500)
  }

  return {
    connectionStatus,
    setConnected,
    setRequesting,
    pulse
  }
}