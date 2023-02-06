const { handleError, buildErrorMessage } = require('../../middleware/utils')
const { drive } = require('../../../config')

const getMessagesList = async (req, res) => {
  try {
    const messages = []
    for await (const entry of drive.entries()) {
      messages.push(JSON.parse((await drive.get(entry.key)).toString()))
    }

    res.status(200).send({ messages })
  } catch (err) {
    return handleError(res, buildErrorMessage(err.message))
  }
}

module.exports = { getMessagesList }
