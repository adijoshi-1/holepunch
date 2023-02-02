import './App.css'
import loader from './loading.gif'

import { useState, useEffect } from 'react'
import b4a from 'b4a'
import DHT from '@hyperswarm/dht-relay'
import Stream from '@hyperswarm/dht-relay/ws'
import Hyperswarm from 'hyperswarm'
import goodbye from 'graceful-goodbye'

const topic = b4a.from(process.env.REACT_APP_TOPIC, 'hex')

export const App = () => {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messagesList, setmessagesList] = useState([])
  const [conns, setConns] = useState([])

  const sendMessage = (e) => {
    const imageURL =
      'https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916__340.png'
    const name = 'You'
    const side = 'right'
    const actualMessage = message
    const messageListInstance = { imageURL, name, side, actualMessage }
    setmessagesList((array) => [...array, messageListInstance])
    setMessage('')
    for (const conn of conns) {
      conn.write(actualMessage)
    }
  }

  const receiveMessage = (_name, message) => {
    const imageURL = 'https://avatarfiles.alphacoders.com/893/thumb-89303.gif'
    const name = `${_name.slice(0, 7)}...`
    const side = 'left'
    const actualMessage = message
    const messageInstance = { imageURL, name, side, actualMessage }
    setmessagesList((array) => [...array, messageInstance])
  }

  useEffect(() => {
    const ws = new WebSocket('wss://dht2-relay.leet.ar')
    const dht = new DHT(new Stream(true, ws))

    const swarm = new Hyperswarm({ dht })
    goodbye(() => swarm.destroy())

    swarm.on('connection', (conn) => {
      const name = b4a.toString(conn.remotePublicKey, 'hex')
      setConns((array) => [...array, conn])
      conn.once('close', () =>
        setConns((array) => {
          return array.splice(array.indexOf(conn), 1)
        })
      )
      conn.on('data', (data) =>
        receiveMessage(name, b4a.toString(data, 'utf-8'))
      )
    })

    const discovery = swarm.join(topic)
    discovery.flushed().then(() => {
      console.log('Connected to topic:', b4a.toString(topic, 'hex'))
      setLoading(false)
    })
  }, [])

  return loading ? (
    <div>
      <img src={loader} alt="Loader" />
    </div>
  ) : (
    <section className="msger">
      <header className="msger-header">
        <div className="msger-header-title">
          <i className="fas fa-comment-alt"></i> Chat Application P2P
        </div>
        <div className="msger-header-options">
          <span>
            <i className="fas fa-cog"></i>
          </span>
        </div>
      </header>

      <main className="msger-chat">
        <div className="msg left-msg">
          <div
            className="msg-img"
            style={{
              backgroundImage:
                'url(https://avatarfiles.alphacoders.com/893/thumb-89303.gif)',
            }}
          ></div>

          <div className="msg-bubble">
            <div className="msg-info">
              <div className="msg-info-name">Server</div>
            </div>

            <div className="msg-text">
              Hi, welcome to SimpleChat! Go ahead and send me a message. 😄
            </div>
          </div>
        </div>
        {messagesList.map((data) => {
          return (
            <div
              className={
                data.side === 'left' ? 'msg left-msg' : 'msg right-msg'
              }
            >
              <div
                className="msg-img"
                style={{
                  backgroundImage: `url(${data.imageURL})`,
                }}
              ></div>

              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">{data.name}</div>
                </div>

                <div className="msg-text">{data.actualMessage}</div>
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

