import './App.css'

import { useState, useEffect } from 'react'
import axios from 'axios'
import DHT from '@hyperswarm/dht-relay'
import Stream from '@hyperswarm/dht-relay/ws'
import Hyperswarm from 'hyperswarm'
import b4a from 'b4a'

export const App = () => {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState([
    {
      id: 0,
      imageUrl: '',
      name: 'Server',
      message: 'Hi, welcome to SimpleChat! Go ahead and send me a message. 😄',
    },
  ])
  const [publicKey] = useState(localStorage.getItem('publicKey') || null)
  const [secretKey] = useState(localStorage.getItem('secretKey') || null)
  const [conns, setConns] = useState([])

  const generateKeyPair = () => {
    const keyPair = DHT.keyPair()
    const publicKey = b4a.toString(keyPair.publicKey, 'hex')
    const secretKey = b4a.toString(keyPair.secretKey, 'hex')

    localStorage.setItem('publicKey', publicKey)
    localStorage.setItem('secretKey', secretKey)

    return keyPair
  }

  const sendMessage = async () => {
    const id = messageList.length
    const imageUrl = ''
    const name = publicKey
    const messageInstance = { id, imageUrl, name, message }
    for (const conn of conns) {
      conn.write(message)
    }
    appendMessage(messageInstance)
    setMessage('')

    await axios.post(process.env.REACT_APP_BACKEND_HOST + 'messages', {
      ...messageInstance,
    })
  }

  const receiveMessage = (name, message) => {
    const id = messageList.length
    const imageUrl = ''
    const messageInstance = {
      id,
      imageUrl,
      name,
      message,
    }
    appendMessage(messageInstance)
  }

  const appendMessage = (messageInstance) => {
    setMessageList((array) => [...array, messageInstance])
  }

  const preFetchData = async () => {
    const { data } = await axios.get(
      process.env.REACT_APP_BACKEND_HOST + 'messages'
    )
    setMessageList((array) => array.concat(data.messages))
  }

  useEffect(() => {
    preFetchData()
  }, [])

  useEffect(() => {
    const topic = b4a.from(process.env.REACT_APP_TOPIC, 'hex')
    let keyPair
    if (publicKey === null) {
      keyPair = generateKeyPair()
    } else {
      keyPair = {
        publicKey: b4a.from(publicKey, 'hex'),
        secretKey: b4a.from(secretKey, 'hex'),
      }
    }

    const ws = new WebSocket('wss://dht2-relay.leet.ar')
    const dht = new DHT(new Stream(true, ws))
    const swarm = new Hyperswarm({ dht, keyPair })

    swarm.on('connection', (conn) => {
      const name = b4a.toString(conn.remotePublicKey, 'hex')
      console.log('*Got connection: ', name, '*')
      setConns((array) => [...array, conn])
      conn.once('close', () =>
        setConns((array) => array.splice(array.indexOf(conn), 1))
      )
      conn.on('data', (data) =>
        receiveMessage(name, b4a.toString(data, 'utf-8'))
      )
    })

    const discovery = swarm.join(topic, { client: true, server: true })
    discovery.flushed().then(() => {
      setLoading(false)
      console.log('Connected to topic:', b4a.toString(topic, 'hex'))
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return loading ? (
    <div>
      <h1>Loading</h1>
    </div>
  ) : (
    <section className="msger">
      <header className="msger-header">
        <div className="msger-header-title">Chat Application</div>
        <div className="msger-header-options">
          <span className="dropdown">
            <i
              className="fas fa-plus"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault()
              }}
            ></i>
            <div className="dropdown-content">
              <p>Join Conversation</p>
              <p>Create Conversation</p>
            </div>
          </span>
        </div>
      </header>

      <main className="msger-chat">
        {messageList.map((data) => {
          return (
            <div
              className={
                data.name === publicKey ? 'msg right-msg' : 'msg left-msg'
              }
              key={data.id}
            >
              <div
                className="msg-img"
                style={{
                  backgroundImage: `url(${data.imageUrl})`,
                }}
              ></div>

              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">
                    {data.name === publicKey
                      ? 'You'
                      : `${data.name.slice(0, 7)}...`}
                  </div>
                </div>

                <div className="msg-text">{data.message}</div>
              </div>
            </div>
          )
        })}
      </main>

      <form className="msger-inputarea">
        <input
          type="text"
          className="msger-input"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => {
            e.preventDefault()
            setMessage(e.target.value)
          }}
        />
        <button
          type="submit"
          className="msger-send-btn"
          onClick={(e) => {
            e.preventDefault()
            sendMessage()
          }}
        >
          Send
        </button>
      </form>
    </section>
  )
}

