const express = require('express')

const LawTokenCtrl = require('../controllers/lawToken-ctrl')

const router = express.Router()

router.post('/lawToken', LawTokenCtrl.createLawToken)
router.put('/lawToken/:id', LawTokenCtrl.updateLawToken)
router.delete('/lawToken/:id', LawTokenCtrl.deleteLawToken)
router.get('/lawToken/:id', LawTokenCtrl.getLawTokenById)
router.get('/lawTokens', LawTokenCtrl.getLawTokens)


module.exports = router