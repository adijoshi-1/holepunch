const handleError = (res, message) => {
  return res.status(500).json({
    Error: {
      Message: message,
    },
  })
}

module.exports = { handleError }
