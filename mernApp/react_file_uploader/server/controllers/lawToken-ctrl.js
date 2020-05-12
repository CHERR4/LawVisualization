const LawToken = require('../models/lawToken-model')

createLawToken = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a token',
        })
    }

    const lawToken = new LawToken(body)

    if (!lawToken) {
        return res.status(400).json({ success: false, error: err })
    }

    lawToken
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: lawToken._id,
                message: 'Law token created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Law token not created!',
            })
        })
}

updateLawToken = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    LawToken.findOne({ _id: req.params.id }, (err, lawToken) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'LawToken not found!',
            })
        }
        lawToken.name = body.name
        lawToken.time = body.time
        lawToken.rating = body.rating
        lawToken
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: lawToken._id,
                    message: 'Law token updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Law token not updated!',
                })
            })
    })
}

deleteLawToken = async (req, res) => {
    await LawToken.findOneAndDelete({ _id: req.params.id }, (err, lawToken) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!lawToken) {
            return res
                .status(404)
                .json({ success: false, error: `Law token not found` })
        }

        return res.status(200).json({ success: true, data: lawToken })
    }).catch(err => console.log(err))
}

getLawTokenById = async (req, res) => {
    await LawToken.findOne({ _id: req.params.id }, (err, lawToken) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!lawToken) {
            return res
                .status(404)
                .json({ success: false, error: `Law token not found` })
        }
        return res.status(200).json({ success: true, data: lawToken })
    }).catch(err => console.log(err))
}

getLawTokens = async (req, res) => {
    await LawToken.find({}, (err, lawTokens) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!lawTokens.length) {
            return res
                .status(404)
                .json({ success: false, error: `Law token not found` })
        }
        return res.status(200).json({ success: true, data: lawTokens })
    }).catch(err => console.log(err))
}



module.exports = {
    createLawToken,
    updateLawToken,
    deleteLawToken,
    getLawTokens,
    getLawTokenById
}