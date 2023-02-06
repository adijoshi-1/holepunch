const { handleError, buildErrorMessage } = require('../../middleware/utils')
const { drive } = require('../../../config')

const sendMessage = async (req, res) => {
  try {
    const messageInstance = req.body
    await drive.put(
      'Messages' + messageInstance.id,
      JSON.stringify(messageInstance)
    )
    res.status(200).send({
      Success: {
        Message: 'Added to database',
      },
    })
  } catch (err) {
    return handleError(res, buildErrorMessage(err.message))
  }
}

module.exports = { sendMessage }
